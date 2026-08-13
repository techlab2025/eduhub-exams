import { describe, expect, it } from 'vitest';
import PlanFeatureCatalogModel from '../plan.feature.catalog.model';

describe('PlanFeatureCatalogModel', () => {
  it('maps feature and sub-feature API data', () => {
    const model = PlanFeatureCatalogModel.fromJson({
      id: 1,
      title: 'Report',
      code: 1,
      sub_features: [
        { id: 2, title: 'Show Overall Score', code: '1.1' },
        { id: 6, title: 'Maximum Reports Per Student', code: '1.5' },
      ],
    });

    expect(model).toMatchObject({ id: 1, title: 'Report', code: 1 });
    expect(model.subFeatures).toEqual([
      expect.objectContaining({ id: 2, code: '1.1', hasLimit: false }),
      expect.objectContaining({ id: 6, code: '1.5', hasLimit: true }),
    ]);
  });
});
