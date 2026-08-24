import { describe, expect, it } from 'vitest';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';
import DocumentIndexChapterModel from '../document.index.chapter.model';

describe('DocumentIndexChapterModel', () => {
  it('maps lessons and flattens the complete hierarchy', () => {
    const chapter = DocumentIndexChapterModel.fromJson({
      id: 22,
      number: '1',
      title: 'Chapter 1',
      source_pages: { start: 7, end: 31 },
      lessons: [
        {
          id: 84,
          title: 'Lesson 1',
          source_pages: { start: 9, end: 14 },
          topics: [{ id: 221, title: 'Topic 1', source_pages: { start: 10, end: 10 } }],
        },
      ],
    });

    expect(chapter.lessons).toHaveLength(1);
    expect(chapter.toEditableItems().map((item) => item.level)).toEqual([
      DocumentIndexLevelTypeEnum.CHAPTER,
      DocumentIndexLevelTypeEnum.LESSON,
      DocumentIndexLevelTypeEnum.TOPIC,
    ]);
  });
});
