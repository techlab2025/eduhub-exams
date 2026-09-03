import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import NotificationPlanDialog from '../NotificationPlanDialog.vue';

const mountDialog = (variant: 'delete' | 'activate' | 'deactivate' | 'success' | 'duplicate') =>
  mount(NotificationPlanDialog, {
    props: { modelValue: true, variant },
    global: {
      plugins: [createI18n({ legacy: false, locale: 'en', messages: { en } })],
      stubs: {
        Dialog: {
          props: ['visible'],
          template: '<div v-if="visible"><slot name="container" /></div>',
        },
      },
    },
  });

describe('NotificationPlanDialog', () => {
  it('renders the destructive warning and confirms deletion', async () => {
    const wrapper = mountDialog('delete');

    expect(wrapper.text()).toContain('Are You Sure You Want To Delete This Notification Plan?');
    expect(wrapper.text()).toContain('This action cannot be undone.');
    await wrapper.get('.notification-plan-dialog__confirm').trigger('click');

    expect(wrapper.emitted('confirm')).toHaveLength(1);
  });

  it('renders the activate confirmation copy', () => {
    expect(mountDialog('activate').text()).toContain('Activate notification plan?');
  });

  it('uses a single acknowledgement action for success', () => {
    const wrapper = mountDialog('success');

    expect(wrapper.text()).toContain('Notification Plan added successfully');
    expect(wrapper.find('.notification-plan-dialog__cancel').exists()).toBe(false);
  });

  it('renders the duplicate-plan recovery action', () => {
    const wrapper = mountDialog('duplicate');

    expect(wrapper.text()).toContain('Notification plan already exists');
    expect(wrapper.get('.notification-plan-dialog__confirm').text()).toBe('View');
  });
});
