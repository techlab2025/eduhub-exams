import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import UnsavedPlanChangesDialog from '../UnsavedPlanChangesDialog.vue';

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot name="container" /></div>',
    },
  },
};

describe('UnsavedPlanChangesDialog', () => {
  it('renders the unsaved plan warning', () => {
    const wrapper = mount(UnsavedPlanChangesDialog, {
      props: { modelValue: true },
      global,
    });

    expect(wrapper.get('h2').text()).toBe('unsaved_plan_dialog.title');
    expect(wrapper.get('p').text()).toBe('unsaved_plan_dialog.description');
    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it('closes and emits cancel when Cancel is clicked', async () => {
    const wrapper = mount(UnsavedPlanChangesDialog, {
      props: { modelValue: true },
      global,
    });

    await wrapper.get('.btn-cancel').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });

  it('closes and emits confirm when OK is clicked', async () => {
    const wrapper = mount(UnsavedPlanChangesDialog, {
      props: { modelValue: true },
      global,
    });

    await wrapper.get('.btn-primary').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    expect(wrapper.emitted('confirm')).toHaveLength(1);
  });
});
