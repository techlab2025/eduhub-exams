import { expect, it } from 'vitest';
import PlanFeatureModel from '../plan.feature.model';

it('maps a plan feature and its sub-features', () => {
  expect(
    PlanFeatureModel.fromJson({
      feature_id: 1,
      feature_title: 'Reports',
      sub_features: [{ id: 5, status: true, limit: 4 }],
    }),
  ).toMatchObject({
    featureId: 1,
    featureTitle: 'Reports',
    subFeatures: [{ id: 5, status: true, limit: 4 }],
  });
});
