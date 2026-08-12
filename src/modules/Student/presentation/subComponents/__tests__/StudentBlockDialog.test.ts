import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Component from '../StudentBlockDialog.vue';

describe('StudentBlockDialog', () => {
  it('renders the block confirmation and emits confirm', async () => {
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

    expect(wrapper.find('.student-confirm-image img').attributes('src')).toContain(
      'BlockImage.gif',
    );
    expect(wrapper.text()).toContain('block_student_dialog_title');

    await wrapper.find('.block-button').trigger('click');

    expect(confirm).toHaveBeenCalledOnce();
  });
});
