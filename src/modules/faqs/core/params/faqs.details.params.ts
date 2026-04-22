import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for adding a new country
 */
export default class FaqsDetailsParams implements Params {
  public answer: Record<string,string>;
  public question: Record<string,string>;

  public static readonly validation = new ClassValidation().setRules({
    answer: { required: true, minLength: 2, maxLength: 100 },
    question: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(data: { answer: Record<string,string>; question: Record<string,string> }) {
    this.answer = data.answer;
    this.question = data.question;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      answer: this.answer,
      question: this.question,
    };
    return map;
  }

  validate() {
    return FaqsDetailsParams.validation.validate(this);
  }

  validateOrThrow() {
    return FaqsDetailsParams.validation.validateOrThrow(this);
  }
}
