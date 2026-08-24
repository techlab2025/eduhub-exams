import { describe, expect, it } from 'vitest';
import GeneratedDocumentIndexModel from '../generated.document.index.model';

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
      expect.objectContaining({ id: 22, level: 'chapter', fromPdf: 7, toPdf: 31 }),
      expect.objectContaining({ id: 84, level: 'lesson', fromPdf: 9, toPdf: 14 }),
      expect.objectContaining({ id: 221, level: 'topic', fromPdf: 10, toPdf: 10 }),
    ]);
  });
});
