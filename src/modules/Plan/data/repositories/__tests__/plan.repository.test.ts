import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { expect, it, vi } from 'vitest';
import IndexPlanFeaturesParams from '../../../core/params/index.plan.features.params';
import PlanApiService from '../../api/plan.api-service';
import Repository from '../plan.repository';
it('uses a singleton repository', () =>
  expect(Repository.getInstance()).toBe(Repository.getInstance()));

it('maps the plan feature catalog response', async () => {
  vi.spyOn(PlanApiService.getInstance(), 'fetchFeatures').mockResolvedValue({
    statusCode: 200,
    data: {
      status: true,
      data: [
        {
          id: 1,
          title: 'Report',
          code: 1,
          sub_features: [{ id: 6, title: 'Maximum Reports', code: '1.5' }],
        },
      ],
    },
  });

  const result = await Repository.getInstance().fetchFeatures(new IndexPlanFeaturesParams());

  expect(result).toBeInstanceOf(DataSuccess);
  expect(result.data?.[0]).toMatchObject({ id: 1, title: 'Report' });
  expect(result.data?.[0]?.subFeatures[0]).toMatchObject({ id: 6, hasLimit: true });
});
