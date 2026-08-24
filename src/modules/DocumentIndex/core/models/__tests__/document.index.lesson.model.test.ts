import { describe, expect, it } from 'vitest';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';
import DocumentIndexLessonModel from '../document.index.lesson.model';

describe('DocumentIndexLessonModel', () => {
  it('maps its topics and flattens editable rows', () => {
    const lesson = DocumentIndexLessonModel.fromJson({
      id: 84,
      number: '1',
      title: 'Lesson 1',
      source_pages: { start: 9, end: 14 },
      topics: [{ id: 221, title: 'Topic 1', source_pages: { start: 10, end: 10 } }],
    });

    expect(lesson.topics).toHaveLength(1);
    expect(lesson.toEditableItems().map((item) => item.level)).toEqual([
      DocumentIndexLevelTypeEnum.LESSON,
      DocumentIndexLevelTypeEnum.TOPIC,
    ]);
  });
});
