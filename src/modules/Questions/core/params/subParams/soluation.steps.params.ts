import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class SolutionStepsParams implements Params {
  public explanation?: string;
  public image?: string;

  public static readonly validation = new ClassValidation().setRules({
    explanation: { required: true },
    image: { required: true },
  });

  constructor(data: { explanation?: string; image?: string }) {
    this.explanation = data.explanation;
    this.image = data.image;
  }

  toMap(): { [p: string]: any } {
    return {
      explanation: this.explanation,
      image: this.image,
    };
  }

  validate() {
    return SolutionStepsParams.validation.validate(this);
  }

  validateOrThrow() {
    return SolutionStepsParams.validation.validateOrThrow(this);
  }
}
