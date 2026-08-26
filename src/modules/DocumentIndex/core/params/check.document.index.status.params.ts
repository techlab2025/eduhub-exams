import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class CheckDocumentIndexStatusParams implements Params {
  public readonly patchId: number;

  public static readonly validation = new ClassValidation().setRules({
    patchId: { required: true, min: 1 },
  });

  constructor(patchId: number) {
    this.patchId = patchId;
  }

  toMap(): Record<string, number> {
    return { id: this.patchId };
  }

  validate() {
    return CheckDocumentIndexStatusParams.validation.validate(this);
  }

  validateOrThrow() {
    return CheckDocumentIndexStatusParams.validation.validateOrThrow(this);
  }
}
