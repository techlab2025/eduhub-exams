import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataFailed } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import DeleteAdviceCategoryParams from '../../../core/params/delete.advice.category.params';
import AdviceCategoryController from '../advice.category.controller';

const { repositoryDeleteMock, toastErrorMock } = vi.hoisted(() => ({
  repositoryDeleteMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('../../../data/repositories/advice.category.repository', () => ({
  default: {
    getInstance: () => ({ delete: repositoryDeleteMock }),
  },
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    hideLoading: vi.fn(),
    toastError: toastErrorMock,
  },
}));

describe('AdviceCategoryController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses a singleton category controller', () => {
    expect(AdviceCategoryController.getInstance()).toBe(AdviceCategoryController.getInstance());
  });

  it('shows the backend delete error by default', async () => {
    const backendMessage = 'This category contains advice.';
    repositoryDeleteMock.mockResolvedValueOnce(
      new DataFailed({ error: new ErrorModel(backendMessage, ErrorType.serviceSide) }),
    );

    await AdviceCategoryController.getInstance().delete(
      new DeleteAdviceCategoryParams({ adviceCategoryId: 7 }),
    );

    expect(toastErrorMock).toHaveBeenCalledWith(backendMessage);
  });

  it('lets a custom dialog handle the backend delete error without a duplicate toast', async () => {
    repositoryDeleteMock.mockResolvedValueOnce(
      new DataFailed({ error: new ErrorModel('Blocked', ErrorType.serviceSide) }),
    );

    await AdviceCategoryController.getInstance().delete(
      new DeleteAdviceCategoryParams({ adviceCategoryId: 7 }),
      undefined,
      false,
    );

    expect(toastErrorMock).not.toHaveBeenCalled();
  });
});
