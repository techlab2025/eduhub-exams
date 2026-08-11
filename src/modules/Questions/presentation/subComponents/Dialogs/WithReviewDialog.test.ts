import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import WithReviewDialog from './WithReviewDialog.vue';

const globalConfig = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Dialog: {
      props: ['visible', 'pt'],
      template: '<div v-if="visible" class="dialog-stub"><slot /></div>',
    },
  },
};

describe('WithReviewDialog', () => {
  it('renders both review choices after opening', async () => {
    const wrapper = mount(WithReviewDialog, {
      props: { saveStatus: 1 },
      global: globalConfig,
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.find('.dialog-illustration').exists()).toBe(true);
    expect(wrapper.findAll('.btns .btn')).toHaveLength(2);
  });

  it.each([
    { selector: '.without-review-btn', event: 'without-review' },
    { selector: '.btns .btn-secondary', event: 'with-review' },
  ])('closes before emitting $event', async ({ selector, event }) => {
    const wrapper = mount(WithReviewDialog, {
      props: { saveStatus: 1 },
      global: globalConfig,
    });

    await wrapper.get('button').trigger('click');
    expect(wrapper.find('.dialog-stub').exists()).toBe(true);

    await wrapper.get(selector).trigger('click');

    expect(wrapper.emitted(event)).toHaveLength(1);
    expect(wrapper.find('.dialog-stub').exists()).toBe(false);
  });
});
