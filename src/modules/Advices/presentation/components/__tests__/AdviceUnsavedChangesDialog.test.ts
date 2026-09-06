import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AdviceUnsavedChangesDialog from '../AdviceUnsavedChangesDialog.vue';

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot name="container" /></div>',
    },
  },
};

describe('AdviceUnsavedChangesDialog', () => {
  it('renders the Figma copy and accessible dialog semantics', () => {
    const wrapper = mount(AdviceUnsavedChangesDialog, {
      props: { modelValue: true },
      global,
    });

    const dialog = wrapper.get('[role="alertdialog"]');
    expect(dialog.attributes('aria-labelledby')).toBe('advice-unsaved-dialog-title');
    expect(dialog.attributes('aria-describedby')).toBe('advice-unsaved-dialog-description');
    expect(wrapper.get('h2').text()).toBe('advice_unsaved_dialog.title');
    expect(wrapper.get('p').text()).toBe('advice_unsaved_dialog.description');
    expect(wrapper.findAll('button')).toHaveLength(2);
  });

  it('closes and continues editing without discarding data', async () => {
    const wrapper = mount(AdviceUnsavedChangesDialog, {
      props: { modelValue: true },
      global,
    });

    await wrapper.get('[data-testid="continue-editing"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    expect(wrapper.emitted('continue')).toHaveLength(1);
    expect(wrapper.emitted('discard')).toBeUndefined();
  });

  it('closes and confirms discarding the changes', async () => {
    const wrapper = mount(AdviceUnsavedChangesDialog, {
      props: { modelValue: true },
      global,
    });

    await wrapper.get('[data-testid="discard-changes"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    expect(wrapper.emitted('discard')).toHaveLength(1);
    expect(wrapper.emitted('continue')).toBeUndefined();
  });
});
