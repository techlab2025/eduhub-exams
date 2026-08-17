import { describe, it, expect } from 'vitest';
import ConfigurationBranchesModel from './configuration.branch.model';

describe('ConfigurationBranchesModel', () => {
  describe('fromJson', () => {
    it('should parse simple flat JSON correctly', () => {
      const json = {
        id: 1,
        level_number: 1,
        singular_title: { en: 'Stage', ar: 'مرحلة' },
        plural_title: { en: 'Stages', ar: 'مراحل' },
      };

      const model = ConfigurationBranchesModel.fromJson(json);

      expect(model.id).toBe(1);
      expect(model.levelNumber).toBe(1);
      expect(model.singularTitle).toEqual({ en: 'Stage', ar: 'مرحلة' });
      expect(model.pluralTitle).toEqual({ en: 'Stages', ar: 'مراحل' });
    });

    it('should parse camel-case level numbers with flat translated titles', () => {
      const json = {
        id: 2,
        levelNumber: 2,
        singular_title: { en: 'Year', ar: 'سنة' },
        plural_title: { en: 'Years', ar: 'سنوات' },
      };

      const model = ConfigurationBranchesModel.fromJson(json);

      expect(model.id).toBe(2);
      expect(model.levelNumber).toBe(2);
      expect(model.singularTitle).toEqual({ en: 'Year', ar: 'سنة' });
      expect(model.pluralTitle).toEqual({ en: 'Years', ar: 'سنوات' });
    });

    it('should parse locale arrays used by the API', () => {
      const json = {
        id: 3,
        levelNumber: 3,
        singular_title: [
          { locale: 'en', singular_title: 'Level' },
          { locale: 'ar', singular_title: 'مستوى' },
        ],
        plural_title: [
          { locale: 'en', plural_title: 'Levels' },
          { locale: 'ar', plural_title: 'مستويات' },
        ],
      };

      const model = ConfigurationBranchesModel.fromJson(json);

      expect(model.singularTitle).toEqual({ en: 'Level', ar: 'مستوى' });
      expect(model.pluralTitle).toEqual({ en: 'Levels', ar: 'مستويات' });
    });

    it('should throw on null input', () => {
      expect(() => ConfigurationBranchesModel.fromJson(null as any)).toThrow();
    });
  });

  describe('example', () => {
    it('should provide a valid example instance', () => {
      expect(ConfigurationBranchesModel.example).toBeInstanceOf(ConfigurationBranchesModel);
      expect(ConfigurationBranchesModel.example.id).toBe(1);
    });
  });
});
