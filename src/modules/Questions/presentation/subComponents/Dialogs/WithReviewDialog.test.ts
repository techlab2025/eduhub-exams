import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import WithReviewDialog from './WithReviewDialog.vue';

const globalConfig = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible', 'pt'],
      template: '<div class="dialog-stub"><slot /></div>',
    },
  },
};

describe('WithReviewDialog', () => {
  it('renders both review choices', () => {
    const wrapper = mount(WithReviewDialog, {
      props: { saveStatus: 1 },
      global: globalConfig,
    });

    expect(wrapper.find('.dialog-illustration').exists()).toBe(true);
    expect(wrapper.findAll('.btns .btn')).toHaveLength(2);
  });

  it('emits both save actions', async () => {
    const wrapper = mount(WithReviewDialog, {
      props: { saveStatus: 1 },
      global: globalConfig,
    });

    await wrapper.find('.without-review-btn').trigger('click');
    await wrapper.find('.btns .btn-secondary').trigger('click');

    expect(wrapper.emitted('without-review')).toHaveLength(1);
    expect(wrapper.emitted('with-review')).toHaveLength(1);
  });
});
