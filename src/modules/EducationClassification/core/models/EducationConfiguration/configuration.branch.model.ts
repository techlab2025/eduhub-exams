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

    return new ConfigurationBranchesModel({
      id: json.id as number,
      levelNumber: (json.level_number || json.levelNumber) as number,
      singularTitle: json.singular_title,
      pluralTitle: json.plural_title,
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
