import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class EditFaqsParams implements Params {
  public id: number;
  public question: Record<string, string>;
  public answer: Record<string, string>;

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true },
  });

  constructor(data: {
    id: number;
    question: Record<string, string>;
    answer: Record<string, string>;
  }) {

    this.id = data.id;
    this.question = data.question;
    this.answer = data.answer;
  }

  toMap(): { [p: string]: any } {
    return {
      translations: {
        question: this.question,
        answer: this.answer,
      },
    };
  }


  validate() {
    return EditFaqsParams.validation.validate(this);
  }
  validateOrThrow() {
    return EditFaqsParams.validation.validateOrThrow(this);
  }

}
