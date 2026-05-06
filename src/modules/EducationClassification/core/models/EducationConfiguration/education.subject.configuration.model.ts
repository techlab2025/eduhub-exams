import ConfigurationBranchesModel from './configuration.branch.model';

export default class EducationSubjectConfigurationModel {
  public readonly educationClassificatioId: number;
  public readonly numberOfBranches: number;
  public readonly pluralTitle: Record<string, string>;
  public readonly SingluarTitle: Record<string, string>;
  public readonly branches: ConfigurationBranchesModel[];

  constructor(data: {
    educationClassificatioId: number;
    numberOfBranches: number;
    pluralTitle: Record<string, string>;
    SingularTitle: Record<string, string>;
    branches: ConfigurationBranchesModel[];
  }) {
    this.educationClassificatioId = data.educationClassificatioId;
    this.numberOfBranches = data.numberOfBranches;
    this.pluralTitle = data.pluralTitle;
    this.SingularTitle = data.SingularTitle;
    this.branches = data.branches;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): EducationSubjectConfigurationModel {
    if (!json) {
      throw new Error('Cannot create EducationSubjectConfigurationModel from null or undefined');
    }

    const singularTitle: Record<string, string> = {};
    if (json.translation?.SingularTitle) {
      Object.assign(singularTitle, json.translation.SingularTitle);
    }
    (json.singular_title ?? []).forEach((item: { locale: string; singular_title: string }) => {
      singularTitle[item.locale] = item.singular_title;
    });

    const pluralTitle: Record<string, string> = {};
    if (json.translation?.PluralTitle) {
      Object.assign(pluralTitle, json.translation.PluralTitle);
    }
    (json.plural_title ?? []).forEach((item: { locale: string; plural_title: string }) => {
      pluralTitle[item.locale] = item.plural_title;
    });

    return new EducationSubjectConfigurationModel({
      pluralTitle,
      SingularTitle: singularTitle,
      educationClassificatioId: json.education_classification ?? json.education_classification_id,
      numberOfBranches: json.number_of_branches ?? json.numberOfBranches,
      branches:
        (json.branches as Record<string, unknown>[])?.map((branch: Record<string, unknown>) =>
          ConfigurationBranchesModel.fromJson(branch),
        ) || [],
    });
  }

  static example: EducationSubjectConfigurationModel = new EducationSubjectConfigurationModel({
    educationClassificatioId: 1,
    numberOfBranches: 2,
    pluralTitle: { en: 'title 1 ', ar: 'title 1 ' },
    SingularTitle: { en: 'title 1 ', ar: 'title 1 ' },
    branches: [ConfigurationBranchesModel.example, ConfigurationBranchesModel.example],
  });
}
