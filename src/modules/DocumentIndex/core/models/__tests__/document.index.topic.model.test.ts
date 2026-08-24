import { describe, expect, it } from 'vitest';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';
import DocumentIndexTopicModel from '../document.index.topic.model';

describe('DocumentIndexTopicModel', () => {
  it('maps topic collections and exposes its editable row', () => {
    const topic = DocumentIndexTopicModel.fromJson({
      id: 221,
      title: 'Topic 1',
      source_pages: { start: 10, end: 10 },
      important_concepts: ['concept'],
      subtopics: ['subtopic'],
    });

    expect(topic.importantConcepts).toEqual(['concept']);
    expect(topic.toEditableItem()).toMatchObject({
      id: 221,
      level: DocumentIndexLevelTypeEnum.TOPIC,
    });
  });
});
