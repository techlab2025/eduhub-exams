import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Component from '../SubscriptionBulkDeleteWarningDialog.vue';

describe('SubscriptionBulkDeleteWarningDialog', () => {
  it('shows the bulk deletion warning and closes it', async () => {
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

    expect(wrapper.find('h3').text()).toBe('subscription_bulk_delete_blocked_message');

    await wrapper.find('button').trigger('click');

    expect(wrapper.props('modelValue')).toBe(false);
  });
});
