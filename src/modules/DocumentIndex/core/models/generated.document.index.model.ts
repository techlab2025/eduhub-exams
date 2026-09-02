import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';
import {
  EditableDocumentIndexItem,
  type DocumentIndexRowType,
} from './editable.document.index.item.model';
import DocumentIndexChapterModel from './document.index.chapter.model';
import { mapDocumentIndexNodeData, toEditableDocumentIndexItem } from './document.index.node.model';

const hierarchyLevel = (depth: number): DocumentIndexLevelTypeEnum => {
  if (depth === 0) return DocumentIndexLevelTypeEnum.CHAPTER;
  if (depth === 1) return DocumentIndexLevelTypeEnum.LESSON;
  return DocumentIndexLevelTypeEnum.TOPIC;
};

const hierarchyRowType = (depth: number): DocumentIndexRowType =>
  depth <= 1 ? 'subject' : 'topic';

const normalizeRowType = (value: unknown): DocumentIndexRowType => {
  const type = String(value ?? '').toLowerCase();
  if (type === 'subject' || type === 'chapter' || type === 'lesson' || type === 'topic') {
    return type;
  }
  return 'topic';
};

const rowHierarchyLevel = (type: DocumentIndexRowType): DocumentIndexLevelTypeEnum => {
  if (type === 'lesson') return DocumentIndexLevelTypeEnum.LESSON;
  if (type === 'topic') return DocumentIndexLevelTypeEnum.TOPIC;
  return DocumentIndexLevelTypeEnum.CHAPTER;
};

const mapFlatRow = (json: unknown): EditableDocumentIndexItem => {
  const data = SaftyConditions.objectValue(json);
  const type = normalizeRowType(data.type);
  const fromPdf = SaftyConditions.numberValue(data.from_pdf ?? data.fromPdf);
  const toPdf = SaftyConditions.numberValue(data.to_pdf ?? data.toPdf);
  const fallbackPageLabel = fromPdf || toPdf ? `${fromPdf}-${toPdf}` : '';

  return new EditableDocumentIndexItem({
    id: SaftyConditions.numberValue(data.id),
    level: rowHierarchyLevel(type),
    type,
    levelLabel: String(data.level ?? data.levelLabel ?? ''),
    depth: SaftyConditions.numberValue(data.depth),
    title: String(data.title ?? ''),
    fromPdf,
    toPdf,
    printedPageLabel: String(data.printed_page_label ?? data.printedPageLabel ?? fallbackPageLabel),
    needsAdminReview: SaftyConditions.booleanValue(
      data.needs_admin_review ?? data.needsAdminReview,
    ),
  });
};

const flattenHierarchy = (json: unknown, depth = 0): EditableDocumentIndexItem[] => {
  const data = SaftyConditions.objectValue(json);
  if (Object.keys(data).length === 0) return [];

  const item = toEditableDocumentIndexItem(
    mapDocumentIndexNodeData(data),
    hierarchyLevel(depth),
    depth,
    hierarchyRowType(depth),
  );
  const children = Array.isArray(data.children) ? data.children : [];
  return [item, ...children.flatMap((child) => flattenHierarchy(child, depth + 1))];
};

export default class GeneratedDocumentIndexModel {
  public readonly bookId: number;
  public readonly bookStatus: string;
  public readonly chapters: DocumentIndexChapterModel[];
  private readonly hierarchyItems: EditableDocumentIndexItem[];

  constructor(data: {
    bookId: number;
    bookStatus: string;
    chapters: DocumentIndexChapterModel[];
    hierarchyItems?: EditableDocumentIndexItem[];
  }) {
    this.bookId = data.bookId;
    this.bookStatus = data.bookStatus;
    this.chapters = data.chapters;
    this.hierarchyItems = data.hierarchyItems ?? [];
    Object.freeze(this);
  }

  get editableItems(): EditableDocumentIndexItem[] {
    return this.hierarchyItems.length > 0
      ? this.hierarchyItems
      : this.chapters.flatMap((chapter) => chapter.toEditableItems());
  }

  static fromJson(json: unknown): GeneratedDocumentIndexModel {
    const data = SaftyConditions.objectValue(json);
    const subject = SaftyConditions.objectValue(data.subject);
    const hierarchyItems = Array.isArray(data.rows)
      ? data.rows.map(mapFlatRow)
      : Object.keys(subject).length > 0
        ? flattenHierarchy(subject)
        : [];
    return new GeneratedDocumentIndexModel({
      bookId: SaftyConditions.numberValue(data.book_id ?? data.bookId),
      bookStatus: String(data.book_status ?? data.bookStatus ?? ''),
      chapters: (Array.isArray(data.chapters) ? data.chapters : []).map(
        DocumentIndexChapterModel.fromJson,
      ),
      hierarchyItems,
    });
  }

  static readonly example = GeneratedDocumentIndexModel.fromJson({
    book_id: 10,
    book_status: 'completed',
    chapters: [
      {
        id: 22,
        position: 0,
        number: '1',
        title: 'Economic Resources and Activities',
        description: null,
        source_pages: { start: 7, end: 31 },
        confidence: 0.99,
        is_inferred: false,
        inference_level: 'explicit',
        lessons: [
          {
            id: 84,
            position: 0,
            number: '1',
            title: 'Main Agricultural Regions',
            description: null,
            source_pages: { start: 9, end: 14 },
            confidence: 0.99,
            is_inferred: false,
            inference_level: 'explicit',
            topics: [
              {
                id: 221,
                position: 0,
                title: 'Simple Agriculture',
                description: null,
                important_concepts: [],
                subtopics: [],
                source_pages: { start: 10, end: 10 },
                confidence: 0.98,
                is_inferred: false,
                inference_level: 'explicit',
              },
            ],
          },
        ],
      },
    ],
  });
}
