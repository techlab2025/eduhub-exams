import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Component from '../StudentBlockDialog.vue';

const mocks = vi.hoisted(() => ({
  fetchAsOptions: vi.fn().mockResolvedValue([{ id: 12, title: 'Policy violation' }]),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('@/modules/BlockReasons/presentation/controllers/blockReason.controller', () => ({
  default: {
    getInstance: () => ({ fetchAsOptions: mocks.fetchAsOptions }),
  },
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
  beforeEach(() => vi.clearAllMocks());

  it('loads block reasons and emits the selected block_reason_id', async () => {
    const confirm = vi.fn();
    const wrapper = mount(Component, {
      props: {
        modelValue: true,
        hasActiveSubscription: true,
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

    await flushPromises();

    expect(wrapper.find('.student-block-image img').attributes('src')).toContain('BlockImage.gif');
    expect(wrapper.text()).toContain('block_student_dialog_title');
    expect(wrapper.find('.student-active-subscription-warning').text()).toBe(
      'student_active_subscription_warning',
    );
    expect(mocks.fetchAsOptions).toHaveBeenCalledOnce();
    expect(mocks.fetchAsOptions.mock.calls[0][0].toMap()).toMatchObject({
      with_page: 0,
      per_page: 100,
    });

    await wrapper.find('.select-reason').trigger('click');
    await wrapper.find('#student-block-explanation').setValue('Repeated misuse');
    await wrapper.find('.block-button').trigger('click');

    expect(confirm).toHaveBeenCalledOnce();
    expect(confirm).toHaveBeenCalledWith(12, 'Policy violation: Repeated misuse');
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

    await flushPromises();

    await wrapper.find('.block-button').trigger('click');

    expect(confirm).not.toHaveBeenCalled();
    expect(wrapper.find('[role="alert"]').text()).toBe('block_reason_required');
  });
});
