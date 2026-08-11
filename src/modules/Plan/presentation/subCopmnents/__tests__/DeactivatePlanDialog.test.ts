import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import DeactivatePlanDialog from '../DeactivatePlanDialog.vue';

describe('DeactivatePlanDialog', () => {
  it('has cancel and confirm buttons and emits confirmation', async () => {
    const wrapper = mount(DeactivatePlanDialog, {
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

    expect(wrapper.findAll('.dialog-actions button')).toHaveLength(2);
    await wrapper.get('.btn-primary').trigger('click');
    expect(wrapper.emitted('confirm')).toHaveLength(1);

    await wrapper.get('.btn-cancel').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });
});
