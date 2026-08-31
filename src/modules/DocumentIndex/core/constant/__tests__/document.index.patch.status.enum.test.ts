import { describe, expect, it } from 'vitest';
import {
  DocumentIndexPatchStatusEnum,
  toDocumentIndexPatchStatus,
} from '../document.index.patch.status.enum';

describe('DocumentIndexPatchStatusEnum', () => {
  it('maps backend status values and defaults unknown values to in progress', () => {
    expect(toDocumentIndexPatchStatus('1')).toBe(DocumentIndexPatchStatusEnum.IN_PROGRESS);
    expect(toDocumentIndexPatchStatus(2)).toBe(DocumentIndexPatchStatusEnum.COMPLETE);
    expect(toDocumentIndexPatchStatus('completed')).toBe(DocumentIndexPatchStatusEnum.COMPLETE);
    expect(toDocumentIndexPatchStatus('3')).toBe(DocumentIndexPatchStatusEnum.FAILED);
    expect(toDocumentIndexPatchStatus('FAILED')).toBe(DocumentIndexPatchStatusEnum.FAILED);
    expect(toDocumentIndexPatchStatus('unknown')).toBe(DocumentIndexPatchStatusEnum.IN_PROGRESS);
  });
});
