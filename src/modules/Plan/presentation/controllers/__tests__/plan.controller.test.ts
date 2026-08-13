import { expect, it, vi } from 'vitest';
import IndexPlanFeaturesParams from '../../../core/params/index.plan.features.params';
import PlanRepository from '../../../data/repositories/plan.repository';
import Controller from '../plan.controller';
it('uses a singleton controller', () =>
  expect(Controller.getInstance()).toBe(Controller.getInstance()));

it('fetches features through the plan repository', async () => {
  const fetchFeatures = vi.spyOn(PlanRepository.getInstance(), 'fetchFeatures').mockResolvedValue({
    data: [],
  } as never);
  const params = new IndexPlanFeaturesParams();

  await Controller.getInstance().fetchFeatures(params);

  expect(fetchFeatures).toHaveBeenCalledWith(params);
});
