import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import RejectQuestion from './RejectQuestion.vue';

const globalConfig = {
  mocks: {
    $t: (key: string) => key,
  },
  stubs: {
    Dialog: {
      props: ['visible', 'pt'],
      template: '<div class="dialog-stub"><slot /></div>',
    },
    RejectIcon: true,
  },
};

describe('RejectQuestion', () => {
  it('renders the responsive dialog content', () => {
    const wrapper = mount(RejectQuestion, { global: globalConfig });

    expect(wrapper.find('.reject-question-trigger').exists()).toBe(true);
    expect(wrapper.find('.dialog-content').exists()).toBe(true);
    expect(wrapper.find('#reason').exists()).toBe(true);
  });

  it('emits the rejection note', async () => {
    const wrapper = mount(RejectQuestion, { global: globalConfig });

    await wrapper.find('#reason').setValue('The answer needs correction');
    await wrapper.find('.confirm-btn').trigger('click');

    expect(wrapper.emitted('reject')).toEqual([['The answer needs correction']]);
  });
});
