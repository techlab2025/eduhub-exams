import ConfigurationParams from '../../params/EducationConfiguration/Configuration.params';
import TranslationParams from '../../params/translation.params';

export default class EducationConfigurationModel {
  public readonly educationClassificatioId: number;
  public readonly numberOfBranches: number;
  public readonly branches: ConfigurationParams[];

  constructor(data: {
    educationClassificatioId: number;
    numberOfBranches: number;
    branches: ConfigurationParams[];
  }) {
    this.educationClassificatioId = data.educationClassificatioId;
    this.numberOfBranches = data.numberOfBranches;
    this.branches = data.branches;

    Object.freeze(this);
  }

  static fromJson(json: any): EducationConfigurationModel {
    if (!json) {
      throw new Error('Cannot create EducationConfigurationModel from null or undefined');
    }

    return new EducationConfigurationModel({
      educationClassificatioId: json.education_classification_id,
      numberOfBranches: json.number_of_branches,
      branches:
        json.branches?.map(
          (branch: any) =>
            new ConfigurationParams({
              levelNumber: branch.level_number,
              translation: new TranslationParams({
                SingularTitle:
                  branch.translations?.SingularTitle || branch.translation?.SingularTitle || {},
                PluralTitle:
                  branch.translations?.PluralTitle || branch.translation?.PluralTitle || {},
              }),
            }),
        ) || [],
    });
  }

  static example: EducationConfigurationModel = new EducationConfigurationModel({
    educationClassificatioId: 1,
    numberOfBranches: 3,
    branches: [
      new ConfigurationParams({
        levelNumber: 1,
        translation: new TranslationParams({
          SingularTitle: { en: 'Stage', ar: 'مرحلة' },
          PluralTitle: { en: 'Stages', ar: 'مراحل' },
        }),
      }),
      new ConfigurationParams({
        levelNumber: 2,
        translation: new TranslationParams({
          SingularTitle: { en: 'Grade', ar: 'صف' },
          PluralTitle: { en: 'Grades', ar: 'صفوف' },
        }),
      }),
      new ConfigurationParams({
        levelNumber: 3,
        translation: new TranslationParams({
          SingularTitle: { en: 'Term', ar: 'فصل' },
          PluralTitle: { en: 'Terms', ar: 'فصول' },
        }),
      }),
    ],
  });
}
