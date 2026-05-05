import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new country
 */
export default class IndexEducationConfigurationParams implements Params {
  public educationClassificatioId: number;

  public static readonly validation = new ClassValidation().setRules({
    educationClassificatioId: { required: true },
  });

  constructor(data: {
    educationClassificatioId: number;
  }) {
    this.educationClassificatioId = data.educationClassificatioId;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      education_classification_id: this.educationClassificatioId,
    };
    return map;
  }

  validate() {
    return IndexEducationConfigurationParams.validation.validate(this);
  }

  validateOrThrow() {
    return IndexEducationConfigurationParams.validation.validateOrThrow(this);
  }
}
