export const DocumentIndexPatchStatusEnum = {
  IN_PROGRESS: 1,
  COMPLETE: 2,
  FAILED: 3,
} as const;

export type DocumentIndexPatchStatusEnum =
  (typeof DocumentIndexPatchStatusEnum)[keyof typeof DocumentIndexPatchStatusEnum];

export const toDocumentIndexPatchStatus = (value: unknown): DocumentIndexPatchStatusEnum => {
  const status = Number(value);
  if (status === DocumentIndexPatchStatusEnum.COMPLETE) {
    return DocumentIndexPatchStatusEnum.COMPLETE;
  }
  if (status === DocumentIndexPatchStatusEnum.FAILED) {
    return DocumentIndexPatchStatusEnum.FAILED;
  }
  return DocumentIndexPatchStatusEnum.IN_PROGRESS;
};
