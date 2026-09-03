import { defineComponent, nextTick } from 'vue';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import en from '@/locales/en.json';
import DropList from '@/shared/HelpersComponents/DropList.vue';
import { StatusNotificationPlanEnum } from '../../../core/enums/status.notification.plan.enum';
import NotificationPlanDetailsModel from '../../../core/models/notification.plan.details.model';
import NotificationPlanDialog from '../NotificationPlanDialog.vue';
import NotificationPlanDetails from '../NotificationPlanDetails.vue';

const { deleteMock, fetchOneMock, replaceMock, toggleStatusMock } = vi.hoisted(() => ({
  deleteMock: vi.fn(),
  fetchOneMock: vi.fn(),
  replaceMock: vi.fn(),
  toggleStatusMock: vi.fn(),
}));

const plan = NotificationPlanDetailsModel.fromJson({
  id: 7,
  plan_title: 'Question Review Notifications',
  employees: [
    { id: 2, name: 'Ahmed Hawam' },
    { id: 3, name: 'Sara Ali' },
  ],
  actions: [
    {
      action_ids: [1, 2, 4],
      message: 'Updated: Ahmed Hawam has add question Questions. Please review the latest change.',
    },
  ],
  status: StatusNotificationPlanEnum.inactive,
  created_by: 'Ahmed Hawam',
  created_at: '2026-08-20T10:30:00.000Z',
  updated_by: 'Sara Ali',
  updated_at: '2026-08-29T04:15:00.000Z',
});

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '7' } }),
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock('../../controllers/notification.plan.controller', () => ({
  default: {
    getInstance: () => ({
      itemData: { value: plan },
      itemState: { value: {} },
      fetchOne: fetchOneMock,
      toggleStatus: toggleStatusMock,
      delete: deleteMock,
    }),
  },
}));

const DataStatusBuilderStub = defineComponent({
  template: '<div><slot name="success" /></div>',
});

const mountDetails = () =>
  shallowMount(NotificationPlanDetails, {
    global: {
      plugins: [createI18n({ legacy: false, locale: 'en', messages: { en } })],
      stubs: { DataStatusBuilder: DataStatusBuilderStub },
    },
  });

describe('NotificationPlanDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchOneMock.mockResolvedValue({ hasError: false });
    toggleStatusMock.mockResolvedValue({ hasError: false });
    deleteMock.mockResolvedValue({ hasError: false });
  });

  it('loads and renders the documented notification plan details', async () => {
    const wrapper = mountDetails();
    await flushPromises();

    expect(fetchOneMock.mock.calls[0]?.[0]).toMatchObject({ notification_plan_id: 7 });
    expect(wrapper.text()).toContain('Question Review Notifications');
    expect(wrapper.text()).toContain('Ahmed Hawam');
    expect(wrapper.text()).toContain('Sara Ali');
    expect(wrapper.text()).toContain('Add Question');
    expect(wrapper.text()).toContain('Approve Question');
    expect(wrapper.text()).toContain('Edit Question');
    expect(wrapper.text()).toContain('Updated: Ahmed Hawam');
  });

  it('provides the Figma action menu and opens the activation dialog', async () => {
    const wrapper = mountDetails();
    const actions = wrapper.getComponent(DropList).props('actionList');

    expect(actions.map(({ text }: { text: string }) => text)).toEqual([
      'Edit',
      'Activate',
      'Delete',
    ]);
    expect(actions[0]).toMatchObject({ link: '/notification-plans/edit/7' });
    actions[1].action();
    await nextTick();

    const dialogs = wrapper.findAllComponents(NotificationPlanDialog);
    expect(dialogs[0]?.props()).toMatchObject({ modelValue: true, variant: 'activate' });
  });

  it('activates and reloads the notification plan', async () => {
    const wrapper = mountDetails();
    const actions = wrapper.getComponent(DropList).props('actionList');
    actions[1].action();
    await nextTick();

    const statusDialog = wrapper.findAllComponents(NotificationPlanDialog)[0];
    expect(statusDialog?.props('modelValue')).toBe(true);

    await statusDialog?.vm.$emit('confirm');
    await flushPromises();

    expect(toggleStatusMock.mock.calls[0]?.[0]).toMatchObject({
      notification_plan_id: 7,
      status: StatusNotificationPlanEnum.active,
    });
    expect(fetchOneMock).toHaveBeenCalledTimes(2);
    expect(statusDialog?.props('modelValue')).toBe(false);
  });

  it('deletes the plan and returns to the list', async () => {
    const wrapper = mountDetails();

    await wrapper.findAllComponents(NotificationPlanDialog)[1]?.vm.$emit('confirm');
    await flushPromises();

    expect(deleteMock.mock.calls[0]?.[0]).toMatchObject({ notification_plan_id: 7 });
    expect(replaceMock).toHaveBeenCalledWith({ name: 'Notification Plans' });
  });
});
