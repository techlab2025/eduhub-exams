import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class FetchEducationStageParams implements Params {
  public classification_id: number;
  public parent_id?: number;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(data: { classification_id: number; parent_id?: number }) {
    this.classification_id = data.classification_id;
    this.parent_id = data.parent_id;
  }

  toMap(): { [p: string]: any } {
    return {
      education_classification_id: this.classification_id,
      parent_id: this.parent_id ?? null,
    };
  }

  validate() {
    return FetchEducationStageParams.validation.validate(this);
  }

  validateOrThrow() {
    return FetchEducationStageParams.validation.validateOrThrow(this);
  }
}
