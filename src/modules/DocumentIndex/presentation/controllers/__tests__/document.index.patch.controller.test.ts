import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import RefreshDocumentIndexStatusParams from '../../../core/params/refresh.document.index.status.params';
import DocumentIndexStatusModel from '../../../core/models/document.index.status.model';

const startIndex = vi.fn();
const refreshStatus = vi.fn();

vi.mock('../../../data/repositories/document.index.patch.repository', () => ({
  default: {
    getInstance: () => ({ startIndex, refreshStatus }),
  },
}));

import DocumentIndexPatchController from '../document.index.patch.controller';

describe('DocumentIndexPatchController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('delegates start and status refresh with controller options', async () => {
    startIndex.mockResolvedValue(new DataSuccess({ data: 12 }));
    refreshStatus.mockResolvedValue(
      new DataSuccess({
        data: DocumentIndexStatusModel.fromJson({ status: 2, is_apply: true }),
      }),
    );
    const startParams = new GenerateDocumentIndexParams(17);
    const refreshParams = new RefreshDocumentIndexStatusParams(12);

    await DocumentIndexPatchController.getInstance().startIndex(startParams);
    await DocumentIndexPatchController.getInstance().refreshStatus(refreshParams);

    const options = expect.objectContaining({
      enableRetry: false,
      retryOptions: { maxAttempts: 2 },
    });
    expect(startIndex).toHaveBeenCalledWith(startParams, options);
    expect(refreshStatus).toHaveBeenCalledWith(refreshParams, options);
  });
});
