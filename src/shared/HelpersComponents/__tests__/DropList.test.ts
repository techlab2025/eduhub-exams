import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import DropList from '../DropList.vue';
import ActionsIcon from '../../icons/ActionsIcon.vue';

const PopoverStub = defineComponent({
  name: 'Popover',
  setup(_, { expose, slots }) {
    const visible = ref(false);

    expose({
      toggle: () => {
        visible.value = !visible.value;
      },
      hide: () => {
        visible.value = false;
      },
    });

    return () =>
      h('div', { class: ['popover-stub', { 'is-visible': visible.value }] }, slots.default?.());
  },
});

describe('DropList', () => {
  it('renders without errors', () => {
    const wrapper = mount(DropList, {
      props: { actionList: [] },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('closes the previously open popover when another instance is opened', async () => {
    const wrapper = mount(
      defineComponent({
        components: { DropList },
        template: `
          <DropList :action-list="[]" />
          <DropList :action-list="[]" />
        `,
      }),
      {
        global: {
          stubs: { Popover: PopoverStub },
        },
      },
    );
    const triggers = wrapper.findAll('.list-trigger');
    const popovers = wrapper.findAll('.popover-stub');

    await triggers[0].trigger('click');
    expect(popovers[0].classes()).toContain('is-visible');

    await triggers[1].trigger('click');
    expect(popovers[0].classes()).not.toContain('is-visible');
    expect(popovers[1].classes()).toContain('is-visible');
  });

  it('runs a blocked delete action without opening the delete confirmation', async () => {
    const action = vi.fn();
    const wrapper = mount(DropList, {
      props: {
        actionList: [
          {
            text: 'Delete',
            icon: ActionsIcon,
            action,
            skipDeleteConfirmation: true,
          },
        ],
      },
      global: {
        mocks: { $t: (key: string) => (key === 'delete' ? 'Delete' : key) },
        stubs: { Popover: PopoverStub },
      },
    });

    await wrapper.get('.list-item > button').trigger('click');

    expect(action).toHaveBeenCalledOnce();
    expect(wrapper.findComponent({ name: 'DeleteDialog' }).exists()).toBe(false);
  });

  it('renders the student menu variant with leading icons and danger styling', () => {
    const wrapper = mount(DropList, {
      props: {
        variant: 'student',
        actionList: [
          {
            text: 'Block',
            icon: ActionsIcon,
            action: vi.fn(),
            danger: true,
          },
        ],
      },
      global: {
        mocks: { $t: (key: string) => key },
        stubs: { Popover: PopoverStub },
      },
    });

    expect(wrapper.find('.student-list-body').exists()).toBe(true);
    expect(wrapper.find('.list-item').classes()).toContain('list-item-danger');
    expect(wrapper.find('.student-action-icon').exists()).toBe(true);
    expect(wrapper.find('.list-item button').text()).toContain('Block');
  });
});
