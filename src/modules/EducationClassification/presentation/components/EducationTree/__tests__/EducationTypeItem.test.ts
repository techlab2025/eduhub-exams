import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EducationTypeItem from '../EducationTypeItem.vue';

describe('EducationTypeItem', () => {
  const mockNode = {
    id: '1',
    name: 'University',
    level: 0,
    children: [
      {
        id: '2',
        name: 'Faculty',
        level: 1,
        children: [],
      },
    ],
  };

  const defaultProps = {
    node: mockNode,
    maxLevels: 3,
  };

  it('renders node name', () => {
    const wrapper = mount(EducationTypeItem, {
      props: defaultProps,
      global: {
        stubs: {
          NodeIcon: true,
          EducationTypeItem: true,
        },
      },
    });

    expect(wrapper.text()).toContain('University');
  });

  it('toggles children visibility when toggle button is clicked', async () => {
    const wrapper = mount(EducationTypeItem, {
      props: defaultProps,
      global: {
        stubs: {
          NodeIcon: true,
          EducationTypeItem: true,
        },
      },
    });

    const toggleBtn = wrapper.find('.toggle-btn');
    expect(toggleBtn.exists()).toBe(true);

    // Initial state is open (based on node.children.length > 0 and isOpen ref)
    expect(wrapper.find('.children-wrapper').exists()).toBe(true);

    await toggleBtn.trigger('click');
    expect(wrapper.find('.children-wrapper').exists()).toBe(false);
  });

  it('emits select when node row is clicked', async () => {
    const wrapper = mount(EducationTypeItem, {
      props: defaultProps,
      global: {
        stubs: {
          NodeIcon: true,
          EducationTypeItem: true,
        },
      },
    });

    await wrapper.find('.node-row').trigger('click');
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([mockNode]);
  });

  it('emits add-branch when add button is clicked', async () => {
    const wrapper = mount(EducationTypeItem, {
      props: defaultProps,
      global: {
        stubs: {
          NodeIcon: true,
          EducationTypeItem: true,
        },
      },
    });

    const addBtn = wrapper.find('.icon-btn[title="Add child"]');
    await addBtn.trigger('click');

    expect(wrapper.emitted('add-branch')).toBeTruthy();
    expect(wrapper.emitted('add-branch')?.[0]).toEqual([{ node: mockNode, level: 1 }]);
  });

  it('hides add button when node is at max level', () => {
    const deepNode = {
      id: '3',
      name: 'Deep',
      level: 2,
      children: [],
    };

    const wrapper = mount(EducationTypeItem, {
      props: {
        node: deepNode,
        maxLevels: 3,
      },
      global: {
        stubs: {
          NodeIcon: true,
          EducationTypeItem: true,
        },
      },
    });

    expect(wrapper.find('.icon-btn[title="Add child"]').exists()).toBe(false);
  });
});
