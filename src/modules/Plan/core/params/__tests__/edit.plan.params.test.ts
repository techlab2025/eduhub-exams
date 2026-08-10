import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import EditPlanParams from '../edit.plan.params';

describe('EditPlanParams', () => {
  it('adds the plan id to the update request', () => {
    const params = new EditPlanParams({
      id: 9,
      translations: new TranslationParams({ title: { en: 'Updated' } }),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [],
      pricing: [],
      hasTrail: false,
      trialDays: 0,
      features: [],
    });

    expect(params.toMap()).toMatchObject({ plan_id: 9, status: 1 });
  });
});
