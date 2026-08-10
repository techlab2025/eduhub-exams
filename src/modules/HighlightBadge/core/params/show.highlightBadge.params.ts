import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowHighLightsBadgesParams implements Params {
  public highlightBadgeId: number;
  public allLocales: boolean;

  public static readonly validation = new ClassValidation().setRules({
    highlightBadgeId: { required: true },
  });

  constructor(data: { highlightBadgeId: number; allLocales?: boolean }) {
    this.highlightBadgeId = data.highlightBadgeId;
    this.allLocales = data.allLocales ?? false;
  }

  toMap(): Record<string, unknown> {
    return {
      highlight_badge_id: this.highlightBadgeId,
    };
  }

  validate() {
    return ShowHighLightsBadgesParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowHighLightsBadgesParams.validation.validateOrThrow(this);
  }
}
