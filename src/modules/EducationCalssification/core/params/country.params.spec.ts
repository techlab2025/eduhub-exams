import { describe, it, expect } from 'vitest';
import AddEducationClassificationParams from './add.educationClassification.params';
import EditCountryParams from './edit.country.params';
import ShowEducationClassificationParams from './show.educationClassification.params';

describe('EducationClassification Params', () => {
  describe('AddEducationClassificationParams', () => {
    it('should create valid params', () => {
      const params = new AddEducationClassificationParams({ title: 'Basic Education' });
      expect(params.title).toBe('Basic Education');
    });

    it('should convert to map correctly', () => {
      const params = new AddEducationClassificationParams({ title: 'Basic Education' });
      const map = params.toMap();
      expect(map).toEqual({ title: 'Basic Education' });
    });

    it('should pass validation for valid params', () => {
      const params = new AddEducationClassificationParams({ title: 'Basic Education' });
      expect(params.validate().isValid).toBe(true);
    });

    it('should fail validation for empty title', () => {
      const params = new AddEducationClassificationParams({ title: '' });
      expect(params.validate().isValid).toBe(false);
    });
  });

  describe('EditCountryParams', () => {
    it('should create valid params', () => {
      const params = new EditCountryParams(1, 'Egypt', 'EG', '🇪🇬');
      expect(params.id).toBe(1);
      expect(params.title).toBe('Egypt');
    });

    it('should convert to map correctly', () => {
      const params = new EditCountryParams(1, 'Egypt', 'EG', '🇪🇬');
      const map = params.toMap();
      expect(map).toEqual({ id: 1, title: 'Egypt', code: 'EG', flag: '🇪🇬' });
    });

    it('should pass validation for valid params', () => {
      const params = new EditCountryParams(1, 'Egypt', 'EG', '🇪🇬');
      expect(params.validate().isValid).toBe(true);
    });
  });

  describe('ShowEducationClassificationParams', () => {
    it('should create valid params', () => {
      const params = new ShowEducationClassificationParams({ id: 5 });
      expect(params.id).toBe(5);
    });

    it('should convert to map correctly', () => {
      const params = new ShowEducationClassificationParams({ id: 5 });
      const map = params.toMap();
      expect(map).toEqual({ id: 5 });
    });

    it('should pass validation for valid params', () => {
      const params = new ShowEducationClassificationParams({ id: 5 });
      expect(params.validate().isValid).toBe(true);
    });
  });
});
