import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import type { EditableDocumentIndexItem } from './editable.document.index.item.model';
import DocumentIndexChapterModel from './document.index.chapter.model';

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
