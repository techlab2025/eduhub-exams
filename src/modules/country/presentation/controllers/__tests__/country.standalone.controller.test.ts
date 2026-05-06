import { describe, it, expect, vi, beforeEach } from 'vitest';
import CountryStandaloneController from '../country.standalone.controller';
import CountryModel from '../../../core/models/country.model';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import AddCountryParams from '../../../core/params/add.country.params';
import EditCountryParams from '../../../core/params/edit.country.params';
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

describe('CountryStandaloneController', () => {
  let controller: CountryStandaloneController;
  let mockRepository: any;

  beforeEach(() => {
    controller = CountryStandaloneController.getInstance();

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
      const instance1 = CountryStandaloneController.getInstance();
      const instance2 = CountryStandaloneController.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('create', () => {
    it('should call repository.create and redirect to /admin/country on success', async () => {
      const mockCountry = new CountryModel({
        id: 1,
        title: 'Egypt',
        code: 'EG',
        flag: '🇪🇬',
      });
      const successState = new DataSuccess(mockCountry);
      const params = new AddCountryParams({ title: 'Egypt', code: 'EG', flag: '🇪🇬' });
      mockRepository.create.mockResolvedValue(successState);

      const result = await controller.create(params);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith({ path: '/admin/country' });
      expect(result).toBe(successState);
    });
  });

  describe('update', () => {
    it('should call repository.update and redirect to /admin/country on success', async () => {
      const mockCountry = new CountryModel({
        id: 1,
        title: 'Egypt',
        code: 'EG',
        flag: '🇪🇬',
      });
      const successState = new DataSuccess(mockCountry);
      const params = new EditCountryParams(1, 'Egypt', 'EG', '🇪🇬');
      mockRepository.update.mockResolvedValue(successState);

      const result = await controller.update(params);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith({ path: '/admin/country' });
      expect(result).toBe(successState);
    });
  });
});
