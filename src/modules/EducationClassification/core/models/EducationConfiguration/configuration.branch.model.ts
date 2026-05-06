import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new country
 */
export default class ConfigurationBranchesModel {
  levelNumber: number;
  id: number;
  pluralTitle: Record<string, string>;
  singularTitle: Record<string, string>;

  public static readonly validation = new ClassValidation().setRules({
    levelNumber: { required: true },
  });

  constructor(data: {
    levelNumber: number;
    id: number;
    pluralTitle: Record<string, string>;
    singularTitle: Record<string, string>;
  }) {
    this.id = data.id;
    this.levelNumber = data.levelNumber;
    this.pluralTitle = data.pluralTitle;
    this.singularTitle = data.singularTitle;
  }

  static fromJson(json: any): ConfigurationBranchesModel {
    if (!json) {
      throw new Error('Cannot create EducationConfigurationModel from null or undefined');
    }

    const parseLocaleArray = (data: any, valueKey: string): Record<string, string> => {
      if (!data) return {};
      if (Array.isArray(data)) {
        return data.reduce((acc: Record<string, string>, item: any) => {
          if (item.locale) acc[item.locale] = item[valueKey] ?? '';
          return acc;
        }, {});
      }
      return data;
    };

    return new ConfigurationBranchesModel({
      id: json.id,
      levelNumber: json.level_number,
      singularTitle: parseLocaleArray(json.singular_title, 'singular_title'),
      pluralTitle: parseLocaleArray(json.plural_title, 'plural_title'),
    });
  }

  static example: ConfigurationBranchesModel = new ConfigurationBranchesModel({
    id: 1,
    levelNumber: 1,
    pluralTitle: {
      en: 'en',
      ar: 'ar',
    },
    singularTitle: {
      en: 'en',
      ar: 'ar',
    },
  });
}
