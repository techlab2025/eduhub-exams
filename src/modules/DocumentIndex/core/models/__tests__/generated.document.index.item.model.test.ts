import { describe, expect, it } from 'vitest';
import GeneratedDocumentIndexItemModel from '../generated.document.index.item.model';

describe('GeneratedDocumentIndexItemModel', () => {
  it('maps backend fields using the shared safety helpers', () => {
    const item = GeneratedDocumentIndexItemModel.fromJson(
      {
        level: 'Lesson',
        name: 'Reading Practice',
        from_pdf: '4',
        to_pdf: 7,
        page_label: '4-7',
        admin_review: 'needs_review',
      },
      9,
    );

    expect(item).toMatchObject({
      id: 9,
      level: 'Lesson',
      title: 'Reading Practice',
      fromPdf: 4,
      toPdf: 7,
      printedPageLabel: '4-7',
      needsAdminReview: true,
    });
  });
});
