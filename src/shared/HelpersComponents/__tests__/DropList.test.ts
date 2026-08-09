import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import DropList from '../DropList.vue';

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
      h(
        'div',
        { class: ['popover-stub', { 'is-visible': visible.value }] },
        slots.default?.(),
      );
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
});
