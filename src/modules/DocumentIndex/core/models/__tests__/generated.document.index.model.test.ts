import { describe, expect, it } from 'vitest';
import GeneratedDocumentIndexModel from '../generated.document.index.model';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';

describe('GeneratedDocumentIndexModel', () => {
  it('maps the documented book hierarchy and source metadata', () => {
    const model = GeneratedDocumentIndexModel.fromJson({
      book_id: 10,
      book_status: 'completed',
      chapters: [
        {
          id: 22,
          position: 0,
          number: '1',
          title: 'Chapter 1',
          description: null,
          source_pages: { start: 7, end: 31 },
          source_hash: 'chapter-hash',
          source_url_json: '/chapter/22',
          confidence: 0.99,
          is_inferred: false,
          inference_level: 'explicit',
          lessons: [
            {
              id: 84,
              position: 0,
              number: '1',
              title: 'Lesson 1',
              source_pages: { start: 9, end: 14 },
              topics: [
                {
                  id: 221,
                  position: 0,
                  title: 'Topic 1',
                  source_pages: { start: 10, end: 10 },
                  important_concepts: ['concept'],
                  subtopics: [],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(model).toMatchObject({ bookId: 10, bookStatus: 'completed' });
    expect(model.chapters[0]).toMatchObject({
      id: 22,
      sourcePages: { start: 7, end: 31 },
      sourceHash: 'chapter-hash',
    });
    expect(model.chapters[0]?.lessons[0]?.topics[0]?.importantConcepts).toEqual(['concept']);
  });

  it('flattens chapter, lesson and topic nodes for the update dialog', () => {
    expect(GeneratedDocumentIndexModel.example.editableItems).toEqual([
      expect.objectContaining({
        id: 22,
        level: DocumentIndexLevelTypeEnum.CHAPTER,
        fromPdf: 7,
        toPdf: 31,
      }),
      expect.objectContaining({
        id: 84,
        level: DocumentIndexLevelTypeEnum.LESSON,
        fromPdf: 9,
        toPdf: 14,
      }),
      expect.objectContaining({
        id: 221,
        level: DocumentIndexLevelTypeEnum.TOPIC,
        fromPdf: 10,
        toPdf: 10,
      }),
    ]);
  });

  it('flattens the fetched subject and every nested child into dialog rows', () => {
    const model = GeneratedDocumentIndexModel.fromJson({
      book_id: 61,
      book_status: 'completed',
      subject: {
        id: 380,
        title: 'علوم',
        inference_level: 'explicit',
        source_pages: { start: 56, end: 68 },
        Printed_Page_Label: '56-68',
        Needs_Admn_Review: false,
        children: [
          {
            id: 381,
            title: 'التفاعلات الكيميائية وآثارها البيئية',
            inference_level: 'explicit',
            source_pages: { start: 62, end: 108 },
            Printed_Page_Label: '62-108',
            Needs_Admn_Review: true,
            children: [
              {
                id: 385,
                title: 'أنواع التفاعلات الكيميائية',
                inference_level: 'inferred',
                source_pages: { start: 64, end: 72 },
                children: [
                  {
                    id: 386,
                    title: 'تفاعل الاتحاد',
                    inference_level: 'explicit',
                    source_pages: { start: 65, end: 66 },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    expect(model.editableItems).toEqual([
      expect.objectContaining({
        id: 380,
        type: 'subject',
        levelLabel: 'explicit',
        title: 'علوم',
        fromPdf: 56,
        toPdf: 68,
        printedPageLabel: '56-68',
        needsAdminReview: false,
        depth: 0,
      }),
      expect.objectContaining({
        id: 381,
        type: 'subject',
        levelLabel: 'explicit',
        title: 'التفاعلات الكيميائية وآثارها البيئية',
        fromPdf: 62,
        toPdf: 108,
        printedPageLabel: '62-108',
        needsAdminReview: true,
        depth: 1,
      }),
      expect.objectContaining({ id: 385, type: 'topic', levelLabel: 'inferred', depth: 2 }),
      expect.objectContaining({ id: 386, type: 'topic', levelLabel: 'explicit', depth: 3 }),
    ]);
  });

  it('maps the level and page range from fetched flat rows', () => {
    const model = GeneratedDocumentIndexModel.fromJson({
      book_id: 77,
      book_status: 'completed',
      subject: {
        id: 380,
        title: 'علوم',
        inference_level: 'explicit',
        source_pages: { start: 7, end: 109 },
      },
      rows: [
        {
          id: 11,
          type: 'subject',
          level: 'Subject',
          title: 'علوم',
          from_pdf: 7,
          to_pdf: 109,
          printed_page_label: null,
          needs_admin_review: false,
        },
      ],
    });

    expect(model.editableItems).toEqual([
      expect.objectContaining({
        id: 11,
        type: 'subject',
        levelLabel: 'Subject',
        title: 'علوم',
        fromPdf: 7,
        toPdf: 109,
        printedPageLabel: '7-109',
        needsAdminReview: false,
      }),
    ]);
  });
});
