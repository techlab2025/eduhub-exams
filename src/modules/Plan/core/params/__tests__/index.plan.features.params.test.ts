import { describe, expect, it } from 'vitest';
import IndexPlanFeaturesParams from '../index.plan.features.params';

describe('IndexPlanFeaturesParams', () => {
  it('maps feature index request parameters', () => {
    expect(new IndexPlanFeaturesParams('report', 2, 20, 1).toMap()).toEqual({
      word: 'report',
      with_pagination: 1,
      page: 2,
      per_page: 20,
    });
  });
});
