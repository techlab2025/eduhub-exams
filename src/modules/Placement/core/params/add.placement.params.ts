import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/** Parameters for saving the placement configuration. */
export default class AddPlacementParams implements Params {
  public numberOfQuestions?: number;
  public time?: number;
  public difficulties?: {
    easy: number;
    medium: number;
    hard: number;
  };

  public static readonly validation = new ClassValidation().setRules({
    numberOfQuestions: { required: false },
    time: { required: false },
    difficulties: { required: false },
  });

  constructor(data: {
    numberOfQuestions?: number;
    time?: number;
    difficulties?: { easy: number; medium: number; hard: number };
  }) {
    this.numberOfQuestions = data.numberOfQuestions;
    this.time = data.time;
    this.difficulties = data.difficulties;
  }

  toMap(): Record<string, number> {
    const questionCount = this.numberOfQuestions ?? 0;

    return {
      question_count: questionCount,
      easy_questions_count: this.getQuestionCount(this.difficulties?.easy),
      medium_questions_count: this.getQuestionCount(this.difficulties?.medium),
      hard_questions_count: this.getQuestionCount(this.difficulties?.hard),
      minute_count: this.time ?? 0,
    };
  }

  private getQuestionCount(percentage?: number): number {
    return Math.floor(((this.numberOfQuestions ?? 0) * (percentage ?? 0)) / 100);
  }

  validate() {
    return AddPlacementParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddPlacementParams.validation.validateOrThrow(this);
  }
}
