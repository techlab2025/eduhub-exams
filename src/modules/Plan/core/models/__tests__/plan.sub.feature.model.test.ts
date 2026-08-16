import { expect, it } from 'vitest';
import PlanSubFeatureModel from '../plan.sub.feature.model';

it('maps a plan sub-feature by code', () => {
  expect(
    PlanSubFeatureModel.fromJson({ id: 5, sub_type: '1.4', status: true, limit: '4' }),
  ).toMatchObject({
    id: 5,
    code: '1.4',
    status: true,
    limit: 4,
  });
});
