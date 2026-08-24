import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import type {
  DocumentIndexLevel,
  EditableDocumentIndexItem,
} from './editable.document.index.item.model';

export interface DocumentIndexSourcePages {
  start: number;
  end: number;
}

interface DocumentIndexNodeData {
  id: number;
  position: number;
  title: string;
  description: string | null;
  sourcePages: DocumentIndexSourcePages;
  sourceHash: string;
  sourceUrlJson: string;
  sourceUrlTxt: string;
  confidence: number;
  isInferred: boolean;
  inferenceLevel: string;
  printedPageLabel: string;
}

const mapSourcePages = (value: unknown): DocumentIndexSourcePages => {
  const pages = SaftyConditions.objectValue(value);
  return {
    start: SaftyConditions.numberValue(pages.start),
    end: SaftyConditions.numberValue(pages.end),
  };
};

const mapNodeData = (json: unknown): DocumentIndexNodeData => {
  const data = SaftyConditions.objectValue(json);
  const sourcePages = mapSourcePages(data.source_pages ?? data.sourcePages);
  const fallbackPageLabel =
    sourcePages.start || sourcePages.end ? `${sourcePages.start}-${sourcePages.end}` : '';

  return {
    id: SaftyConditions.numberValue(data.id),
    position: SaftyConditions.numberValue(data.position),
    title: String(data.title ?? ''),
    description: data.description == null ? null : String(data.description),
    sourcePages,
    sourceHash: String(data.source_hash ?? data.sourceHash ?? ''),
    sourceUrlJson: String(data.source_url_json ?? data.sourceUrlJson ?? ''),
    sourceUrlTxt: String(data.source_url_txt ?? data.sourceUrlTxt ?? ''),
    confidence: SaftyConditions.numberValue(data.confidence),
    isInferred: SaftyConditions.booleanValue(data.is_inferred ?? data.isInferred),
    inferenceLevel: String(data.inference_level ?? data.inferenceLevel ?? ''),
    printedPageLabel: String(data.printed_page_label ?? data.printedPageLabel ?? fallbackPageLabel),
  };
};

const toEditableItem = (
  node: DocumentIndexNodeData,
  level: DocumentIndexLevel,
): EditableDocumentIndexItem => ({
  id: node.id,
  level,
  title: node.title,
  fromPdf: node.sourcePages.start,
  toPdf: node.sourcePages.end,
  printedPageLabel: node.printedPageLabel,
});

export class DocumentIndexTopicModel implements DocumentIndexNodeData {
  public readonly id: number;
  public readonly position: number;
  public readonly title: string;
  public readonly description: string | null;
  public readonly sourcePages: DocumentIndexSourcePages;
  public readonly sourceHash: string;
  public readonly sourceUrlJson: string;
  public readonly sourceUrlTxt: string;
  public readonly confidence: number;
  public readonly isInferred: boolean;
  public readonly inferenceLevel: string;
  public readonly printedPageLabel: string;
  public readonly importantConcepts: unknown[];
  public readonly subtopics: unknown[];

  constructor(
    data: DocumentIndexNodeData & { importantConcepts: unknown[]; subtopics: unknown[] },
  ) {
    this.id = data.id;
    this.position = data.position;
    this.title = data.title;
    this.description = data.description;
    this.sourcePages = data.sourcePages;
    this.sourceHash = data.sourceHash;
    this.sourceUrlJson = data.sourceUrlJson;
    this.sourceUrlTxt = data.sourceUrlTxt;
    this.confidence = data.confidence;
    this.isInferred = data.isInferred;
    this.inferenceLevel = data.inferenceLevel;
    this.printedPageLabel = data.printedPageLabel;
    this.importantConcepts = data.importantConcepts;
    this.subtopics = data.subtopics;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexTopicModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexTopicModel({
      ...mapNodeData(data),
      importantConcepts: Array.isArray(data.important_concepts) ? data.important_concepts : [],
      subtopics: Array.isArray(data.subtopics) ? data.subtopics : [],
    });
  }

  toEditableItem(): EditableDocumentIndexItem {
    return toEditableItem(this, 'topic');
  }
}

export class DocumentIndexLessonModel implements DocumentIndexNodeData {
  public readonly id: number;
  public readonly position: number;
  public readonly number: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly sourcePages: DocumentIndexSourcePages;
  public readonly sourceHash: string;
  public readonly sourceUrlJson: string;
  public readonly sourceUrlTxt: string;
  public readonly confidence: number;
  public readonly isInferred: boolean;
  public readonly inferenceLevel: string;
  public readonly printedPageLabel: string;
  public readonly topics: DocumentIndexTopicModel[];

  constructor(data: DocumentIndexNodeData & { number: string; topics: DocumentIndexTopicModel[] }) {
    this.id = data.id;
    this.position = data.position;
    this.number = data.number;
    this.title = data.title;
    this.description = data.description;
    this.sourcePages = data.sourcePages;
    this.sourceHash = data.sourceHash;
    this.sourceUrlJson = data.sourceUrlJson;
    this.sourceUrlTxt = data.sourceUrlTxt;
    this.confidence = data.confidence;
    this.isInferred = data.isInferred;
    this.inferenceLevel = data.inferenceLevel;
    this.printedPageLabel = data.printedPageLabel;
    this.topics = data.topics;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexLessonModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexLessonModel({
      ...mapNodeData(data),
      number: String(data.number ?? ''),
      topics: (Array.isArray(data.topics) ? data.topics : []).map(DocumentIndexTopicModel.fromJson),
    });
  }

  toEditableItems(): EditableDocumentIndexItem[] {
    return [toEditableItem(this, 'lesson'), ...this.topics.map((topic) => topic.toEditableItem())];
  }
}

export class DocumentIndexChapterModel implements DocumentIndexNodeData {
  public readonly id: number;
  public readonly position: number;
  public readonly number: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly sourcePages: DocumentIndexSourcePages;
  public readonly sourceHash: string;
  public readonly sourceUrlJson: string;
  public readonly sourceUrlTxt: string;
  public readonly confidence: number;
  public readonly isInferred: boolean;
  public readonly inferenceLevel: string;
  public readonly printedPageLabel: string;
  public readonly lessons: DocumentIndexLessonModel[];

  constructor(
    data: DocumentIndexNodeData & { number: string; lessons: DocumentIndexLessonModel[] },
  ) {
    this.id = data.id;
    this.position = data.position;
    this.number = data.number;
    this.title = data.title;
    this.description = data.description;
    this.sourcePages = data.sourcePages;
    this.sourceHash = data.sourceHash;
    this.sourceUrlJson = data.sourceUrlJson;
    this.sourceUrlTxt = data.sourceUrlTxt;
    this.confidence = data.confidence;
    this.isInferred = data.isInferred;
    this.inferenceLevel = data.inferenceLevel;
    this.printedPageLabel = data.printedPageLabel;
    this.lessons = data.lessons;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexChapterModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexChapterModel({
      ...mapNodeData(data),
      number: String(data.number ?? ''),
      lessons: (Array.isArray(data.lessons) ? data.lessons : []).map(
        DocumentIndexLessonModel.fromJson,
      ),
    });
  }

  toEditableItems(): EditableDocumentIndexItem[] {
    return [
      toEditableItem(this, 'chapter'),
      ...this.lessons.flatMap((lesson) => lesson.toEditableItems()),
    ];
  }
}

export default class GeneratedDocumentIndexModel {
  public readonly bookId: number;
  public readonly bookStatus: string;
  public readonly chapters: DocumentIndexChapterModel[];

  constructor(data: { bookId: number; bookStatus: string; chapters: DocumentIndexChapterModel[] }) {
    this.bookId = data.bookId;
    this.bookStatus = data.bookStatus;
    this.chapters = data.chapters;
    Object.freeze(this);
  }

  get editableItems(): EditableDocumentIndexItem[] {
    return this.chapters.flatMap((chapter) => chapter.toEditableItems());
  }

  static fromJson(json: unknown): GeneratedDocumentIndexModel {
    const data = SaftyConditions.objectValue(json);
    return new GeneratedDocumentIndexModel({
      bookId: SaftyConditions.numberValue(data.book_id ?? data.bookId),
      bookStatus: String(data.book_status ?? data.bookStatus ?? ''),
      chapters: (Array.isArray(data.chapters) ? data.chapters : []).map(
        DocumentIndexChapterModel.fromJson,
      ),
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
