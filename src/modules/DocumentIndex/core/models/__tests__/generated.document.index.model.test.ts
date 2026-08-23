import { describe, expect, it } from 'vitest';
import GeneratedDocumentIndexModel from '../generated.document.index.model';

describe('GeneratedDocumentIndexModel', () => {
  it('maps snake-case generated rows', () => {
    const model = GeneratedDocumentIndexModel.fromJson({
      document_id: 17,
      items: [
        {
          id: 3,
          level: 'Lesson',
          title: 'Reading Practice',
          from_pdf: 4,
          to_pdf: 7,
          printed_page_label: '14-30',
          needs_admin_review: true,
        },
      ],
    });

    expect(model.documentId).toBe(17);
    expect(model.items[0]).toMatchObject({
      id: 3,
      level: 'Lesson',
      title: 'Reading Practice',
      fromPdf: 4,
      toPdf: 7,
      printedPageLabel: '14-30',
      needsAdminReview: true,
    });
  });

  it('accepts a response containing the rows directly', () => {
    const model = GeneratedDocumentIndexModel.fromJson([
      { level: 'Unit', title: 'Unit 1', fromPdf: 1, toPdf: 10 },
    ]);

    expect(model.items).toHaveLength(1);
  });

  it('provides a complete dialog example including a review row', () => {
    expect(GeneratedDocumentIndexModel.example.items).toHaveLength(9);
    expect(GeneratedDocumentIndexModel.example.items.some((item) => item.needsAdminReview)).toBe(
      true,
    );
  });
});
