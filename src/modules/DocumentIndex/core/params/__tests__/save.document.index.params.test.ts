import { describe, expect, it } from 'vitest';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';
import SaveDocumentIndexParams from '../save.document.index.params';

describe('SaveDocumentIndexParams', () => {
  it('maps the transaction id and rows', () => {
    expect(
      new SaveDocumentIndexParams('TXN-012', [
        {
          id: 22,
          level: DocumentIndexLevelTypeEnum.CHAPTER,
          type: 'subject',
          levelLabel: 'explicit',
          title: 'Chapter 1',
          fromPdf: 7,
          toPdf: 31,
          printedPageLabel: '1-24',
          needsAdminReview: false,
        },
      ]).toMap(),
    ).toEqual({
      transaction_id: 'TXN-012',
      rows: [
        {
          id: 22,
          type: 'subject',
          level: 'explicit',
          title: 'Chapter 1',
          from_pdf: 7,
          to_pdf: 31,
          printed_page_label: '1-24',
        },
      ],
    });
  });
});
