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

  static fromJson(json: Record<string, unknown>): ConfigurationBranchesModel {
    if (!json) {
      throw new Error('Cannot create EducationConfigurationModel from null or undefined');
    }

    const parseLocaleArray = (data: unknown, valueKey: string): Record<string, string> => {
      if (!data) return {};
      if (Array.isArray(data)) {
        return (data as Record<string, unknown>[]).reduce(
          (acc: Record<string, string>, item: Record<string, unknown>) => {
            if (item.locale) acc[item.locale as string] = (item[valueKey] as string) ?? '';
            return acc;
          },
          {},
        );
      }
      return data;
    };

    return new ConfigurationBranchesModel({
      id: json.id,
      levelNumber: json.level_number || json.levelNumber,
      singularTitle: parseLocaleArray(
        json.singular_title ??
          json.translation?.SingularTitle ??
          json.translations?.SingularTitle ??
          json.translations,
        'singular_title',
      ),
      pluralTitle: parseLocaleArray(
        json.plural_title ??
          json.translation?.PluralTitle ??
          json.translations?.PluralTitle ??
          json.translations,
        'plural_title',
      ),
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
