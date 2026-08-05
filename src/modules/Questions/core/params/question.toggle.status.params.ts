import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { QuestionStatusEnum } from '../constant/question.status.enum';

/**
 * Parameters for showing an employee
 */
export default class ToggleQuestionStatusParams implements Params {
  public id: number;
  public status: QuestionStatusEnum;
  public note?: string;

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true },
    status: { required: true },
  });

  constructor(data: { id: number; status: QuestionStatusEnum; note?: string }) {
    this.id = data.id;
    this.status = data.status;
    this.note = data.note;
  }

  toMap(): { [p: string]: any } {
    return {
      question_id: this.id,
      status: this.status,
      ...(this.note && { note: this.note }),
    };
  }

  validate() {
    return ToggleQuestionStatusParams.validation.validate(this);
  }

  validateOrThrow() {
    return ToggleQuestionStatusParams.validation.validateOrThrow(this);
  }
}
