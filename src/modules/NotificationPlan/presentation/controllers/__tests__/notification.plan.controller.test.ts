import { beforeEach, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import NotificationPlanDetailsModel from '../../../core/models/notification.plan.details.model';
import NotificationPlanModel from '../../../core/models/notification.plan.model';
import IndexNotificationPlanParams from '../../../core/params/index.notification.plan.params';
import ShowNotificationPlanParams from '../../../core/params/show.notification.plan.params';
import NotificationPlanController from '../notification.plan.controller';

const mocks = vi.hoisted(() => ({
  index: vi.fn(),
  show: vi.fn(),
}));

vi.mock('../../../data/repositories/notification.plan.repository', () => ({
  default: {
    getInstance: () => ({
      index: mocks.index,
      show: mocks.show,
    }),
  },
}));

beforeEach(() => {
  mocks.index.mockReset();
  mocks.show.mockReset();
  mocks.index.mockResolvedValue(new DataSuccess({ data: [NotificationPlanModel.example] }));
  mocks.show.mockResolvedValue(new DataSuccess({ data: NotificationPlanDetailsModel.example }));
});

it('uses a singleton notification plan controller', () => {
  expect(NotificationPlanController.getInstance()).toBe(NotificationPlanController.getInstance());
});

it('fetches list and details from the API instead of static example data', async () => {
  const controller = NotificationPlanController.getInstance();
  const indexParams = new IndexNotificationPlanParams({ page: 1, per_page: 10 });
  const showParams = new ShowNotificationPlanParams(9);

  await controller.fetchList(indexParams);
  await controller.fetchOne(showParams);

  expect(mocks.index).toHaveBeenCalledWith(
    indexParams,
    expect.objectContaining({ useStaticData: false }),
    false,
  );
  expect(mocks.show).toHaveBeenCalledWith(
    showParams,
    expect.objectContaining({ useStaticData: false }),
    false,
  );
});
