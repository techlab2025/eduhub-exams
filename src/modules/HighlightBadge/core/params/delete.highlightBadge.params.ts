import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class DeleteHighLightsBadgesParams implements Params {
  public highlightBadgeId: number;

  public static readonly validation = new ClassValidation().setRules({
    highlightBadgeId: { required: true },
  });

  constructor(data: { highlightBadgeId: number }) {
    this.highlightBadgeId = data.highlightBadgeId;
  }

  toMap(): Record<string, unknown> {
    return {
      highlight_badge_id: this.highlightBadgeId,
    };
  }

  validate() {
    return DeleteHighLightsBadgesParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeleteHighLightsBadgesParams.validation.validateOrThrow(this);
  }
}
