export const DocumentIndexLevelTypeEnum = {
  CHAPTER: 1,
  LESSON: 2,
  TOPIC: 3,
} as const;
export type DocumentIndexLevelTypeEnum =
  (typeof DocumentIndexLevelTypeEnum)[keyof typeof DocumentIndexLevelTypeEnum];

export type DocumentIndexLevelKey = 'chapter' | 'lesson' | 'topic';

export const getDocumentIndexLevelKey = (
  level: DocumentIndexLevelTypeEnum,
): DocumentIndexLevelKey => {
  if (level === DocumentIndexLevelTypeEnum.CHAPTER) return 'chapter';
  if (level === DocumentIndexLevelTypeEnum.LESSON) return 'lesson';
  return 'topic';
};
