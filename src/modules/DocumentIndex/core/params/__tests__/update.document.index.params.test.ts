import { describe, expect, it } from 'vitest';
import UpdateDocumentIndexParams from '../update.document.index.params';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';

describe('UpdateDocumentIndexParams', () => {
  it('maps the editable hierarchy to the backend rows contract', () => {
    const params = new UpdateDocumentIndexParams('TXN-012', [
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
      {
        id: 84,
        level: DocumentIndexLevelTypeEnum.LESSON,
        levelLabel: 'inferred',
        title: 'Lesson 1',
        fromPdf: 9,
        toPdf: 14,
        printedPageLabel: '3-8',
        needsAdminReview: false,
      },
      {
        id: 221,
        level: DocumentIndexLevelTypeEnum.TOPIC,
        levelLabel: 'explicit',
        title: 'Topic 1',
        fromPdf: 10,
        toPdf: 10,
        printedPageLabel: '4',
        needsAdminReview: false,
      },
    ]);

    expect(params.toMap()).toEqual({
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
        {
          id: 84,
          type: 'lesson',
          level: 'inferred',
          title: 'Lesson 1',
          from_pdf: 9,
          to_pdf: 14,
          printed_page_label: '3-8',
        },
        {
          id: 221,
          type: 'topic',
          level: 'explicit',
          title: 'Topic 1',
          from_pdf: 10,
          to_pdf: 10,
          printed_page_label: '4',
        },
      ],
    });
  });

  it('sends nullable page fields when they are not available', () => {
    const params = new UpdateDocumentIndexParams('TXN-013', [
      {
        id: 23,
        level: DocumentIndexLevelTypeEnum.CHAPTER,
        levelLabel: 'explicit',
        title: 'Chapter 2',
        fromPdf: 0,
        toPdf: 0,
        printedPageLabel: '',
        needsAdminReview: false,
      },
    ]);

    expect(params.toMap()).toMatchObject({
      rows: [
        {
          from_pdf: null,
          to_pdf: null,
          printed_page_label: null,
        },
      ],
    });
  });
});
