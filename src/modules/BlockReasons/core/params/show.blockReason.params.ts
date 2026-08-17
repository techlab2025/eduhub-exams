import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowBlockReasonsParams implements Params {
  public blockReasonId: number;
  public allLocales: boolean;

  public static readonly validation = new ClassValidation().setRules({
    blockReasonId: { required: true },
  });

  constructor(data: { blockReasonId: number; allLocales?: boolean }) {
    this.blockReasonId = data.blockReasonId;
    this.allLocales = data.allLocales ?? false;
  }

  toMap(): Record<string, unknown> {
    return {
      block_reason_id: this.blockReasonId,
    };
  }

  validate() {
    return ShowBlockReasonsParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowBlockReasonsParams.validation.validateOrThrow(this);
  }
}
