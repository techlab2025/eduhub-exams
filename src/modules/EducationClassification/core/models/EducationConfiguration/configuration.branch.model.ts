import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Model for Education Configuration Branches
 */
export default class ConfigurationBranchesModel {
  levelNumber: number;
  id: number;
  pluralTitle: unknown[];
  singularTitle: unknown[];

  public static readonly validation = new ClassValidation().setRules({
    levelNumber: { required: true },
  });

  constructor(data: {
    levelNumber: number;
    id: number;
    pluralTitle: unknown[];
    singularTitle: unknown[];
  }) {
    this.id = data.id;
    this.levelNumber = data.levelNumber;
    this.pluralTitle = data.pluralTitle;
    this.singularTitle = data.singularTitle;
  }

  static fromJson(json: Record<string, unknown>): ConfigurationBranchesModel {
    if (!json) {
      throw new Error('Cannot create ConfigurationBranchesModel from null or undefined');
    }

    const translations = (json.translation || json.translations || {}) as Record<string, any>;
    const pluralTitle =
      json.plural_title || translations.PluralTitle || translations.pluralTitle || [];
    const singularTitle =
      json.singular_title || translations.SingularTitle || translations.singularTitle || [];

    return new ConfigurationBranchesModel({
      id: json.id as number,
      levelNumber: (json.level_number || json.levelNumber) as number,
      singularTitle: Array.isArray(singularTitle) ? (singularTitle as unknown[]) : [],
      pluralTitle: Array.isArray(pluralTitle) ? (pluralTitle as unknown[]) : [],
    });
  }

  static example: ConfigurationBranchesModel = new ConfigurationBranchesModel({
    id: 1,
    levelNumber: 1,
    pluralTitle: [
      { locale: 'en', plural_title: 'Parts' },
      { locale: 'ar', plural_title: 'اجزاء' },
    ],
    singularTitle: [
      { locale: 'en', singular_title: 'Part' },
      { locale: 'ar', singular_title: 'جزء' },
    ],
  });
}
