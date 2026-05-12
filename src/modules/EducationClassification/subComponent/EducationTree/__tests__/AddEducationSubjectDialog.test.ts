import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AddEducationSubjectDialog from '../AddEducationSubjectDialog.vue';

const dialogStub = {
  name: 'Dialog',
  template: '<div v-if="visible"><slot name="header" /><slot /><slot name="footer" /></div>',
  props: ['visible', 'modal'],
};

const defaultProps = {
  visible: true,
};

describe('AddEducationSubjectDialog', () => {
  const mountComponent = (props = defaultProps) =>
    mount(AddEducationSubjectDialog, {
      props,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true, NewBranchIcon: true },
      },
    });

  it('renders when visible is true', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('does not render when visible is false', () => {
    const wrapper = mountComponent({ visible: false });
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('starts with Add button disabled', () => {
    const wrapper = mountComponent();
    const addBtn = wrapper.find('button.btn-primary');
    expect((addBtn.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('emits update:visible false when Cancel button is clicked', async () => {
    const wrapper = mountComponent();
    const cancelBtn = wrapper.find('button.btn-secondary');
    expect(cancelBtn.exists()).toBe(true);
    await cancelBtn.trigger('click');
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('enables Add button when input has text', async () => {
    const wrapper = mountComponent();
    // @ts-expect-error accessing internal state
    wrapper.vm.inputValue = { en: 'Mathematics' };
    await wrapper.vm.$nextTick();
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(false);
  });

  it('emits confirm with name when Add is clicked', async () => {
    const wrapper = mountComponent();
    // @ts-expect-error accessing internal state
    wrapper.vm.inputValue = { en: 'Mathematics' };
    await wrapper.vm.$nextTick();
    const addBtn = wrapper.find('button.btn-primary');
    await addBtn.trigger('click');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ en: 'Mathematics' }]);
  });

  it('resets input when dialog is opened again', async () => {
    const wrapper = mountComponent({ visible: false });
    // @ts-expect-error accessing internal state
    wrapper.vm.inputValue = { en: 'Mathematics' };
    // Simulate dialog becoming visible (which triggers the watcher to reset)
    await wrapper.setProps({ visible: true });
    await wrapper.vm.$nextTick();
    // @ts-expect-error accessing internal state
    expect(wrapper.vm.inputValue).toEqual({});
  });
});
