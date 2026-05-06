import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminController from '../admin.controller';
import AdminModel from '../../../core/models/admin.model';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import AddAdminParams from '../../../core/params/add.admin.params';
import EditAdminParams from '../../../core/params/edit.admin.params';
import router from '@/router';

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: () => ({
    clearFormData: vi.fn(),
  }),
}));

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}));

describe('AdminController', () => {
  let controller: AdminController;
  let mockRepository: any;

  beforeEach(() => {
    controller = AdminController.getInstance();

    mockRepository = {
      index: vi.fn(),
      show: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    vi.spyOn(controller as any, 'repository', 'get').mockReturnValue(mockRepository);
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AdminController.getInstance();
      const instance2 = AdminController.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('create', () => {
    it('should call repository.create and redirect to /admin on success', async () => {
      const mockAdmin = new AdminModel({
        id: 1,
        name: 'Test Admin',
        email: 'test@example.com',
        phone: '01012345678',
      });
      const successState = new DataSuccess(mockAdmin);
      const params = new AddAdminParams({
        name: 'Test Admin',
        email: 'test@example.com',
        phone: '01012345678',
        password: 'password123',
      });
      mockRepository.create.mockResolvedValue(successState);

      const result = await controller.create(params);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith({ path: '/admin' });
      expect(result).toBe(successState);
    });
  });

  describe('update', () => {
    it('should call repository.update and redirect to /admin on success', async () => {
      const mockAdmin = new AdminModel({
        id: 1,
        name: 'Updated Admin',
        email: 'updated@example.com',
        phone: '01012345678',
      });
      const successState = new DataSuccess(mockAdmin);
      const params = new EditAdminParams({
        id: 1,
        name: 'Updated Admin',
        email: 'updated@example.com',
        phone: '01012345678',
      });
      mockRepository.update.mockResolvedValue(successState);

      const result = await controller.update(params);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith({ path: '/admin' });
      expect(result).toBe(successState);
    });
  });
});
