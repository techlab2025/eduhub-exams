import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { DocumentIndexPatchStatusEnum } from '../../../core/constant/document.index.patch.status.enum';
import DocumentIndexStatusModel from '../../../core/models/document.index.status.model';

const startIndex = vi.fn();
const checkStatus = vi.fn();

vi.mock('../document.index.patch.controller', () => ({
  default: {
    getInstance: () => ({ startIndex, checkStatus }),
  },
}));

import DocumentIndexProgressController from '../document.index.progress.controller';

describe('DocumentIndexProgressController', () => {
  const controller = DocumentIndexProgressController.getInstance();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    controller.reset();
    startIndex.mockResolvedValue(new DataSuccess({ data: 12 }));
    checkStatus.mockResolvedValue(
      new DataSuccess({
        data: DocumentIndexStatusModel.fromJson({
          status: DocumentIndexPatchStatusEnum.IN_PROGRESS,
          is_apply: false,
          document_id: 17,
        }),
      }),
    );
  });

  afterEach(() => {
    controller.reset();
    vi.useRealTimers();
  });

  it('keeps an active indexing job available after the dialog is minimized', async () => {
    await controller.startIndex(17);

    expect(startIndex.mock.calls[0]?.[0].toMap()).toEqual({
      document_id: 17,
      auto_generate: false,
    });
    expect(controller.generationDialogVisible.value).toBe(true);
    expect(controller.hasActiveIndexing.value).toBe(true);

    controller.minimize();

    expect(controller.generationDialogVisible.value).toBe(false);
    expect(DocumentIndexProgressController.getInstance().hasActiveIndexing.value).toBe(true);
  });

  it('continues polling while the document page is not mounted', async () => {
    await controller.startIndex(17);

    await vi.advanceTimersByTimeAsync(5000);

    expect(checkStatus.mock.calls[0]?.[0].toMap()).toEqual({ id: 12 });
    expect(controller.job(17)?.status).toBe(DocumentIndexPatchStatusEnum.IN_PROGRESS);
  });

  it('opens the generated index when the background job completes', async () => {
    await controller.startIndex(17);
    checkStatus.mockResolvedValueOnce(
      new DataSuccess({
        data: DocumentIndexStatusModel.fromJson({
          status: DocumentIndexPatchStatusEnum.COMPLETE,
          is_apply: true,
          document_id: 17,
          generated_index: {
            book_id: 17,
            book_status: 'completed',
            chapters: [],
          },
        }),
      }),
    );

    await controller.checkStatus(17, 12, { openWhenComplete: true, reschedule: false });

    expect(controller.generationDialogVisible.value).toBe(false);
    expect(controller.generatedDialogVisible.value).toBe(true);
    expect(controller.generatedIndex.value?.bookId).toBe(17);
  });
});
