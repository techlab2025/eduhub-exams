export const DocumentIndexPatchStatusEnum = {
  IN_PROGRESS: 1,
  COMPLETE: 2,
  FAILED: 3,
} as const;

export type DocumentIndexPatchStatusEnum =
  (typeof DocumentIndexPatchStatusEnum)[keyof typeof DocumentIndexPatchStatusEnum];

export const toDocumentIndexPatchStatus = (value: unknown): DocumentIndexPatchStatusEnum => {
  const status = Number(value);
  const normalizedStatus = typeof value === 'string' ? value.trim().toLowerCase() : '';

  if (
    status === DocumentIndexPatchStatusEnum.COMPLETE ||
    ['complete', 'completed', 'success', 'succeeded'].includes(normalizedStatus)
  ) {
    return DocumentIndexPatchStatusEnum.COMPLETE;
  }
  if (
    status === DocumentIndexPatchStatusEnum.FAILED ||
    ['failed', 'failure', 'error'].includes(normalizedStatus)
  ) {
    return DocumentIndexPatchStatusEnum.FAILED;
  }
  return DocumentIndexPatchStatusEnum.IN_PROGRESS;
};
