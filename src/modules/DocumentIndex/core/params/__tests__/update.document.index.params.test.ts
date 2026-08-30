import { describe, expect, it } from 'vitest';
import UpdateDocumentIndexParams from '../update.document.index.params';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';

describe('UpdateDocumentIndexParams', () => {
  it('maps each hierarchy level to the documented update keys', () => {
    const params = new UpdateDocumentIndexParams(17, [
      {
        id: 22,
        level: DocumentIndexLevelTypeEnum.CHAPTER,
        title: 'Chapter 1',
        fromPdf: 7,
        toPdf: 31,
        printedPageLabel: '1-24',
        needsAdminReview: false,
      },
      {
        id: 84,
        level: DocumentIndexLevelTypeEnum.LESSON,
        title: 'Lesson 1',
        fromPdf: 9,
        toPdf: 14,
        printedPageLabel: '3-8',
        needsAdminReview: false,
      },
      {
        id: 221,
        level: DocumentIndexLevelTypeEnum.TOPIC,
        title: 'Topic 1',
        fromPdf: 10,
        toPdf: 10,
        printedPageLabel: '4',
        needsAdminReview: false,
      },
    ]);

    expect(params.toMap()).toEqual({
      document_id: 17,
      data: [
        {
          chapter_id: 22,
          chapter_title: 'Chapter 1',
          chapter_from_pdf: 7,
          chapter_to_pdf: 31,
          chapter_printed_page: '1-24',
        },
        {
          lesson_id: 84,
          lesson_title: 'Lesson 1',
          lesson_from_pdf: 9,
          lesson_to_pdf: 14,
          lesson_printed_page: '3-8',
        },
        {
          topic_id: 221,
          topic_title: 'Topic 1',
          topic_from_pdf: 10,
          topic_to_pdf: 10,
          topic_printed_page: '4',
        },
      ],
    });
  });
});
