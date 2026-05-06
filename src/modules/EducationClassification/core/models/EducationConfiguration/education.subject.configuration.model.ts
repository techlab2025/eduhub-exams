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
    SingluarTitle: Record<string, string>;
    branches: ConfigurationBranchesModel[];
  }) {
    this.educationClassificatioId = data.educationClassificatioId;
    this.numberOfBranches = data.numberOfBranches;
    this.pluralTitle = data.pluralTitle;
    this.SingluarTitle = data.SingluarTitle;
    this.branches = data.branches;

    Object.freeze(this);
  }

  static fromJson(json: any): EducationSubjectConfigurationModel {
    if (!json) {
      throw new Error('Cannot create EducationSubjectConfigurationModel from null or undefined');
    }

    const singularTitle: Record<string, string> = {};
    (json.singular_title ?? []).forEach((item: { locale: string; singular_title: string }) => {
      singularTitle[item.locale] = item.singular_title;
    });

    const pluralTitle: Record<string, string> = {};
    (json.plural_title ?? []).forEach((item: { locale: string; plural_title: string }) => {
      pluralTitle[item.locale] = item.plural_title;
    });

    return new EducationSubjectConfigurationModel({
      pluralTitle,
      SingluarTitle: singularTitle,
      educationClassificatioId: json.education_classification,
      numberOfBranches: json.number_of_branches,
      branches:
        json.branches?.map((branch: any) => ConfigurationBranchesModel.fromJson(branch)) || [],
    });
  }

  static example: EducationSubjectConfigurationModel = new EducationSubjectConfigurationModel({
    educationClassificatioId: 1,
    numberOfBranches: 2,
    pluralTitle: { en: 'title 1 ', ar: 'title 1 ' },
    SingluarTitle: { en: 'title 1 ', ar: 'title 1 ' },
    branches: [ConfigurationBranchesModel.example],
  });
}
