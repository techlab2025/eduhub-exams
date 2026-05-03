import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class AddSubjectItemParams implements Params {
  public title: string;
  public stage_id: number;
  public parent_id?: number;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(data: { title: string; stage_id: number; parent_id?: number }) {
    this.title = data.title;
    this.stage_id = data.stage_id;
    this.parent_id = data.parent_id;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      title: this.title,
      stage_id: this.stage_id,
    };
    if (this.parent_id) map.parent_id = this.parent_id;
    return map;
  }

  validate() {
    return AddSubjectItemParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddSubjectItemParams.validation.validateOrThrow(this);
  }
}
