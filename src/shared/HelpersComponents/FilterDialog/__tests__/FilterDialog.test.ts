import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterDialog from '../FilterDialog.vue';

const globalConfig = {
  stubs: {
    Dialog: {
      template: '<div v-if="visible"><slot name="header"></slot><slot></slot></div>',
      props: ['visible'],
    },
    DialogIconFillter: true,
  },
};

describe('FilterDialog.vue', () => {
  it('renders the filter button', () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: false,
      },
      global: globalConfig,
    });
    expect(wrapper.find('.fillter-button').exists()).toBe(true);
    expect(wrapper.text()).toContain('filter');
  });

  it('emits update:modelValue when button is clicked', async () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: false,
      },
      global: globalConfig,
    });
    await wrapper.find('.fillter-button').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
  });

  it('renders slot content when visible', () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: true,
      },
      slots: {
        content: '<div class="test-content">Slot Content</div>',
      },
      global: globalConfig,
    });

    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('Slot Content');
  });

  it('renders header correctly', () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: true,
      },
      global: globalConfig,
    });

    expect(wrapper.find('.filter-title').exists()).toBe(true);
    expect(wrapper.find('.filter-title').text()).toBe('filter option');
  });
});
