import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class FetchSubjectParams implements Params {
  public stage_id: number;
  public parent_id?: number;

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { stage_id: number; parent_id?: number }) {
    this.stage_id = data.stage_id;
    this.parent_id = data.parent_id;
  }

  toMap(): { [p: string]: any } {
    return {
      stage_id: this.stage_id,
      parent_id: this.parent_id ?? null,
    };
  }

  validate() {
    return FetchSubjectParams.validation.validate(this);
  }

  validateOrThrow() {
    return FetchSubjectParams.validation.validateOrThrow(this);
  }
}
