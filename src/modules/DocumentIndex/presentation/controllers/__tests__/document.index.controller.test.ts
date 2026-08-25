import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DataCancelled,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import GeneratedDocumentIndexModel from '../../../core/models/generated.document.index.model';

const generateIndex = vi.fn();
const updateIndex = vi.fn();
const saveIndex = vi.fn();

vi.mock('../../../data/repositories/document.index.repository', () => ({
  default: {
    getInstance: () => ({ generateIndex, updateIndex, saveIndex }),
  },
}));

import DocumentIndexController from '../document.index.controller';

describe('DocumentIndexController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('applies controller retry configuration to a long generation request', async () => {
    generateIndex.mockResolvedValue(new DataSuccess({ data: GeneratedDocumentIndexModel.example }));
    const signal = new AbortController().signal;

    await DocumentIndexController.getInstance().generateIndex(new GenerateDocumentIndexParams(17), {
      signal,
    });

    expect(generateIndex).toHaveBeenCalledWith(
      expect.any(GenerateDocumentIndexParams),
      expect.objectContaining({
        signal,
        timeout: 0,
        enableRetry: false,
        retryOptions: { maxAttempts: 2 },
      }),
    );
  });

  it('keeps cancellation as a cancelled state', async () => {
    generateIndex.mockResolvedValue(new DataCancelled());

    const result = await DocumentIndexController.getInstance().generateIndex(
      new GenerateDocumentIndexParams(17),
    );

    expect(result).toBeInstanceOf(DataCancelled);
  });

  it('delegates update and save operations to the repository', async () => {
    const params = new GenerateDocumentIndexParams(17);
    updateIndex.mockResolvedValue(new DataSuccess({ data: GeneratedDocumentIndexModel.example }));
    saveIndex.mockResolvedValue(new DataSuccess({}));

    await DocumentIndexController.getInstance().updateIndex(params);
    await DocumentIndexController.getInstance().saveIndex(params);

    const controllerOptions = expect.objectContaining({
      enableRetry: false,
      retryOptions: { maxAttempts: 2 },
    });

    expect(updateIndex).toHaveBeenCalledWith(params, controllerOptions);
    expect(saveIndex).toHaveBeenCalledWith(params, controllerOptions);
  });

  it('allows custom calls to override the controller retry configuration', async () => {
    const params = new GenerateDocumentIndexParams(17);
    updateIndex.mockResolvedValue(new DataSuccess({ data: GeneratedDocumentIndexModel.example }));

    await DocumentIndexController.getInstance().updateIndex(params, {
      enableRetry: true,
      retryOptions: { maxAttempts: 5 },
    });

    expect(updateIndex).toHaveBeenCalledWith(
      params,
      expect.objectContaining({
        enableRetry: true,
        retryOptions: { maxAttempts: 5 },
      }),
    );
  });
});
