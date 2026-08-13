import { expect, it, vi } from 'vitest';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';
import TogglePlanStatusParams from '../../../core/params/toggle.plan.status.params';
import IndexPlanFeaturesParams from '../../../core/params/index.plan.features.params';
import Service from '../plan.api-service';
it('uses a singleton API service', () => expect(Service.getInstance()).toBe(Service.getInstance()));

it('posts status changes to the plan status endpoint', async () => {
  const service = Service.getInstance();
  const customService = service as unknown as {
    customPost: (url: string, params: TogglePlanStatusParams) => Promise<unknown>;
  };
  const customPost = vi.spyOn(customService, 'customPost').mockResolvedValue({});
  const params = new TogglePlanStatusParams({
    planId: 7,
    status: PlanStatusEnum.deactivated,
  });

  await service.toggleStatus(params);

  expect(customPost).toHaveBeenCalledWith(expect.stringContaining('change_plan_status'), params);
});

it('posts feature filters to the plan features endpoint', async () => {
  const service = Service.getInstance();
  const customService = service as unknown as {
    customPost: (url: string, params: IndexPlanFeaturesParams) => Promise<unknown>;
  };
  const customPost = vi.spyOn(customService, 'customPost').mockResolvedValue({});
  const params = new IndexPlanFeaturesParams();

  await service.fetchFeatures(params);

  expect(customPost).toHaveBeenCalledWith(expect.stringContaining('fetch_plan_features'), params);
});
