import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuestionSolutionHints from '../QuestionSolutionHints.vue';
import type SolutionHintModel from '../../../core/models/subModels/solution.hint.model';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: {},
  })),
}));

const stubAccordion = {
  template: '<div class="accordion-stub"><slot /></div>',
  props: ['value', 'pt'],
  emits: ['update:value'],
};

const stubAccordionPanel = {
  template: '<div class="accordion-panel-stub"><slot /></div>',
  props: ['value'],
};

const stubAccordionHeader = {
  template: '<div class="accordion-header-stub"><slot name="toggleicon" /></div>',
};

const stubAccordionContent = {
  template: '<div class="accordion-content-stub"><slot /></div>',
  props: ['pt'],
};

const globalConfig = {
  mocks: { $t: (key: string) => key },
  stubs: {
    Accordion: stubAccordion,
    AccordionPanel: stubAccordionPanel,
    AccordionHeader: stubAccordionHeader,
    AccordionContent: stubAccordionContent,
    Checkbox: {
      template: '<input type="checkbox" />',
      props: ['modelValue', 'binary', 'inputId', 'name'],
    },
    HandleFilesUpload: true,
    UploadFileIcon: true,
  },
};

const solutionHintsData = {
  hint: '',
  attachments: [],
} as unknown as SolutionHintModel;

describe('QuestionSolutionHints', () => {
  it('renders without errors', () => {
    const wrapper = mount(QuestionSolutionHints, {
      props: {
        SolutionHintsData: solutionHintsData,
        isSolutionHintsData: false,
      },
      global: globalConfig,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the accordion stub', () => {
    const wrapper = mount(QuestionSolutionHints, {
      props: {
        SolutionHintsData: solutionHintsData,
        isSolutionHintsData: false,
      },
      global: globalConfig,
    });
    expect(wrapper.find('.accordion-stub').exists()).toBe(true);
  });

  it('keeps solution hints closed when the edit response contains an empty object', () => {
    const wrapper = mount(QuestionSolutionHints, {
      props: {
        SolutionHintsData: solutionHintsData,
        isSolutionHintsData: true,
      },
      global: globalConfig,
    });

    expect(wrapper.findComponent(stubAccordion).props('value')).toBe(0);
  });

  it('renders description textarea when active', () => {
    const wrapper = mount(QuestionSolutionHints, {
      props: {
        SolutionHintsData: solutionHintsData,
        isSolutionHintsData: true,
      },
      global: globalConfig,
    });
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('emits updateData on textarea input', async () => {
    const wrapper = mount(QuestionSolutionHints, {
      props: {
        SolutionHintsData: solutionHintsData,
        isSolutionHintsData: true,
      },
      global: globalConfig,
    });
    const textarea = wrapper.find('textarea');
    await textarea.setValue('hint text');
    await textarea.trigger('input');
    expect(wrapper.emitted('updateData')).toBeTruthy();
  });
});
