import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Component from '../SubscriptionDeleteWarningDialog.vue';

describe('SubscriptionDeleteWarningDialog', () => {
  it('shows the blocking warning and closes from the only action', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: true,
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
      },
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          Dialog: {
            props: ['visible'],
            template: '<div v-if="visible"><slot name="container" /></div>',
          },
        },
      },
    });

    expect(wrapper.find('.subscription-delete-warning-dialog').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('subscription_delete_blocked_title');

    await wrapper.find('button').trigger('click');

    expect(wrapper.props('modelValue')).toBe(false);
  });
});
