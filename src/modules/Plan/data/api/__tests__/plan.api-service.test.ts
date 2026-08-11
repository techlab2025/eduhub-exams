import { expect, it, vi } from 'vitest';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';
import TogglePlanStatusParams from '../../../core/params/toggle.plan.status.params';
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

  expect(customPost).toHaveBeenCalledWith(expect.stringContaining('toggle_plan_status'), params);
});
