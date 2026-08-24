import { describe, expect, it } from 'vitest';
import { DocumentIndexLevelTypeEnum, getDocumentIndexLevelKey } from '../DocumentIndexLevel.enum';

describe('DocumentIndexLevelTypeEnum', () => {
  it('maps numeric levels to backend update prefixes', () => {
    expect(getDocumentIndexLevelKey(DocumentIndexLevelTypeEnum.CHAPTER)).toBe('chapter');
    expect(getDocumentIndexLevelKey(DocumentIndexLevelTypeEnum.LESSON)).toBe('lesson');
    expect(getDocumentIndexLevelKey(DocumentIndexLevelTypeEnum.TOPIC)).toBe('topic');
  });
});
