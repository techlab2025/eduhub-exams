import EducationSubjectParams from '../../params/EducationSubjects/education.subject.params';
import TranslationParams from '../../params/translation.params';

export default class EducationSubjectConfigurationModel {
  public readonly educationClassificatioId: number;
  public readonly numberOfBranches: number;
  public readonly translation: TranslationParams;
  public readonly branches: EducationSubjectParams[];

  constructor(data: {
    educationClassificatioId: number;
    numberOfBranches: number;
    translation: TranslationParams;
    branches: EducationSubjectParams[];
  }) {
    this.educationClassificatioId = data.educationClassificatioId;
    this.numberOfBranches = data.numberOfBranches;
    this.translation = data.translation;
    this.branches = data.branches;

    Object.freeze(this);
  }

  static fromJson(json: any): EducationSubjectConfigurationModel {
    if (!json) {
      throw new Error('Cannot create EducationSubjectConfigurationModel from null or undefined');
    }

    return new EducationSubjectConfigurationModel({
      educationClassificatioId: json.education_classification_id,
      numberOfBranches: json.number_of_branches,
      translation: new TranslationParams({
        SingularTitle: json.translation?.SingularTitle || {},
        PluralTitle: json.translation?.PluralTitle || {},
      }),
      branches:
        json.branches?.map(
          (branch: any) =>
            new EducationSubjectParams({
              levelNumber: branch.level_number,
              translation: new TranslationParams({
                SingularTitle: branch.translation?.SingularTitle || {},
                PluralTitle: branch.translation?.PluralTitle || {},
              }),
            }),
        ) || [],
    });
  }

  static example: EducationSubjectConfigurationModel = new EducationSubjectConfigurationModel({
    educationClassificatioId: 1,
    numberOfBranches: 2,
    translation: new TranslationParams({
      SingularTitle: { en: 'Subject', ar: 'مادة' },
      PluralTitle: { en: 'Subjects', ar: 'مواد' },
    }),
    branches: [
      new EducationSubjectParams({
        levelNumber: 1,
        translation: new TranslationParams({
          SingularTitle: { en: 'Part', ar: 'جزء' },
          PluralTitle: { en: 'Parts', ar: 'اجزاء' },
        }),
      }),
      new EducationSubjectParams({
        levelNumber: 2,
        translation: new TranslationParams({
          SingularTitle: { en: 'Unit', ar: 'وحدة' },
          PluralTitle: { en: 'Units', ar: 'وحدات' },
        }),
      }),
    ],
  });
}
