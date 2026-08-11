import { expect, it } from 'vitest';
import PlanSubFeatureModel from '../plan.sub.feature.model';

it('maps a plan sub-feature', () => {
  expect(PlanSubFeatureModel.fromJson({ id: 5, status: true, limit: '4' })).toMatchObject({
    id: 5,
    status: true,
    limit: 4,
  });
});
