import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export class ShowStudentParams implements Params {
  public id: number;
  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });

  constructor(id: number) {
    this.id = id;
  }

  toMap() {
    return { student_id: this.id };
  }

  validate() {
    return ShowStudentParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowStudentParams.validation.validateOrThrow(this);
  }
}
