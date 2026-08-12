import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Component from '../StudentNoteDialog.vue';

const mountDialog = (props: { modelValue: boolean; studentId: number | null }) =>
  mount(Component, {
    props,
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

describe('StudentNoteDialog', () => {
  it('collects the private note options and emits a typed save payload', async () => {
    const wrapper = mountDialog({ modelValue: true, studentId: 12 });

    await wrapper.find('textarea').setValue('  Follow up next week  ');
    await wrapper.findAll('.student-note-language button')[1].trigger('click');
    await wrapper.find('.student-note-pin input').setValue(true);
    await wrapper.find('.save-note-button').trigger('click');

    expect(wrapper.emitted('save')).toEqual([
      [{ studentId: 12, note: 'Follow up next week', pinned: true, language: 'ar' }],
    ]);
  });

  it('requires a note before saving', async () => {
    const wrapper = mountDialog({ modelValue: true, studentId: 12 });

    await wrapper.find('.save-note-button').trigger('click');

    expect(wrapper.emitted('save')).toBeUndefined();
    expect(wrapper.find('.student-note-error').text()).toBe('note_required');
  });

  it('closes and clears the dialog from the cancel action', async () => {
    const wrapper = mountDialog({ modelValue: true, studentId: 12 });
    await wrapper.find('textarea').setValue('Draft');

    await wrapper.find('.cancel-note-button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
