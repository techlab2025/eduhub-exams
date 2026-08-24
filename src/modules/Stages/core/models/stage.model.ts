import TitleInterface from '@/base/Data/Models/titleInterface';
import { EducationType } from '../constants/educationtype.enum';
import BranchesModel from './branches.model';

/**
 * Country model representing a nation's geographical and cultural data
 */
export default class StageModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly full_title: string;
  public readonly e_c_subject_id?: number;
  public readonly e_c_branch_id?: number;
  public readonly branches: BranchesModel[];
  public readonly EducationType: TitleInterface<EducationType>;
  public readonly children: StageModel[];
  public readonly subjects: StageModel[];

  constructor(data: {
    id?: number;
    title: string;
    full_title: string;
    e_c_subject_id?: number;
    e_c_branch_id?: number;
    branches: BranchesModel[];
    EducationType: TitleInterface<EducationType>;
    children: StageModel[];
    subjects?: StageModel[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.full_title = data.full_title;
    this.e_c_subject_id = data.e_c_subject_id;
    this.e_c_branch_id = data.e_c_branch_id;
    this.branches = data.branches;
    this.EducationType = data.EducationType;
    this.children = data.children;
    this.subjects = data.subjects ?? [];

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns CountryModel instance
   */
  static fromJson(json: any): StageModel {
    if (!json) {
      throw new Error('Cannot create CountryModel from null or undefined');
    }

    return new StageModel({
      id: json.id,
      title: json.title,
      full_title: json.full_title,
      e_c_subject_id: json.e_c_subject_id,
      e_c_branch_id: json.e_c_branch_id,
      branches: json.branches?.map((branch: any) => BranchesModel.fromJson(branch)) ?? [],
      EducationType: json.education_type,
      children: json.children?.map((child: any) => StageModel.fromJson(child)) ?? [],
      subjects: json.subjects?.map((subject: any) => StageModel.fromJson(subject)) ?? [],
    });
  }

  static example: StageModel = new StageModel({
    id: 1,
    title: 'المرحلة الثانوية',
    full_title: 'المرحلة الثانوية',
    branches: [BranchesModel.example],
    EducationType: new TitleInterface({
      id: EducationType.General,
      title: 'General',
    }),
    children: [],
    subjects: [],
  });
}
