import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';
import type {
  DocumentIndexRowType,
  EditableDocumentIndexItem,
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
    return new GeneratedDocumentIndexModel({
      bookId: SaftyConditions.numberValue(data.book_id ?? data.bookId),
      bookStatus: String(data.book_status ?? data.bookStatus ?? ''),
      chapters: (Array.isArray(data.chapters) ? data.chapters : []).map(
        DocumentIndexChapterModel.fromJson,
      ),
      hierarchyItems: Object.keys(subject).length > 0 ? flattenHierarchy(subject) : [],
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
