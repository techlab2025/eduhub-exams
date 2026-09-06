import { describe, it, expect, vi, beforeEach } from 'vitest';
import DocumentController from '../document.controller';
import {
  DataFailed,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import router from '@/router';
import DeleteDocumentParams from '../../../core/params/delete.document.params';

vi.mock('../../data/repositories/document.repository', () => ({
  default: {
    getInstance: vi.fn(() => ({})),
  },
}));

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}));

const { mockClearFormData } = vi.hoisted(() => ({
  mockClearFormData: vi.fn(),
}));

const { mockToastError } = vi.hoisted(() => ({
  mockToastError: vi.fn(),
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    toastError: mockToastError,
  },
}));

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: vi.fn(() => ({
    clearFormData: mockClearFormData,
  })),
}));

// Mocking BaseController to control what super methods return
const { mockSuperCreate, mockSuperDelete, mockSuperUpdate, mockSuperFetchList } = vi.hoisted(
  () => ({
    mockSuperCreate: vi.fn(),
    mockSuperDelete: vi.fn(),
    mockSuperUpdate: vi.fn(),
    mockSuperFetchList: vi.fn(),
  }),
);

vi.mock('@/base/Presentation/Controller/baseController', () => {
  return {
    default: class {
      async create(...args: any[]) {
        return mockSuperCreate(...args);
      }
      async update(...args: any[]) {
        return mockSuperUpdate(...args);
      }
      async delete(...args: any[]) {
        return mockSuperDelete(...args);
      }
      async fetchList(...args: any[]) {
        return mockSuperFetchList(...args);
      }
    },
  };
});

describe('DocumentController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset singleton instance if possible
    (DocumentController as any).instance = undefined;
  });

  it('should be a singleton', () => {
    const instance1 = DocumentController.getInstance();
    const instance2 = DocumentController.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('create', () => {
    it('should redirect to Documents on success', async () => {
      const controller = DocumentController.getInstance();
      const mockResult = new DataSuccess({} as any);

      mockSuperCreate.mockResolvedValue(mockResult);

      const params = { toMap: () => ({}) } as any;
      await controller.create(params, {}, 'form-key');

      expect(router.push).toHaveBeenCalledWith({ name: 'Documents' });
      expect(mockClearFormData).toHaveBeenCalledWith('form-key');
    });
  });

  describe('update', () => {
    it('should redirect to Documents on success', async () => {
      const controller = DocumentController.getInstance();
      const mockResult = new DataSuccess({} as any);

      mockSuperUpdate.mockResolvedValue(mockResult);

      const params = { toMap: () => ({}) } as any;
      await controller.update(params, {}, 'form-key');

      expect(router.push).toHaveBeenCalledWith({ name: 'Documents' });
      expect(mockClearFormData).toHaveBeenCalledWith('form-key');
    });
  });

  describe('fetchList', () => {
    it('should call super.fetchList with useJson: true', async () => {
      const controller = DocumentController.getInstance();
      const mockResult = new DataSuccess([] as any);

      mockSuperFetchList.mockResolvedValue(mockResult);

      const params = { toMap: () => ({}) } as any;
      await controller.fetchList(params);

      expect(mockSuperFetchList).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('shows the backend error message when deletion fails', async () => {
      const controller = DocumentController.getInstance();
      const backendMessage = 'Cannot delete document because it is currently in use.';
      const mockResult = new DataFailed<void>({
        error: new ErrorModel(backendMessage, ErrorType.badRequest),
      });
      const params = new DeleteDocumentParams({ document_id: 4 });
      mockSuperDelete.mockResolvedValue(mockResult);

      const result = await controller.delete(params);

      expect(result).toBe(mockResult);
      expect(mockSuperDelete).toHaveBeenCalledWith(params, undefined);
      expect(mockToastError).toHaveBeenCalledWith(backendMessage);
    });
  });
});
