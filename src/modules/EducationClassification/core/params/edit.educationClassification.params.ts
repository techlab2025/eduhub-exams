import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for updating an existing education classification
 */
export default class EditEducationClassificationParams implements Params {
  public id: number;
  public title: string;

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true },
    title: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  toMap(): { [p: string]: any } {
    return {
      id: this.id,
      title: this.title,
    };
  }

  validate() {
    return EditEducationClassificationParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditEducationClassificationParams.validation.validateOrThrow(this);
  }
}
