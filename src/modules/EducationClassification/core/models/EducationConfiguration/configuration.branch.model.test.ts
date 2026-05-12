import { describe, it, expect } from 'vitest';
import ConfigurationBranchesModel from './configuration.branch.model';

describe('ConfigurationBranchesModel', () => {
  describe('fromJson', () => {
    it('should parse simple flat JSON correctly', () => {
      const json = {
        id: 1,
        level_number: 1,
        singular_title: [{ locale: 'en', singular_title: 'Stage' }],
        plural_title: [{ locale: 'en', plural_title: 'Stages' }],
      };

      const model = ConfigurationBranchesModel.fromJson(json);

      expect(model.id).toBe(1);
      expect(model.levelNumber).toBe(1);
      expect(model.singularTitle).toEqual([{ locale: 'en', singular_title: 'Stage' }]);
      expect(model.pluralTitle).toEqual([{ locale: 'en', plural_title: 'Stages' }]);
    });

    it('should handle missing titles', () => {
      const json = {
        id: 2,
        levelNumber: 2,
      };

      const model = ConfigurationBranchesModel.fromJson(json);

      expect(model.id).toBe(2);
      expect(model.singularTitle).toEqual([]);
      expect(model.pluralTitle).toEqual([]);
    });

    it('should throw on null input', () => {
      expect(() => ConfigurationBranchesModel.fromJson(null as any)).toThrow(
        'Cannot create ConfigurationBranchesModel from null or undefined',
      );
    });
  });

  describe('example', () => {
    it('should provide a valid example instance', () => {
      expect(ConfigurationBranchesModel.example).toBeInstanceOf(ConfigurationBranchesModel);
      expect(ConfigurationBranchesModel.example.id).toBe(1);
      expect(Array.isArray(ConfigurationBranchesModel.example.singularTitle)).toBe(true);
    });
  });
});
