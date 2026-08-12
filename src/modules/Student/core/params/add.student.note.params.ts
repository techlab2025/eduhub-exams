import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export class AddStudentNoteParams implements Params {
  public studentId: number;
  public note: string;
  private static readonly validation = new ClassValidation().setRules({
    studentId: { required: true, min: 1 },
    note: { required: true },
  });

  constructor(studentId: number, note: string) {
    this.studentId = studentId;
    this.note = note.trim();
  }

  toMap() {
    return {
      student_id: this.studentId,
      note: this.note,
    };
  }

  validate() {
    return AddStudentNoteParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddStudentNoteParams.validation.validateOrThrow(this);
  }
}
