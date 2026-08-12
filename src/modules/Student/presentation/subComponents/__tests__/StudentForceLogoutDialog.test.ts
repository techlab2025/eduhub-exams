import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Component from '../StudentForceLogoutDialog.vue';

describe('StudentForceLogoutDialog', () => {
  it('renders the force logout confirmation and emits confirm', async () => {
    const confirm = vi.fn();
    const wrapper = mount(Component, {
      props: {
        modelValue: true,
        onConfirm: confirm,
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

    expect(wrapper.find('.student-force-logout-image img').attributes('src')).toContain(
      'BlockImage.gif',
    );
    expect(wrapper.text()).toContain('force_logout_dialog_title');

    await wrapper.find('.force-logout-button').trigger('click');

    expect(confirm).toHaveBeenCalledOnce();
  });

  it('closes without confirming from the cancel action', async () => {
    const wrapper = mount(Component, {
      props: { modelValue: true },
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

    await wrapper.find('.cancel-button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect(wrapper.emitted('confirm')).toBeUndefined();
  });
});
