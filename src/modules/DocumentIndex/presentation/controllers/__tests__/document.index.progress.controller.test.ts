import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

const startIndex = vi.fn();

vi.mock('../document.index.patch.controller', () => ({
  default: {
    getInstance: () => ({ startIndex }),
  },
}));

import DocumentIndexProgressController from '../document.index.progress.controller';

describe('DocumentIndexProgressController', () => {
  const controller = DocumentIndexProgressController.getInstance();

  beforeEach(() => {
    vi.clearAllMocks();
    controller.reset();
  });

  it('keeps progress active only while start_document_index is pending', async () => {
    let resolveStart: ((result: DataSuccess<number>) => void) | undefined;
    startIndex.mockReturnValueOnce(
      new Promise<DataSuccess<number>>((resolve) => {
        resolveStart = resolve;
      }),
    );

    const request = controller.startIndex(17);

    expect(startIndex.mock.calls[0]?.[0].toMap()).toEqual({
      document_id: 17,
      auto_generate: false,
    });
    expect(controller.generationDialogVisible.value).toBe(true);
    expect(controller.hasActiveIndexing.value).toBe(true);

    controller.minimize();
    expect(controller.generationDialogVisible.value).toBe(false);
    expect(controller.hasActiveIndexing.value).toBe(true);

    controller.openActiveProgress();
    expect(controller.generationDialogVisible.value).toBe(true);

    resolveStart?.(new DataSuccess({ data: 12 }));

    await expect(request).resolves.toBe(true);
    expect(controller.generationDialogVisible.value).toBe(false);
    expect(controller.hasActiveIndexing.value).toBe(false);
    expect(controller.startingDocumentId.value).toBeUndefined();
  });

  it('closes local progress and ignores a start response after cancellation', async () => {
    let resolveStart: ((result: DataSuccess<number>) => void) | undefined;
    startIndex.mockReturnValueOnce(
      new Promise<DataSuccess<number>>((resolve) => {
        resolveStart = resolve;
      }),
    );

    const request = controller.startIndex(17);
    controller.requestCancel();
    controller.confirmCancel();

    expect(controller.generationDialogVisible.value).toBe(false);
    expect(controller.cancelConfirmationVisible.value).toBe(false);
    expect(controller.hasActiveIndexing.value).toBe(false);

    resolveStart?.(new DataSuccess({ data: 12 }));
    await expect(request).resolves.toBe(false);
  });

  it('shows progress for a pending transaction without calling a status endpoint', () => {
    controller.openProgress();

    expect(controller.generationDialogVisible.value).toBe(true);
    expect(controller.hasActiveIndexing.value).toBe(true);
    expect(startIndex).not.toHaveBeenCalled();

    controller.minimize();
    expect(controller.generationDialogVisible.value).toBe(false);
    expect(controller.hasActiveIndexing.value).toBe(true);

    controller.openActiveProgress();
    expect(controller.generationDialogVisible.value).toBe(true);

    controller.confirmCancel();
    expect(controller.hasActiveIndexing.value).toBe(false);
  });
});
