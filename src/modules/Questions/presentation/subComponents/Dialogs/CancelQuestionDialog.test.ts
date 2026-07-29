import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CancelQuestionDialog from './CancelQuestionDialog.vue';

const globalConfig = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible', 'pt'],
      template: '<div class="dialog-stub"><slot /></div>',
    },
  },
};

describe('CancelQuestionDialog', () => {
  it('renders the confirmation content', () => {
    const wrapper = mount(CancelQuestionDialog, { global: globalConfig });

    expect(wrapper.find('.dialog-illustration').exists()).toBe(true);
    expect(wrapper.find('.dialog-message').exists()).toBe(true);
    expect(wrapper.findAll('.btns .btn')).toHaveLength(2);
  });

  it('emits cancel when deletion is confirmed', async () => {
    const wrapper = mount(CancelQuestionDialog, { global: globalConfig });

    await wrapper.find('.confirm-btn').trigger('click');

    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
