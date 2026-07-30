import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UpdatedCustomInputSelect from '../UpdatedCustomInputSelect.vue';

// Stubs
const MultiSelectStub = {
  name: 'MultiSelect',
  template: '<div class="multiselect-stub" />',
  props: ['modelValue', 'options', 'placeholder', 'loading', 'emptyMessage'],
  emits: ['update:modelValue'],
};
const SelectStub = {
  name: 'Select',
  template:
    '<div class="select-stub"><slot name="value" :value="modelValue" :placeholder="placeholder" /></div>',
  props: ['modelValue', 'options', 'placeholder', 'loading', 'emptyMessage'],
  emits: ['update:modelValue'],
};
const IconBackStageStub = {
  name: 'IconBackStage',
  template: '<span class="icon-backstage-stub" />',
};
const DialogStub = {
  name: 'Dialog',
  template: '<div v-if="visible" class="dialog-stub"><slot /></div>',
  props: ['visible'],
  emits: ['update:visible', 'hide'],
};

vi.mock('@/base/Presentation/Utils/validationService', () => ({
  default: { clearError: vi.fn() },
}));

const makeTitleInterface = (id: number, title: string) => ({ id, title });

const createWrapper = (props: Record<string, any> = {}, slots: Record<string, string> = {}) =>
  mount(UpdatedCustomInputSelect, {
    props: {
      modelValue: null,
      placeholder: 'Select...',
      ...props,
    },
    slots,
    global: {
      stubs: {
        MultiSelect: MultiSelectStub,
        Select: SelectStub,
        IconBackStage: IconBackStageStub,
        Dialog: DialogStub,
      },
      mocks: { $t: (key: string) => key },
    },
  });

describe('UpdatedCustomInputSelect', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders Select component in single mode (type=1)', () => {
    const wrapper = createWrapper({ type: 1 });
    expect(wrapper.findComponent(SelectStub).exists()).toBe(true);
    expect(wrapper.findComponent(MultiSelectStub).exists()).toBe(false);
  });

  it('renders MultiSelect component in multiselect mode (type=2)', () => {
    const wrapper = createWrapper({ type: 2 });
    expect(wrapper.findComponent(MultiSelectStub).exists()).toBe(true);
    expect(wrapper.findComponent(SelectStub).exists()).toBe(false);
  });

  it('renders label when label prop is provided', () => {
    const wrapper = createWrapper({ label: 'My Label' });
    expect(wrapper.find('label.input-label').text()).toContain('My Label');
  });

  it('shows required asterisk when required is true', () => {
    const wrapper = createWrapper({ required: true, label: 'Name' });
    expect(wrapper.find('.text-red-500').exists()).toBe(true);
    expect(wrapper.find('.text-red-500').text()).toBe('*');
  });

  it('does not show required asterisk when required is false', () => {
    const wrapper = createWrapper({ required: false });
    expect(wrapper.find('.text-red-500').exists()).toBe(false);
  });

  it('shows optional text when optional is true', () => {
    const wrapper = createWrapper({ optional: true });
    expect(wrapper.find('.optional-text').exists()).toBe(true);
  });

  it('does not show optional text when optional is false', () => {
    const wrapper = createWrapper({ optional: false });
    expect(wrapper.find('.optional-text').exists()).toBe(false);
  });

  it('shows add button when onclick prop is provided', () => {
    const wrapper = createWrapper({ onclick: vi.fn() });
    expect(wrapper.find('.add-dialog').exists()).toBe(true);
  });

  it('does not show add button when onclick is not provided', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.add-dialog').exists()).toBe(false);
  });

  it('renders reload icon by default (reload=true)', () => {
    const wrapper = createWrapper({ reload: true });
    expect(wrapper.find('.reload-icon').exists()).toBe(true);
  });

  it('hides reload icon when reload=false', () => {
    const wrapper = createWrapper({ reload: false });
    expect(wrapper.find('.reload-icon').exists()).toBe(false);
  });

  it('hides reload icon when legacy relaod=false is provided', () => {
    const wrapper = createWrapper({ relaod: false });
    expect(wrapper.find('.reload-icon').exists()).toBe(false);
  });

  it('renders dialog slot and emits dialog visibility updates', () => {
    const wrapper = createWrapper(
      { isDialog: true, dialogVisible: true },
      { Dialog: '<div class="dialog-content">Dialog content</div>' },
    );

    expect(wrapper.find('.dialog-content').text()).toBe('Dialog content');

    wrapper.findComponent(DialogStub).vm.$emit('update:visible', false);
    wrapper.findComponent(DialogStub).vm.$emit('hide');

    expect(wrapper.emitted('update:dialogVisible')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.[0]).toEqual([false]);
  });

  it('renders static options when staticOptions is provided', () => {
    const opts = [makeTitleInterface(1, 'Option A'), makeTitleInterface(2, 'Option B')];
    const wrapper = createWrapper({ staticOptions: opts });
    const select = wrapper.findComponent(SelectStub);
    expect(select.props('options')).toEqual(opts);
  });

  it('truncates a long selected label without changing the selected value', () => {
    const selected = makeTitleInterface(1, 'A'.repeat(100));
    const wrapper = createWrapper({ modelValue: selected });

    expect(wrapper.find('.selected-value').text()).toBe(`${'A'.repeat(47)}...`);
    expect(wrapper.findComponent(SelectStub).props('modelValue')).toEqual(selected);
  });

  it('renders the placeholder when no value is selected', () => {
    const wrapper = createWrapper({ modelValue: null, placeholder: 'Choose an option' });

    expect(wrapper.find('.selected-value').text()).toBe('Choose an option');
    expect(wrapper.find('.selected-value').classes()).toContain('selected-value--placeholder');
  });

  it('renders the placeholder when the selected value has an undefined title', () => {
    const wrapper = createWrapper({
      modelValue: { id: 1, title: undefined },
      placeholder: 'Choose an option',
    });

    expect(wrapper.find('.selected-value').text()).toBe('Choose an option');
  });

  it('renders hidden input with correct id', () => {
    const wrapper = createWrapper({ id: 'my-select' });
    const hidden = wrapper.find('input.hidden');
    expect(hidden.attributes('id')).toBe('my-select');
  });
});
