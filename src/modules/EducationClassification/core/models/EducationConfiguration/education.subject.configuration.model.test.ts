import { describe, it, expect } from 'vitest';
import EducationSubjectConfigurationModel from './education.subject.configuration.model';
import ConfigurationBranchesModel from './configuration.branch.model';

describe('EducationSubjectConfigurationModel', () => {
  describe('constructor', () => {
    it('should create a valid model', () => {
      const model = new EducationSubjectConfigurationModel({
        educationClassification: { id: 1, title: 'Test' },
        numberOfBranches: 2,
        singularTitle: [{ locale: 'en', singular_title: 'Subject' }],
        pluralTitle: [{ locale: 'en', plural_title: 'Subjects' }],
        branches: [
          new ConfigurationBranchesModel({
            id: 1,
            levelNumber: 1,
            singularTitle: [{ locale: 'en', singular_title: 'Part' }],
            pluralTitle: [{ locale: 'en', plural_title: 'Parts' }],
          }),
        ],
      });

      expect(model.educationClassification.id).toBe(1);
      expect(model.numberOfBranches).toBe(2);
      expect(model.singularTitle[0].singular_title).toBe('Subject');
      expect(model.branches).toHaveLength(1);
    });
  });

  describe('fromJson', () => {
    it('should parse API JSON correctly', () => {
      const json = {
        education_classification: { id: 2, title: 'Test 2' },
        number_of_branches: 2,
        singular_title: [{ locale: 'en', singular_title: 'Subject' }],
        plural_title: [{ locale: 'en', plural_title: 'Subjects' }],
        branches: [
          {
            id: 1,
            level_number: 1,
            singular_title: [{ locale: 'en', singular_title: 'Part' }],
            plural_title: [{ locale: 'en', plural_title: 'Parts' }],
          },
        ],
      };

      const model = EducationSubjectConfigurationModel.fromJson(json);

      expect(model.educationClassification.id).toBe(2);
      expect(model.numberOfBranches).toBe(2);
      expect(model.singularTitle[0].singular_title).toBe('Subject');
      expect(model.pluralTitle[0].plural_title).toBe('Subjects');
      expect(model.branches).toHaveLength(1);
      expect(model.branches[0].levelNumber).toBe(1);
    });

    it('should default translation to empty arrays when missing', () => {
      const json = {
        education_classification: { id: 1, title: 'T' },
        number_of_branches: 0,
      };

      const model = EducationSubjectConfigurationModel.fromJson(json);

      expect(model.singularTitle).toEqual([]);
      expect(model.pluralTitle).toEqual([]);
      expect(model.branches).toEqual([]);
    });

    it('should throw when JSON is null', () => {
      expect(() => EducationSubjectConfigurationModel.fromJson(null)).toThrow(
        'Cannot create EducationSubjectConfigurationModel from null or undefined',
      );
    });
  });

  describe('example', () => {
    it('should be a valid instance with 2 branches', () => {
      const ex = EducationSubjectConfigurationModel.example;

      expect(ex).toBeInstanceOf(EducationSubjectConfigurationModel);
      expect(ex.numberOfBranches).toBe(2);
      expect(ex.branches).toHaveLength(2);
      expect(ex.singularTitle[0].singular_title).toBe('Subject');
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const model = new EducationSubjectConfigurationModel({
        educationClassification: { id: 1, title: 'T' },
        numberOfBranches: 0,
        singularTitle: [],
        pluralTitle: [],
        branches: [],
      });

      expect(Object.isFrozen(model)).toBe(true);
    });
  });
});
