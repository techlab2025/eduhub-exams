import { describe, expect, it } from 'vitest';
import { PlanEndpoints } from '../plan.api.endpoints';
describe('PlanEndpoints', () => {
  it('registers every plan endpoint', () => {
    const value = new PlanEndpoints();
    expect(value.index).toContain('fetch_plans');
    expect(value.store).toContain('store_plan');
    expect(value.show).toContain('show_plan');
    expect(value.update).toContain('update_plan');
    expect(value.toggleStatus).toContain('change_plan_status');
    expect(value.delete).toContain('delete_plan');
    expect(value.features).toContain('fetch_plan_features');
  });
});
