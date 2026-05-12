import type TitleInterface from '@/base/Data/Models/titleInterface';
import ConfigurationBranchesModel from './configuration.branch.model';

export default class EducationSubjectConfigurationModel {
  public readonly educationClassification: TitleInterface<number>;
  public readonly numberOfBranches: number;
  public readonly pluralTitle: unknown[];
  public readonly singularTitle: unknown[];
  public readonly branches: ConfigurationBranchesModel[];

  constructor(data: {
    educationClassification: TitleInterface<number>;
    numberOfBranches: number;
    pluralTitle: unknown[];
    singularTitle: unknown[];
    branches: ConfigurationBranchesModel[];
  }) {
    this.educationClassification = data.educationClassification;
    this.numberOfBranches = data.numberOfBranches;
    this.pluralTitle = data.pluralTitle;
    this.singularTitle = data.singularTitle;
    this.branches = data.branches;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): EducationSubjectConfigurationModel {
    if (!json) {
      throw new Error('Cannot create EducationSubjectConfigurationModel from null or undefined');
    }

    const translations = (json.translation || json.translations || {}) as Record<string, any>;
    const pluralTitle =
      json.plural_title || translations.PluralTitle || translations.pluralTitle || [];
    const singularTitle =
      json.singular_title || translations.SingularTitle || translations.singularTitle || [];

    return new EducationSubjectConfigurationModel({
      pluralTitle: Array.isArray(pluralTitle) ? (pluralTitle as unknown[]) : [],
      singularTitle: Array.isArray(singularTitle) ? (singularTitle as unknown[]) : [],
      educationClassification: (json.education_classification || {
        id: (json.education_classification_id || 0) as number,
        title: '',
      }) as TitleInterface<number>,
      numberOfBranches: (json.number_of_branches ?? json.numberOfBranches ?? 0) as number,
      branches:
        (json.branches as Record<string, unknown>[])?.map((branch: Record<string, unknown>) =>
          ConfigurationBranchesModel.fromJson(branch),
        ) || [],
    });
  }

  static example: EducationSubjectConfigurationModel = new EducationSubjectConfigurationModel({
    educationClassification: {
      id: 1,
      title: 'aa',
    },
    numberOfBranches: 2,
    pluralTitle: [
      { locale: 'en', plural_title: 'Subjects' },
      { locale: 'ar', plural_title: 'مواد' },
    ],
    singularTitle: [
      { locale: 'en', singular_title: 'Subject' },
      { locale: 'ar', singular_title: 'مادة' },
    ],
    branches: [ConfigurationBranchesModel.example, ConfigurationBranchesModel.example],
  });
}
