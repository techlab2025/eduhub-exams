import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import QuestionHeader from './QuestionHeader.vue';
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';

const { deleteQuestionMock, pushMock, updateReviewStatusMock } = vi.hoisted(() => ({
  deleteQuestionMock: vi.fn(),
  pushMock: vi.fn(),
  updateReviewStatusMock: vi.fn(),
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '10' } }),
  useRouter: () => ({
    currentRoute: { value: { params: { id: '10' } } },
    push: pushMock,
  }),
}));

vi.mock('../../controllers/questions.controller', () => ({
  default: {
    getInstance: () => ({
      delete: deleteQuestionMock,
      updateReviewStatus: updateReviewStatusMock,
    }),
  },
}));

const mountComponent = (
  reviewStatus: QuestionStatusEnum,
  questionType: QuestionTypeEnum = QuestionTypeEnum.mcq,
) =>
  mount(QuestionHeader, {
    props: {
      questionData: {
        review_status: reviewStatus,
        questionType,
        approvedBy: 'Reviewer',
        createdAt: '2026-07-29',
        can_delete: true,
      } as ShowQuestionsModel,
    },
    global: {
      plugins: [i18n],
      stubs: {
        EditIcon: true,
        RevisionQuestion: {
          template: '<button class="revision-action">Revision</button>',
        },
        Dialog: {
          props: ['visible'],
          emits: ['update:visible'],
          template: '<div v-if="visible" class="dialog-stub"><slot name="container" /></div>',
        },
        DeleteIcon: true,
      },
    },
  });

describe('QuestionHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [QuestionStatusEnum.CREATED, 'Created', 'has been created'],
    [QuestionStatusEnum.APPROVED, 'Approved', 'available for publishing'],
    [QuestionStatusEnum.REJECTED, 'Rejected', 'rejection reason'],
    [QuestionStatusEnum.DRAFT, 'Draft', 'saved as a draft'],
    [QuestionStatusEnum.NOT_REVIEW, 'Not Reviewed', 'not reviewed yet'],
    [QuestionStatusEnum.ARCHIVED, 'Archived', 'no longer available'],
    [QuestionStatusEnum.REVISION, 'Revision Required', 'requires revision'],
  ])('shows the title and description for status %s', (status, title, description) => {
    const wrapper = mountComponent(status);

    expect(wrapper.text()).toContain(`${title} Question`);
    expect(wrapper.text()).toContain(description);
  });

  it('shows only revision and archive actions for an approved question', () => {
    const wrapper = mountComponent(QuestionStatusEnum.APPROVED);

    expect(wrapper.find('.revision-action').exists()).toBe(true);
    expect(wrapper.text().toLowerCase()).toContain('archive');
    expect(wrapper.text()).not.toContain('edit');
    expect(wrapper.find('.action-btn.delete').exists()).toBe(false);
  });

  it('asks for confirmation before deleting the question', async () => {
    const wrapper = mountComponent(QuestionStatusEnum.CREATED);
    const deleteButton = wrapper.find('.action-btn.delete');

    expect(deleteButton.attributes('aria-label')).toBe('Delete');

    await deleteButton.trigger('click');

    expect(wrapper.text()).toContain('Are you sure you want to delete this question?');
    expect(deleteQuestionMock).not.toHaveBeenCalled();

    await wrapper.find('.btn-delete-danger').trigger('click');
    await flushPromises();

    expect(deleteQuestionMock).toHaveBeenCalledOnce();
    expect(pushMock).toHaveBeenCalledWith({ name: 'Questions' });
  });

  it('routes an article record to article edit', async () => {
    const wrapper = mountComponent(QuestionStatusEnum.CREATED, QuestionTypeEnum.paragraph);

    await wrapper.get('.question-actions .btn-primary').trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      name: 'Edit article',
      params: { id: '10' },
    });
  });

  it('keeps normal records on question edit', async () => {
    const wrapper = mountComponent(QuestionStatusEnum.CREATED, QuestionTypeEnum.mcq);

    await wrapper.get('.question-actions .btn-primary').trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      name: 'Edit question',
      params: { id: '10' },
    });
  });
});
