import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowPlacementStudentParams implements Params {
  public readonly studentId: number;

  static readonly validation = new ClassValidation().setRules({
    studentId: { required: true },
  });

  constructor(studentId: number) {
    this.studentId = studentId;
  }

  toMap(): Record<string, number> {
    return { student_id: this.studentId };
  }

  validate() {
    return ShowPlacementStudentParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowPlacementStudentParams.validation.validateOrThrow(this);
  }
}
