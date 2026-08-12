import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Component from '../StudentArchiveDialog.vue';

describe('StudentArchiveDialog', () => {
  it('renders the archive confirmation and emits confirm', async () => {
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
      'ArchiveIcon.gif',
    );
    expect(wrapper.text()).toContain('archive_student_dialog_title');

    await wrapper.find('.archive-button').trigger('click');

    expect(confirm).toHaveBeenCalledOnce();
  });
});
