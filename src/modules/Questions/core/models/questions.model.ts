import { QuestionGeneratedByEnum } from '../constant/generatedby.enum';
import { QuestionDifficultyEnum } from '../constant/question.difficulty.enum';
import { QuestionStatusEnum } from '../constant/question.status.enum';
import { QuestionTypeEnum } from '../constant/question.type.enum';

export default class questionsModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly generatedBy: QuestionGeneratedByEnum;
  public readonly questionType: QuestionTypeEnum;
  public readonly difficulty: QuestionDifficultyEnum;
  public readonly status: QuestionStatusEnum;

  constructor(data: {
    id?: number;
    title?: string;
    generatedBy?: QuestionGeneratedByEnum;
    questionType?: QuestionTypeEnum;
    difficulty?: QuestionDifficultyEnum;
    status?: QuestionStatusEnum;
  }) {
    this.id = data.id;
    this.title = data.title || '';
    this.generatedBy = data.generatedBy as QuestionGeneratedByEnum;
    this.questionType = data.questionType as QuestionTypeEnum;
    this.difficulty = data.difficulty as QuestionDifficultyEnum;
    this.status = data.status as QuestionStatusEnum;

    Object.freeze(this);
  }

  static fromJson(json: any): questionsModel {
    if (!json) {
      throw new Error('Cannot create questionsModel from null or undefined');
    }
 
    return new questionsModel({
      id: json.id,
      title: json.title,
      generatedBy: json.generated_by,
      questionType: json.question_type,
      difficulty: json.difficulty,
      status: json.status,
    });
  }

  static example: questionsModel = new questionsModel({
    id: 1,
    title: 'What is the capital of Egypt? ',
    generatedBy: QuestionGeneratedByEnum.manual,
    questionType: QuestionTypeEnum.mcq,
    difficulty: QuestionDifficultyEnum.easy,
    status: QuestionStatusEnum.not_Reviewd,
  });
}
