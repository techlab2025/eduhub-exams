import type TitleInterface from '@/base/Data/Models/titleInterface';
import ConfigurationBranchesModel from './configuration.branch.model';

/**
 * Model for Education Configuration
 */
export default class EducationConfigurationModel {
  public readonly educationClassification: TitleInterface<number>;
  public readonly numberOfBranches: number;
  public readonly branches: ConfigurationBranchesModel[];

  constructor(data: {
    educationClassification: TitleInterface<number>;
    numberOfBranches: number;
    branches: ConfigurationBranchesModel[];
  }) {
    this.educationClassification = data.educationClassification;
    this.numberOfBranches = data.numberOfBranches;
    this.branches = data.branches;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>): EducationConfigurationModel {
    if (!json) {
      throw new Error('Cannot create EducationConfigurationModel from null or undefined');
    }

    return new EducationConfigurationModel({
      educationClassification: json.education_classification || {
        id: json.education_classification_id,
        title: '',
      },
      numberOfBranches: (json.number_of_branches ?? json.numberOfBranches) as number,
      branches:
        (json.branches as any[])?.map((branch: any) =>
          ConfigurationBranchesModel.fromJson(branch),
        ) || [],
    });
  }

  static example: EducationConfigurationModel = new EducationConfigurationModel({
    educationClassification: { id: 1, title: 'Example' },
    numberOfBranches: 2,
    branches: [
      ConfigurationBranchesModel.example,
      new ConfigurationBranchesModel({
        id: 2,
        levelNumber: 2,
        singularTitle: [
          { locale: 'en', singular_title: 'Grade' },
          { locale: 'ar', singular_title: 'صف' },
        ],
        pluralTitle: [
          { locale: 'en', plural_title: 'Grades' },
          { locale: 'ar', plural_title: 'صفوف' },
        ],
      }),
    ],
  });
}
