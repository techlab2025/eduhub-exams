import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import GeneratedDocumentIndexItemModel from './generated.document.index.item.model';

export default class GeneratedDocumentIndexModel {
  public readonly documentId?: number;
  public readonly items: GeneratedDocumentIndexItemModel[];

  constructor(data: { documentId?: number; items: GeneratedDocumentIndexItemModel[] }) {
    this.documentId = data.documentId;
    this.items = data.items;

    Object.freeze(this);
  }

  static fromJson(json: unknown): GeneratedDocumentIndexModel {
    const data = SaftyConditions.objectValue(json);
    const nestedIndex = SaftyConditions.objectValue(data.document_index ?? data.documentIndex);
    const candidates: unknown[] = [
      json,
      data.items,
      data.index,
      data.indexes,
      data.rows,
      data.document_index,
      data.documentIndex,
      nestedIndex.items,
      nestedIndex.index,
    ];
    const rawItems = candidates.find(Array.isArray) as unknown[] | undefined;

    return new GeneratedDocumentIndexModel({
      documentId: SaftyConditions.numberValue(data.document_id ?? data.documentId) || undefined,
      items: (rawItems ?? []).map((item, index) =>
        GeneratedDocumentIndexItemModel.fromJson(item, index + 1),
      ),
    });
  }

  static readonly example = new GeneratedDocumentIndexModel({
    documentId: 1,
    items: [
      new GeneratedDocumentIndexItemModel({
        id: 1,
        level: 'Unit',
        title: 'Unit 1 — Reading & Comprehension',
        fromPdf: 1,
        toPdf: 64,
        printedPageLabel: '1-64',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 2,
        level: 'Chapter',
        title: 'Chapter 1 — Language Skills',
        fromPdf: 3,
        toPdf: 34,
        printedPageLabel: '3-30',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 3,
        level: 'Lesson',
        title: 'Lesson 1 — Reading Practice',
        fromPdf: 4,
        toPdf: 7,
        printedPageLabel: '4-13',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 4,
        level: 'Lesson',
        title: 'Lesson 2 — Reading Practice',
        fromPdf: 4,
        toPdf: 7,
        printedPageLabel: '14-30',
        needsAdminReview: true,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 5,
        level: 'Unit',
        title: 'Unit 2 — Reading & Comprehension',
        fromPdf: 1,
        toPdf: 64,
        printedPageLabel: '1-64',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 6,
        level: 'Chapter',
        title: 'Chapter 1 — Language Skills',
        fromPdf: 3,
        toPdf: 34,
        printedPageLabel: '3-30',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 7,
        level: 'Lesson',
        title: 'Lesson 1 — Reading Practice',
        fromPdf: 4,
        toPdf: 7,
        printedPageLabel: '4-13',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 8,
        level: 'Chapter',
        title: 'Chapter 2 — Language Skills',
        fromPdf: 3,
        toPdf: 34,
        printedPageLabel: '3-30',
        needsAdminReview: false,
      }),
      new GeneratedDocumentIndexItemModel({
        id: 9,
        level: 'Lesson',
        title: 'Lesson 1 — Reading Practice',
        fromPdf: 4,
        toPdf: 7,
        printedPageLabel: '4-13',
        needsAdminReview: false,
      }),
    ],
  });
}
