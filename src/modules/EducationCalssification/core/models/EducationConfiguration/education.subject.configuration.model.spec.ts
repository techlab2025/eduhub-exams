import { describe, it, expect } from 'vitest';
import EducationSubjectConfigurationModel from './education.subject.configuration.model';
import EducationSubjectParams from '../../params/EducationSubjects/education.subject.params';
import TranslationParams from '../../params/translation.params';

const makeTranslation = (singular: string, plural: string) =>
  new TranslationParams({
    SingularTitle: { en: singular, ar: singular },
    PluralTitle: { en: plural, ar: plural },
  });

describe('EducationSubjectConfigurationModel', () => {
  describe('constructor', () => {
    it('should create a valid model', () => {
      const model = new EducationSubjectConfigurationModel({
        educationClassificatioId: 1,
        numberOfBranches: 2,
        translation: makeTranslation('Subject', 'Subjects'),
        branches: [
          new EducationSubjectParams({
            levelNumber: 1,
            translation: makeTranslation('Part', 'Parts'),
          }),
        ],
      });

      expect(model.educationClassificatioId).toBe(1);
      expect(model.numberOfBranches).toBe(2);
      expect(model.translation.SingularTitle.en).toBe('Subject');
      expect(model.branches).toHaveLength(1);
    });
  });

  describe('fromJson', () => {
    it('should parse API JSON correctly', () => {
      const json = {
        education_classification_id: 2,
        number_of_branches: 2,
        translation: {
          SingularTitle: { en: 'Subject', ar: 'مادة' },
          PluralTitle: { en: 'Subjects', ar: 'مواد' },
        },
        branches: [
          {
            level_number: 1,
            translation: {
              SingularTitle: { en: 'Part', ar: 'جزء' },
              PluralTitle: { en: 'Parts', ar: 'اجزاء' },
            },
          },
          {
            level_number: 2,
            translation: {
              SingularTitle: { en: 'Unit', ar: 'وحدة' },
              PluralTitle: { en: 'Units', ar: 'وحدات' },
            },
          },
        ],
      };

      const model = EducationSubjectConfigurationModel.fromJson(json);

      expect(model.educationClassificatioId).toBe(2);
      expect(model.numberOfBranches).toBe(2);
      expect(model.translation.SingularTitle).toEqual({ en: 'Subject', ar: 'مادة' });
      expect(model.translation.PluralTitle).toEqual({ en: 'Subjects', ar: 'مواد' });
      expect(model.branches).toHaveLength(2);
      expect(model.branches[0]).toBeInstanceOf(EducationSubjectParams);
      expect(model.branches[0].levelNumber).toBe(1);
    });

    it('should default translation to empty objects when missing', () => {
      const json = {
        education_classification_id: 1,
        number_of_branches: 0,
      };

      const model = EducationSubjectConfigurationModel.fromJson(json);

      expect(model.translation.SingularTitle).toEqual({});
      expect(model.translation.PluralTitle).toEqual({});
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
      expect(ex.translation.SingularTitle.en).toBe('Subject');
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const model = new EducationSubjectConfigurationModel({
        educationClassificatioId: 1,
        numberOfBranches: 0,
        translation: makeTranslation('X', 'Xs'),
        branches: [],
      });

      expect(Object.isFrozen(model)).toBe(true);
    });
  });
});
