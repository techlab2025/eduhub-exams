import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export class StudentStatsParams implements Params {
  private static readonly validation = new ClassValidation();

  toMap() {
    return {};
  }

  validate() {
    return StudentStatsParams.validation.validate(this);
  }

  validateOrThrow() {
    return StudentStatsParams.validation.validateOrThrow(this);
  }
}
