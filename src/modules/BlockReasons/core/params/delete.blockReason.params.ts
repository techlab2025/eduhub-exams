import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class DeleteBlockReasonsParams implements Params {
  public blockReasonId: number;

  public static readonly validation = new ClassValidation().setRules({
    blockReasonId: { required: true },
  });

  constructor(data: { blockReasonId: number }) {
    this.blockReasonId = data.blockReasonId;
  }

  toMap(): Record<string, unknown> {
    return {
      block_reason_id: this.blockReasonId,
    };
  }

  validate() {
    return DeleteBlockReasonsParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeleteBlockReasonsParams.validation.validateOrThrow(this);
  }
}
