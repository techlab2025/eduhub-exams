import IndexParams from '@/base/Core/Params/indexParams';
import type { QuestionStatusEnum } from '../constant/question.status.enum';
import type { QuestionGeneratedByEnum } from '../constant/generatedby.enum';
import type { QuestionTypeEnum } from '../constant/question.type.enum';
import type { QuestionDifficultyEnum } from '../constant/question.difficulty.enum';
import OrderEnum from '@/base/Core/Constants/IndexFetchOrderEnum';

export default class IndexQuestionsParams extends IndexParams {
  public status?: QuestionStatusEnum;
  public generated_by?: QuestionGeneratedByEnum;
  public question_type?: QuestionTypeEnum;
  public difficulty?: QuestionDifficultyEnum;
  public subjectId?: number;
  public branchId?: number;
  public from_date?: string;
  public to_date?: string;

  constructor(data: {
    word: string;
    pageNumber: number;
    perPage: number;
    withPage: number;
    status?: QuestionStatusEnum;
    generated_by?: QuestionGeneratedByEnum;
    question_type?: QuestionTypeEnum;
    difficulty?: QuestionDifficultyEnum;
    subjectId?: number;
    branchId?: number;
    from_date?: string;
    to_date?: string;
  }) {
    super(data.word, data.pageNumber, data.perPage, data.withPage);
    this.status = data.status;
    this.generated_by = data.generated_by;
    this.question_type = data.question_type;
    this.difficulty = data.difficulty;
    this.subjectId = data.subjectId;
    this.branchId = data.branchId;
    this.from_date = data.from_date;
    this.to_date = data.to_date;
  }

  toMap(): Record<string, string | number> {
    return {
      ...super.toMap(),
      ...(this.status ? { status: this.status } : {}),
      ...(this.generated_by ? { generated_by: this.generated_by } : {}),
      ...(this.question_type ? { question_type: this.question_type } : {}),
      ...(this.difficulty ? { difficulty: this.difficulty } : {}),
      order_dir: OrderEnum.reverse,
      ...(this.subjectId ? { e_c_subject_id: this.subjectId } : {}),
      ...(this.branchId ? { e_c_branch_id: this.branchId } : {}),
      ...(this.from_date ? { from_date: this.from_date } : {}),
      ...(this.to_date ? { to_date: this.to_date } : {}),
    };
  }
}
