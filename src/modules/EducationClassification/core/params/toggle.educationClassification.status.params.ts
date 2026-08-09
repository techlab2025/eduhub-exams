import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new country
 */
export default class ToggleStatusEducationClassificationParams implements Params {
  public id: number;

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });

  constructor(data: { id: number }) {
    this.id = data.id;
  }

  toMap(): Record<string, number> {
    return {
      education_classification_id: this.id,
    };
  }

  validate() {
    return ToggleStatusEducationClassificationParams.validation.validate(this);
  }

  validateOrThrow() {
    return ToggleStatusEducationClassificationParams.validation.validateOrThrow(this);
  }
}
