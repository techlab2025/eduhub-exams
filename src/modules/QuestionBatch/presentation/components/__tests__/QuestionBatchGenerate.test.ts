import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';

const fetchStages = vi.fn().mockResolvedValue(undefined);
const fetchEmployees = vi.fn().mockResolvedValue(undefined);
const fetchDocuments = vi.fn().mockResolvedValue(undefined);

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('vue-router', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/modules/Stages/presentation/controllers/stage.controller', () => ({
  default: { getInstance: () => ({ fetchList: fetchStages, listData: { value: [] } }) },
}));
vi.mock('@/modules/employee/presentation/controllers/employee.controller', () => ({
  default: { getInstance: () => ({ fetchList: fetchEmployees, listData: { value: [] } }) },
}));
vi.mock('@/modules/document/presentation/controllers/document.controller', () => ({
  default: { getInstance: () => ({ fetchList: fetchDocuments, listData: { value: [] } }) },
}));
vi.mock('../../controllers/question.batch.controller', () => ({
  default: { getInstance: () => ({ generateBatch: vi.fn() }) },
}));

import QuestionBatchGenerate from '../QuestionBatchGenerate.vue';

describe('QuestionBatchGenerate', () => {
  it('loads curriculum and reviewer options and renders generation settings', async () => {
    const wrapper = mount(QuestionBatchGenerate, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: { template: '<div class="select-stub" />' },
          QuestionBatchLoadingDialog: true,
          GeneratedQuestionBatchDialog: true,
        },
      },
    });
    await flushPromises();
    expect(fetchStages).toHaveBeenCalledOnce();
    expect(fetchEmployees).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('question_batch.generate_setting');
  });

  it('allows only digits in the number of questions input', async () => {
    const wrapper = mount(QuestionBatchGenerate, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: { template: '<div class="select-stub" />' },
          QuestionBatchLoadingDialog: true,
          GeneratedQuestionBatchDialog: true,
        },
      },
    });

    await wrapper.findAll('input[name="number-type"]')[1].setValue();
    const input = wrapper.get('input[type="number"]');
    const preventDefault = vi.fn();

    for (const key of ['e', 'E', '+', '-', '.', 'a']) {
      preventDefault.mockClear();
      await input.trigger('keydown', { key, preventDefault });
      expect(preventDefault).toHaveBeenCalledOnce();
    }

    preventDefault.mockClear();
    await input.trigger('keydown', { key: '5', preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();

    const invalidPaste = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(invalidPaste, 'clipboardData', {
      value: { getData: () => '12e3' },
    });
    input.element.dispatchEvent(invalidPaste);
    expect(invalidPaste.defaultPrevented).toBe(true);

    const validPaste = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(validPaste, 'clipboardData', {
      value: { getData: () => '123' },
    });
    input.element.dispatchEvent(validPaste);
    expect(validPaste.defaultPrevented).toBe(false);
  });

  it('expands and collapses each generation section', async () => {
    const wrapper = mount(QuestionBatchGenerate, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: { template: '<div class="select-stub" />' },
          QuestionBatchLoadingDialog: true,
          GeneratedQuestionBatchDialog: true,
        },
      },
    });

    const settingsPanel = wrapper.findAll('.question-batch-section')[2];
    const header = settingsPanel.get('[data-pc-name="accordionheader"]');
    const content = settingsPanel.get('[data-pc-name="accordioncontent"]');

    expect(header.attributes('aria-expanded')).toBe('true');
    expect(content.isVisible()).toBe(true);

    await header.trigger('click');

    expect(header.attributes('aria-expanded')).toBe('false');
    expect(content.isVisible()).toBe(false);
  });

  it('supports multiple difficulty and question type selections', async () => {
    const wrapper = mount(QuestionBatchGenerate, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: { template: '<div class="select-stub" />' },
          QuestionBatchLoadingDialog: true,
          GeneratedQuestionBatchDialog: true,
        },
      },
    });

    const difficultyInputs = wrapper.findAll('input[name="difficulty"]');
    const questionTypeInputs = wrapper.findAll('input[name="question-type"]');

    expect(difficultyInputs).toHaveLength(4);
    expect(questionTypeInputs).toHaveLength(6);
    expect(difficultyInputs.every((input) => input.attributes('type') === 'checkbox')).toBe(true);
    expect(questionTypeInputs.every((input) => input.attributes('type') === 'checkbox')).toBe(true);

    await difficultyInputs[1].setValue(true);
    expect((difficultyInputs[0].element as HTMLInputElement).checked).toBe(false);
    expect((difficultyInputs[1].element as HTMLInputElement).checked).toBe(true);

    await difficultyInputs[3].setValue(true);
    expect((difficultyInputs[1].element as HTMLInputElement).checked).toBe(true);
    expect((difficultyInputs[3].element as HTMLInputElement).checked).toBe(true);

    await difficultyInputs[3].setValue(false);
    expect((difficultyInputs[1].element as HTMLInputElement).checked).toBe(true);
    expect((difficultyInputs[3].element as HTMLInputElement).checked).toBe(false);

    await difficultyInputs[0].setValue(true);
    expect((difficultyInputs[0].element as HTMLInputElement).checked).toBe(true);
    expect((difficultyInputs[1].element as HTMLInputElement).checked).toBe(false);

    await questionTypeInputs[1].setValue(true);
    await questionTypeInputs[2].setValue(true);
    expect((questionTypeInputs[0].element as HTMLInputElement).checked).toBe(false);
    expect((questionTypeInputs[1].element as HTMLInputElement).checked).toBe(true);
    expect((questionTypeInputs[2].element as HTMLInputElement).checked).toBe(true);

    await questionTypeInputs[0].setValue(true);
    expect((questionTypeInputs[0].element as HTMLInputElement).checked).toBe(true);
    expect((questionTypeInputs[1].element as HTMLInputElement).checked).toBe(false);
    expect((questionTypeInputs[2].element as HTMLInputElement).checked).toBe(false);
  });
});
