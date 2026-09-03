import { defineComponent } from 'vue';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import en from '@/locales/en.json';
import AddNotificationPlanParams from '../../../core/params/add.notification.plan.params';
import NotificationPlanDialog from '../NotificationPlanDialog.vue';
import NotificationPlanAdd from '../NotificationPlanAdd.vue';

const { createMock, pushMock, toastWarningMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  pushMock: vi.fn(),
  toastWarningMock: vi.fn(),
}));

vi.mock('vue-router', async () => ({
  ...(await vi.importActual('vue-router')),
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('../../controllers/notification.plan.controller', () => ({
  default: { getInstance: () => ({ create: createMock }) },
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: { toastWarning: toastWarningMock },
}));

const params = new AddNotificationPlanParams(
  'Question alerts',
  [2],
  [{ action_ids: [1], message: 'A question changed.' }],
);

const NotificationPlanFormStub = defineComponent({
  emits: ['updateData'],
  setup(_, { emit, expose }) {
    expose({ validate: () => true });
    return { sendData: () => emit('updateData', params) };
  },
  template: '<button class="send-data" type="button" @click="sendData">Send data</button>',
});

const mountAdd = () =>
  shallowMount(NotificationPlanAdd, {
    global: {
      plugins: [createI18n({ legacy: false, locale: 'en', messages: { en } })],
      stubs: { NotificationPlanForm: NotificationPlanFormStub },
    },
  });

describe('NotificationPlanAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMock.mockResolvedValue({ hasError: false, error: null });
  });

  it('shows the Figma success dialog before returning to the list', async () => {
    const wrapper = mountAdd();
    await wrapper.get('.send-data').trigger('click');
    await wrapper.get('.notification-plan-editor__actions .btn-primary').trigger('click');
    await flushPromises();

    const successDialog = wrapper.findAllComponents(NotificationPlanDialog)[0];
    expect(createMock).toHaveBeenCalledWith(params);
    expect(successDialog?.props()).toMatchObject({ modelValue: true, variant: 'success' });
    expect(pushMock).not.toHaveBeenCalled();

    successDialog?.vm.$emit('confirm');
    await flushPromises();
    expect(pushMock).toHaveBeenCalledWith({ name: 'Notification Plans' });
  });

  it('shows the duplicate dialog for a conflict response', async () => {
    createMock.mockResolvedValue({
      hasError: true,
      error: {
        displayMessage: 'Notification plan already exists',
        type: ErrorType.conflict,
      },
    });
    const wrapper = mountAdd();
    await wrapper.get('.send-data').trigger('click');
    await wrapper.get('.notification-plan-editor__actions .btn-primary').trigger('click');
    await flushPromises();

    expect(wrapper.findAllComponents(NotificationPlanDialog)[1]?.props()).toMatchObject({
      modelValue: true,
      variant: 'duplicate',
    });
  });
});
