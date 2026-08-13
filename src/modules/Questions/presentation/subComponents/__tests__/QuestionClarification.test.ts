import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuestionClarification from '../QuestionClarification.vue';
import type QuestionClarificationModel from '../../../core/models/subModels/question.clarification.model';

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();
  return {
    ...actual,
    useRoute: vi.fn(() => ({ params: {} })),
  };
});

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
    QuestionSource: true,
    HandleFilesUpload: true,
    UploadFileIcon: true,
  },
};

const clarificationData = {
  clarification: '',
  source: '',
  documents: null,
  attachments: [],
} as unknown as QuestionClarificationModel;

describe('QuestionClarification', () => {
  it('renders without errors', () => {
    const wrapper = mount(QuestionClarification, {
      props: {
        ClarificationData: clarificationData,
        isclarification: false,
      },
      global: globalConfig,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the accordion stub', () => {
    const wrapper = mount(QuestionClarification, {
      props: {
        ClarificationData: clarificationData,
        isclarification: false,
      },
      global: globalConfig,
    });
    expect(wrapper.find('.accordion-stub').exists()).toBe(true);
  });

  it('keeps clarification closed when the edit response contains an empty object', () => {
    const wrapper = mount(QuestionClarification, {
      props: {
        ClarificationData: clarificationData,
        isclarification: true,
      },
      global: globalConfig,
    });

    expect(wrapper.findComponent(stubAccordion).props('value')).toBe(0);
  });

  it('renders description textarea', () => {
    const wrapper = mount(QuestionClarification, {
      props: {
        ClarificationData: clarificationData,
        isclarification: true,
      },
      global: globalConfig,
    });
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('emits updateData on textarea input', async () => {
    const wrapper = mount(QuestionClarification, {
      props: {
        ClarificationData: clarificationData,
        isclarification: true,
      },
      global: globalConfig,
    });
    const textarea = wrapper.find('textarea');
    await textarea.setValue('some text');
    await textarea.trigger('input');
    expect(wrapper.emitted('updateData')).toBeTruthy();
  });
});
