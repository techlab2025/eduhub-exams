import { describe, expect, it } from 'vitest';
import { PlanFeatureEndpoints } from '../planFeature.api.endpoints';
describe('PlanFeatureEndpoints', () => {
  it('registers every CRUD endpoint', () => {
    const value = new PlanFeatureEndpoints();
    expect(value.index).toContain('fetch_plan_feature');
    expect(value.store).toContain('store_plan_feature');
    expect(value.show).toContain('show_plan_feature');
    expect(value.update).toContain('edit_plan_feature');
    expect(value.delete).toContain('delete_plan_feature');
  });
});
