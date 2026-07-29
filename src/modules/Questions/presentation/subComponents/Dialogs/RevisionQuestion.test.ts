import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import RevisionQuestion from './RevisionQuestion.vue';

const globalConfig = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible', 'pt', 'closable'],
      template: '<div class="dialog-stub"><slot /></div>',
    },
    EditIcon: true,
  },
};

describe('RevisionQuestion', () => {
  it('renders the reference layout sections', () => {
    const wrapper = mount(RevisionQuestion, { global: globalConfig });

    expect(wrapper.find('.dialog-heading').exists()).toBe(true);
    expect(wrapper.find('#revision-reason').exists()).toBe(true);
    expect(wrapper.find('.revision-warning').exists()).toBe(true);
    expect(wrapper.findAll('.btns .btn')).toHaveLength(2);
  });

  it('emits the revision note on confirmation', async () => {
    const wrapper = mount(RevisionQuestion, { global: globalConfig });

    await wrapper.find('#revision-reason').setValue('Update the correct answer');
    await wrapper.find('.confirm-btn').trigger('click');

    expect(wrapper.emitted('revision')).toEqual([['Update the correct answer']]);
  });
});
