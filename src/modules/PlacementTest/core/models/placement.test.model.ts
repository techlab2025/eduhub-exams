import EducationClassificationBranchModel from '@/shared/GeneralModels/education.classification.branch.model';
import EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
import StudentModel from '@/shared/GeneralModels/student.model';
import type { PlacementTestEnum } from '../constant/palcement.test.enum';


export default class PlcaementTestModel {
  public readonly id?: number;
  public readonly student?: StudentModel;
  public readonly result?: number;
  public readonly EducationClassificationSubject?: EducationClassificationSubjectModel;
  public readonly EducationClassificationBranch?: EducationClassificationBranchModel;
  public readonly numberOfQuestions?: number;
  public readonly status?: PlacementTestEnum;
  public readonly in_plan?: boolean;
  public readonly date?: string;

  constructor(data: {
    id?: number;
    student?: StudentModel;
    result?: number;
    EducationClassificationSubject?: EducationClassificationSubjectModel;
    EducationClassificationBranch?: EducationClassificationBranchModel;
    numberOfQuestions?: number;
    status?: PlacementTestEnum;
    in_plan?: boolean;
    date?: string;
  }) {
    this.id = data.id;
    this.student = data.student;
    this.result = data.result;
    this.EducationClassificationSubject = data.EducationClassificationSubject;
    this.EducationClassificationBranch = data.EducationClassificationBranch;
    this.numberOfQuestions = data.numberOfQuestions;
    this.status = data.status;
    this.in_plan = data.in_plan;
    this.date = data.date;

    Object.freeze(this);
  }

  static fromJson(json: any): PlcaementTestModel {
    if (!json) {
      throw new Error('Cannot create PlcaementTestModel from null or undefined');
    }

    return new PlcaementTestModel({
      id: json.id,
      student: json.student ? StudentModel.fromJson(json.student) : undefined,
      result: json.result,
      EducationClassificationSubject: json.e_c_subject
        ? EducationClassificationSubjectModel.fromJson(json.e_c_subject)
        : undefined,
      EducationClassificationBranch: json.e_c_branch
        ? EducationClassificationBranchModel.fromJson(json.e_c_branch)
        : undefined,
      numberOfQuestions: json.number_of_questions,
      status: json.status,
      in_plan: json.in_plan,
      date: json.date,
    });
  }

  static example: PlcaementTestModel = new PlcaementTestModel({
    id: 1,
    student: StudentModel.example,
    result: 85,
    EducationClassificationSubject: EducationClassificationSubjectModel.example,
    EducationClassificationBranch: EducationClassificationBranchModel.example,
    numberOfQuestions: 50,
    status: 1,
    in_plan: true,
    date: '2023-01-01',
  });
}
