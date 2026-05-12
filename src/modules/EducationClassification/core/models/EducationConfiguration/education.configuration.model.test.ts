import { describe, it, expect } from 'vitest';
import EducationConfigurationModel from './education.configuration.model';
import ConfigurationBranchesModel from './configuration.branch.model';

describe('EducationConfigurationModel', () => {
  describe('constructor', () => {
    it('should create a valid model', () => {
      const model = new EducationConfigurationModel({
        educationClassification: { id: 1, title: 'Test' },
        numberOfBranches: 2,
        branches: [
          new ConfigurationBranchesModel({
            id: 1,
            levelNumber: 1,
            singularTitle: [{ locale: 'en', singular_title: 'Level 1' }],
            pluralTitle: [{ locale: 'en', plural_title: 'Levels 1' }],
          }),
        ],
      });

      expect(model.educationClassification.id).toBe(1);
      expect(model.numberOfBranches).toBe(2);
      expect(model.branches).toHaveLength(1);
    });
  });

  describe('fromJson', () => {
    it('should parse API JSON correctly', () => {
      const json = {
        education_classification: { id: 3, title: 'Test 3' },
        number_of_branches: 2,
        branches: [
          {
            id: 1,
            level_number: 1,
            singular_title: [{ locale: 'en', singular_title: 'Stage' }],
            plural_title: [{ locale: 'en', plural_title: 'Stages' }],
          },
        ],
      };

      const model = EducationConfigurationModel.fromJson(json);

      expect(model.educationClassification.id).toBe(3);
      expect(model.numberOfBranches).toBe(2);
      expect(model.branches).toHaveLength(1);
      expect(model.branches[0].levelNumber).toBe(1);
      expect(model.branches[0].singularTitle[0].singular_title).toBe('Stage');
    });

    it('should throw when JSON is null', () => {
      expect(() => EducationConfigurationModel.fromJson(null as any)).toThrow(
        'Cannot create EducationConfigurationModel from null or undefined',
      );
    });
  });

  describe('example', () => {
    it('should be a valid instance', () => {
      const ex = EducationConfigurationModel.example;
      expect(ex).toBeInstanceOf(EducationConfigurationModel);
      expect(ex.numberOfBranches).toBeGreaterThan(0);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const model = new EducationConfigurationModel({
        educationClassification: { id: 1, title: 'T' },
        numberOfBranches: 0,
        branches: [],
      });

      expect(Object.isFrozen(model)).toBe(true);
    });
  });
});
