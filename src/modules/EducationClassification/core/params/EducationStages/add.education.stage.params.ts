import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new country
 */
export default class AddEducationStageParams implements Params {
  public title: string;
  public classification_id: number;
  public parent_id?: number;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(data: { title: string; classification_id: number; parent_id?: number }) {
    this.title = data.title;
    this.classification_id = data.classification_id;
    this.parent_id = data.parent_id;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      title: this.title,
      classification_id: this.classification_id,
    };
    if (this.parent_id) map.parent_id = this.parent_id;
    return map;
  }

  validate() {
    return AddEducationStageParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddEducationStageParams.validation.validateOrThrow(this);
  }
}
