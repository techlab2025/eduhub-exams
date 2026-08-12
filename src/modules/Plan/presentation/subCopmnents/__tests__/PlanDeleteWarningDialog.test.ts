import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PlanDeleteWarningDialog from '../PlanDeleteWarningDialog.vue';

describe('PlanDeleteWarningDialog', () => {
  it('shows a close-only warning and closes it', async () => {
    const wrapper = mount(PlanDeleteWarningDialog, {
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

    expect(wrapper.get('h3').text()).toBe('plan_delete_blocked_title');
    expect(wrapper.findAll('button')).toHaveLength(1);

    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });
});
