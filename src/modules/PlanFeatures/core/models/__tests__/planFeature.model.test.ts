import { describe, expect, it } from 'vitest';
import PlanFeatureModel, { PlanFeatureTypeEnum } from '../planFeature.model';
describe('PlanFeatureModel', () => {
  it('maps feature responses', () => {
    expect(
      PlanFeatureModel.fromJson({
        plan_feature_id: 2,
        title: 'Limits',
        description: 'Exam limits',
        plan_feature_type: '2',
        parent_id: 1,
      }),
    ).toMatchObject({ id: 2, type: PlanFeatureTypeEnum.NUMBER, parentId: 1 });
  });
});
