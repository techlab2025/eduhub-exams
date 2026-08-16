import { describe, expect, it } from 'vitest';
import PlanFeatureParams from '../plan.features.params';

describe('PlanFeatureParams', () => {
  it('maps a feature group', () => {
    expect(new PlanFeatureParams({ featureType: '2', featureSubType: [] }).toMap()).toEqual({
      feature_type: '2',
      feature_sub_type: [],
    });
  });
});
