import { describe, it, expect } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import UpdatedCustomInputSelect from '../UpdatedCustomInputSelect.vue';

// Stubs
const MultiSelectStub = {
  name: 'MultiSelect',
  template:
    '<div class="multiselect-stub"><slot v-for="item in modelValue" name="chip" :value="item" :remove-callback="() => undefined" /></div>',
  props: ['modelValue', 'options', 'placeholder', 'loading', 'emptyMessage', 'disabled'],
  emits: ['update:modelValue', 'filter'],
};
const SelectStub = {
  name: 'Select',
  template:
    '<div class="select-stub"><slot name="value" :value="modelValue" :placeholder="placeholder" /><slot v-for="option in options" name="option" :option="option" /></div>',
  props: ['modelValue', 'options', 'placeholder', 'loading', 'emptyMessage', 'disabled'],
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

  it('shortens long selected multiselect chips and keeps the full title as a tooltip', () => {
    const title = 'General Education -> Pre-KG -> Nursery -> Junior KG -> Senior KG';
    const wrapper = createWrapper({ type: 2, modelValue: [makeTitleInterface(1, title)] });

    expect(wrapper.get('.selected-chip__label').text()).toBe(`${title.slice(0, 47)}...`);
    expect(wrapper.get('.selected-chip').attributes('title')).toBe(title);
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

  it('matches duplicate IDs by subtitle when the subtitle identifies the selected option', () => {
    const options = [
      { id: 361, title: 'mostafa 1 -> mostafa 2', subtitle: 284 },
      { id: 361, title: 'mostafa 1 -> mostafa 3', subtitle: 285 },
    ];
    const wrapper = createWrapper({
      staticOptions: options,
      modelValue: { id: 361, title: 'mostafa 1 -> mostafa 3', subtitle: 285 },
    });

    expect(wrapper.findComponent(SelectStub).props('modelValue')).toEqual(options[1]);
    expect(wrapper.find('.selected-value').text()).toBe('mostafa 1 -> mostafa 3');
  });

  it('truncates a long selected label without changing the selected value', () => {
    const selected = makeTitleInterface(1, 'A'.repeat(100));
    const wrapper = createWrapper({ modelValue: selected });

    expect(wrapper.find('.selected-value').text()).toBe(`${'A'.repeat(47)}...`);
    expect(wrapper.findComponent(SelectStub).props('modelValue')).toEqual(selected);
  });

  it('wraps long dropdown option labels by default without truncating their values', () => {
    const option = makeTitleInterface(1, 'A'.repeat(100));
    const wrapper = createWrapper({ staticOptions: [option] });

    expect(wrapper.find('.option-label').text()).toBe('A'.repeat(100));
    expect(wrapper.find('.option-label').classes()).toContain('option-label--wrapped');
    expect(wrapper.find('.option-label').attributes('title')).toBe('A'.repeat(100));
    expect(wrapper.findComponent(SelectStub).props('options')).toEqual([option]);
  });

  it('allows dropdown option wrapping to be disabled', () => {
    const option = makeTitleInterface(1, 'A'.repeat(100));
    const wrapper = createWrapper({ staticOptions: [option], wrapOptionLabels: false });

    expect(wrapper.find('.option-label').classes()).not.toContain('option-label--wrapped');
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

  it('disables the underlying select when disabled is true', () => {
    const wrapper = createWrapper({ disabled: true });

    expect(wrapper.findComponent(SelectStub).props('disabled')).toBe(true);
  });

  it('fetches search results only on Enter and explicit reload', async () => {
    const fetchAsOptions = vi.fn().mockResolvedValue([]);
    const controller = {
      fetchAsOptions,
      isListFailed: vi.fn(() => false),
      isListSuccess: vi.fn(() => true),
    };
    const params = {
      word: '',
      toMap: vi.fn(),
      validate: vi.fn(),
      validateOrThrow: vi.fn(),
    };
    const wrapper = createWrapper({
      type: 2,
      controller,
      params,
      searchOnEnter: true,
    });
    await flushPromises();

    expect(fetchAsOptions).toHaveBeenCalledTimes(1);

    wrapper.findComponent(MultiSelectStub).vm.$emit('filter', { value: 'popular' });
    await flushPromises();
    expect(fetchAsOptions).toHaveBeenCalledTimes(1);

    await wrapper.findComponent(MultiSelectStub).trigger('keydown', { key: 'Enter' });
    await flushPromises();
    expect(params.word).toBe('popular');
    expect(fetchAsOptions).toHaveBeenCalledTimes(2);

    await wrapper.get('.reload-icon').trigger('click');
    await flushPromises();
    expect(fetchAsOptions).toHaveBeenCalledTimes(3);
  });
});
