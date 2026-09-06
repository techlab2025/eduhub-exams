import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowQuestionBatchParams implements Params {
  public readonly questionBatchId: number;

  private static readonly validation = new ClassValidation().setRules({
    questionBatchId: { required: true, min: 1 },
  });

  constructor(questionBatchId: number) {
    this.questionBatchId = questionBatchId;
  }

  toMap(): Record<string, number> {
    return { question_batch_id: this.questionBatchId };
  }

  validate() {
    return ShowQuestionBatchParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowQuestionBatchParams.validation.validateOrThrow(this);
  }
}
