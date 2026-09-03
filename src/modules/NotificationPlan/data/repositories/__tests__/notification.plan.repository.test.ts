import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { StatusNotificationPlanEnum } from '../../../core/enums/status.notification.plan.enum';
import type NotificationPlanDetailsModel from '../../../core/models/notification.plan.details.model';
import type NotificationPlanModel from '../../../core/models/notification.plan.model';
import ToggleNotificationPlanStatusParams from '../../../core/params/toggle.notification.plan.status.params';
import NotificationPlanApiService from '../../api/notification.plan.api-service';
import NotificationPlanRepository from '../notification.plan.repository';

describe('NotificationPlanRepository', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses a singleton notification plan repository', () => {
    expect(NotificationPlanRepository.getInstance()).toBe(NotificationPlanRepository.getInstance());
  });

  it('parses the documented fetch and show response shapes', () => {
    const repository = NotificationPlanRepository.getInstance() as unknown as {
      parseList(data: unknown): NotificationPlanModel[];
      parseItem(data: unknown): NotificationPlanDetailsModel;
    };
    const list = repository.parseList([
      {
        id: 9,
        title: 'Question alerts',
        recipients_number: 2,
        actions_number: 4,
        status: StatusNotificationPlanEnum.active,
        created_by: 'Portal Admin',
        created_at: '2026-09-02T09:20:42.000000Z',
      },
    ]);
    const details = repository.parseItem({
      id: 9,
      plan_title: 'Question alerts',
      employees: [{ id: 2, name: 'Employee Two' }],
      actions: [{ action_ids: [1, 2], message: 'A question changed.' }],
      status: StatusNotificationPlanEnum.active,
      created_by: 'Portal Admin',
      created_at: '2026-09-02T09:20:42.000000Z',
      updated_by: 'Super Admin',
      updated_at: '2026-09-03T09:20:42.000000Z',
    });

    expect(list[0]).toMatchObject({
      id: 9,
      recipients_number: 2,
      actions_number: 4,
      status: StatusNotificationPlanEnum.active,
    });
    expect(details).toMatchObject({
      id: 9,
      plan_title: 'Question alerts',
      status: StatusNotificationPlanEnum.active,
    });
    expect(details.actions[0]?.action_ids).toEqual([1, 2]);
  });

  it('accepts a successful status response without a data payload', async () => {
    const apiService = NotificationPlanApiService.getInstance();
    vi.spyOn(apiService, 'toggleStatus').mockResolvedValue({
      statusCode: 200,
      data: { status: true, message: 'Notification plan status updated successfully.' },
    });

    const result = await NotificationPlanRepository.getInstance().toggleStatus(
      new ToggleNotificationPlanStatusParams(9, StatusNotificationPlanEnum.active),
    );

    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.hasError).toBe(false);
    expect(result.message).toBe('Notification plan status updated successfully.');
  });
});
