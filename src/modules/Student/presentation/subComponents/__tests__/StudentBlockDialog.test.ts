import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Component from '../StudentBlockDialog.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const SelectStub = {
  props: ['modelValue', 'options'],
  emits: ['update:modelValue', 'change'],
  template: `
    <button
      class="select-reason"
      @click="$emit('update:modelValue', options[0]); $emit('change')"
    >
      select reason
    </button>
  `,
};

describe('StudentBlockDialog', () => {
  it('renders the block form and emits the selected reason with its details', async () => {
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
          Select: SelectStub,
        },
      },
    });

    expect(wrapper.find('.student-block-image img').attributes('src')).toContain('BlockImage.gif');
    expect(wrapper.text()).toContain('block_student_dialog_title');

    await wrapper.find('.select-reason').trigger('click');
    await wrapper.find('#student-block-explanation').setValue('Repeated misuse');
    await wrapper.find('.block-button').trigger('click');

    expect(confirm).toHaveBeenCalledOnce();
    expect(confirm).toHaveBeenCalledWith('block_reason_policy_violation: Repeated misuse');
  });

  it('requires a block reason before confirming', async () => {
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
          Select: SelectStub,
        },
      },
    });

    await wrapper.find('.block-button').trigger('click');

    expect(confirm).not.toHaveBeenCalled();
    expect(wrapper.find('[role="alert"]').text()).toBe('block_reason_required');
  });
});
