import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import GeneratedQuestionBatchModel from '../../../core/models/generated.question.batch.model';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, values?: { count?: number }) =>
      values?.count == null ? key : `${key}:${values.count}`,
  }),
}));
import GeneratedQuestionBatchDialog from '../GeneratedQuestionBatchDialog.vue';

describe('GeneratedQuestionBatchDialog', () => {
  const mountDialog = () =>
    mount(GeneratedQuestionBatchDialog, {
      props: {
        visible: true,
        questions: GeneratedQuestionBatchModel.example.questions,
        curriculumPath: ['Governmental', 'Primary', 'Arabic'],
        requestedCount: 10,
      },
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    });

  it('renders generated questions and emits delete', async () => {
    const wrapper = mountDialog();
    expect(wrapper.text()).toContain('What Is The Basic Building Block');
    const deleteButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'question_batch.delete');
    await deleteButton?.trigger('click');
    expect(wrapper.emitted('delete')?.[0]).toEqual([1]);
  });

  it('edits all question fields and emits a replacement immutable model', async () => {
    const wrapper = mountDialog();
    const editButtons = wrapper
      .findAll('button')
      .filter((button) => button.text() === 'question_batch.edit');
    await editButtons[1]?.trigger('click');

    expect(wrapper.text()).toContain('question_batch.show_details');
    await wrapper
      .get('input[aria-label="question_batch.question"]')
      .setValue('Updated generated question');
    await wrapper.find('.generated-question-card__edit-answers input').setValue('Updated answer');
    await wrapper
      .find('.generated-question-card__edit-explanation input')
      .setValue('Because cells');

    const saveChanges = wrapper
      .findAll('button')
      .find((button) => button.text() === 'question_batch.save_changes');
    await saveChanges?.trigger('click');

    const payload = wrapper.emitted('updateQuestion')?.[0]?.[0] as {
      index: number;
      question: { questionTitle?: string; answers?: Array<{ answer?: string }> };
    };
    expect(payload.index).toBe(1);
    expect(payload.question.questionTitle).toBe('Updated generated question');
    expect(payload.question.answers?.[0]?.answer).toBe('Updated answer');
    expect(Object.isFrozen(payload.question)).toBe(true);
  });
});
