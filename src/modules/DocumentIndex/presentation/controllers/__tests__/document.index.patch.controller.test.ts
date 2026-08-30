import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import CheckDocumentIndexStatusParams from '../../../core/params/check.document.index.status.params';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import DocumentIndexStatusModel from '../../../core/models/document.index.status.model';

const startIndex = vi.fn();
const checkStatus = vi.fn();

vi.mock('../../../data/repositories/document.index.patch.repository', () => ({
  default: {
    getInstance: () => ({ startIndex, checkStatus }),
  },
}));

import DocumentIndexPatchController from '../document.index.patch.controller';

describe('DocumentIndexPatchController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('delegates start and status checks with controller options', async () => {
    startIndex.mockResolvedValue(new DataSuccess({ data: 12 }));
    checkStatus.mockResolvedValue(
      new DataSuccess({
        data: DocumentIndexStatusModel.fromJson({ status: 1, is_apply: false }),
      }),
    );
    const startParams = new GenerateDocumentIndexParams(17);
    const checkParams = new CheckDocumentIndexStatusParams(12);

    await DocumentIndexPatchController.getInstance().startIndex(startParams);
    await DocumentIndexPatchController.getInstance().checkStatus(checkParams);

    const options = expect.objectContaining({
      enableRetry: false,
      retryOptions: { maxAttempts: 2 },
    });
    expect(startIndex).toHaveBeenCalledWith(startParams, options);
    expect(checkStatus).toHaveBeenCalledWith(checkParams, options);
  });
});
