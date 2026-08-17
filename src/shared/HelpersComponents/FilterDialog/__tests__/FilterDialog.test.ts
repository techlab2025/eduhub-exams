import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterDialog from '../FilterDialog.vue';

const globalConfig = {
  stubs: {
    Dialog: {
      name: 'Dialog',
      template:
        '<div v-if="visible"><slot name="header"></slot><slot></slot><slot name="footer"></slot></div>',
      props: ['visible', 'pt'],
    },
    DialogIconFillter: true,
  },
  mocks: {
    $t: (msg: string) => msg,
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
    expect(wrapper.text()).toContain('Filter');
  });

  it('emits update:modelValue when button is clicked', async () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: false,
      },
      global: globalConfig,
    });
    await wrapper.find('.fillter-button').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
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

  it('renders footer content outside the scrollable content slot', () => {
    const wrapper = mount(FilterDialog, {
      props: { modelValue: true },
      slots: {
        content: '<div class="test-content">Content</div>',
        footer: '<button class="test-footer">Apply</button>',
      },
      global: globalConfig,
    });

    expect(wrapper.find('.filter-content .test-content').exists()).toBe(true);
    expect(wrapper.find('.filter-content .test-footer').exists()).toBe(false);
    expect(wrapper.find('.test-footer').text()).toBe('Apply');
  });

  it('renders header correctly', () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: true,
      },
      global: globalConfig,
    });

    expect(wrapper.find('.filter-title').exists()).toBe(true);
    expect(wrapper.find('.filter-title').text()).toBe('filter_option');
  });

  it('passes custom sizing and class options to the dialog', () => {
    const wrapper = mount(FilterDialog, {
      props: {
        modelValue: true,
        dialogClass: 'plan-filter-dialog',
        width: '28.125rem',
      },
      global: globalConfig,
    });

    const dialog = wrapper.getComponent({ name: 'Dialog' });
    expect(dialog.attributes('style')).toContain('width: 28.125rem');
    expect(dialog.props('pt').root).toEqual(['filter-dialog', 'plan-filter-dialog']);
  });
});
