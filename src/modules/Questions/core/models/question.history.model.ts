import { EmployeeModel } from '@/modules/employee';
import HistoryStatusModel from './subModels/history.status.model';

export default class QuestionHistoryModel {
  public questionReviewStatusId?: number;
  public questionId?: number;
  public status?: HistoryStatusModel | null;
  public note?: string;
  public employee?: EmployeeModel | null;
  public caretedAt?: string;

  constructor(data: {
    questionReviewStatusId?: number;
    questionId?: number;
    status?: HistoryStatusModel | null;
    note?: string;
    employee?: EmployeeModel | null;
    caretedAt?: string;
  }) {
    this.questionReviewStatusId = data.questionReviewStatusId;
    this.questionId = data.questionId;
    this.status = data.status;
    this.note = data.note;
    this.employee = data.employee;
    this.caretedAt = data.caretedAt;

    Object.freeze(this);
  }

  static fromJson(json: any): QuestionHistoryModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new QuestionHistoryModel({
      questionReviewStatusId: json.question_review_status_id!,
      questionId: json.question_id!,
      status: json.status ? HistoryStatusModel.fromJson(json.status) : null,
      note: json.note!,
      employee: json.employee ? EmployeeModel.fromJson(json.employee!) : null,
      caretedAt: json.created_at!,
    });
  }

  static example: QuestionHistoryModel = new QuestionHistoryModel({
    questionReviewStatusId: 1,
    questionId: 1,
    status: HistoryStatusModel.example,
    note: 'note',
    employee: EmployeeModel.example,
    caretedAt: '2022-01-01',
  });
}
