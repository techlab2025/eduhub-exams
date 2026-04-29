import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AddBranchDialog from '../AddBranchDialog.vue';

describe('AddBranchDialog', () => {
  const defaultProps = {
    visible: true,
    level: 1,
    branchId: 123,
  };

  it('renders when visible', async () => {
    const wrapper = mount(AddBranchDialog, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template:
              '<div v-if="visible" class="dialog-stub"><slot name="header" /><slot /></div>',
            props: ['visible'],
          },
        },
      },
    });
    expect(wrapper.find('.dialog-stub').exists()).toBe(true);
    expect(wrapper.text()).toContain('Add A New Branch');
  });

  it('emits update:visible false when Cancel button is clicked', async () => {
    const wrapper = mount(AddBranchDialog, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: '<div v-if="visible"><slot /></div>',
            props: ['visible'],
          },
        },
      },
    });

    await wrapper.find('button.btn-secondary').trigger('click');
    expect(wrapper.emitted('update:visible')).toBeTruthy();
    expect(wrapper.emitted('update:visible')![0]).toEqual([false]);
  });

  it('emits confirm with input value when Add button is clicked', async () => {
    const wrapper = mount(AddBranchDialog, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: '<div v-if="visible"><slot /></div>',
            props: ['visible'],
          },
        },
      },
    });

    const input = wrapper.find('input');
    await input.setValue('New Branch Name');
    await wrapper.find('button.btn-primary').trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')![0]?.[0]).toEqual({
      name: 'New Branch Name',
      level: 1,
      branchId: 123,
    });
  });

  it('disables Add button when input is empty', async () => {
    const wrapper = mount(AddBranchDialog, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: '<div v-if="visible"><slot /></div>',
            props: ['visible'],
          },
        },
      },
    });

    const addButton = wrapper.find('button.btn-primary');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(true);

    await wrapper.find('input').setValue('   ');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(true);

    await wrapper.find('input').setValue('Valid Name');
    expect((addButton.element as HTMLButtonElement).disabled).toBe(false);
  });
});
