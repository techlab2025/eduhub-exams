import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AddEducationSubjectDialog from '../AddEducationSubjectDialog.vue';

const dialogStub = {
  name: 'Dialog',
  template: '<div v-if="visible"><slot /><slot name="footer" /></div>',
  props: ['visible', 'header', 'modal'],
};

const defaultProps = {
  visible: true,
  header: 'Add Subject',
  educationClassificationId: 1,
};

describe('AddEducationSubjectDialog', () => {
  it('renders when visible is true', () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('does not render when visible is false', () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: { ...defaultProps, visible: false },
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    expect(wrapper.find('.p-dialog').exists()).toBe(false);
  });

  it('emits update:visible false when Cancel button is clicked', async () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    const cancelBtn = wrapper.find('button.btn-cancel');
    await cancelBtn.trigger('click');
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('starts with Add button disabled', () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub },
      },
    });
    const addBtn = wrapper.find('button.btn-primary');
    expect((addBtn.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('keeps Add button disabled when input is only whitespace', async () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    // @ts-expect-error - accessing internal state
    wrapper.vm.inputValue = { en: '   ', ar: '   ' };
    await wrapper.vm.$nextTick();
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables Add button when input has text', async () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    // @ts-expect-error - accessing internal state
    wrapper.vm.inputValue = { en: 'Mathematics' };
    await wrapper.vm.$nextTick();
    expect((wrapper.find('button.btn-primary').element as HTMLButtonElement).disabled).toBe(false);
  });

  it('emits confirm with name when Add is clicked', async () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    // @ts-expect-error - accessing internal state
    wrapper.vm.inputValue = { en: 'Mathematics' };
    await wrapper.vm.$nextTick();
    const addBtn = wrapper.find('button.btn-primary');
    await addBtn.trigger('click');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ en: 'Mathematics' }]);
  });

  it('resets input when closed', async () => {
    const wrapper = mount(AddEducationSubjectDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        stubs: { Dialog: dialogStub, MultiLangInput: true },
      },
    });
    // @ts-expect-error - accessing internal state
    wrapper.vm.inputValue = { en: 'Mathematics' };
    await wrapper.setProps({ visible: false });
    // @ts-expect-error - accessing internal state
    expect(wrapper.vm.inputValue).toEqual({});
  });
});
