import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import QuestionStatusBox from './QuestionStatusBox.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

const mountComponent = (reviewStatus: QuestionStatusEnum) =>
  mount(QuestionStatusBox, {
    props: {
      questionData: {
        review_status: reviewStatus,
        question_id: 15,
        createdAt: '2026-07-30',
      } as ShowQuestionsModel,
    },
    global: { plugins: [i18n] },
  });

describe('QuestionStatusBox', () => {
  it.each([
    [QuestionStatusEnum.CREATED, 'status-created', 'Created'],
    [QuestionStatusEnum.APPROVED, 'status-approved', 'Approved'],
    [QuestionStatusEnum.REJECTED, 'status-rejected', 'Rejected'],
    [QuestionStatusEnum.DRAFT, 'status-draft', 'Draft'],
    [QuestionStatusEnum.NOT_REVIEW, 'status-under-review', 'Under Review'],
    [QuestionStatusEnum.ARCHIVED, 'status-archived', 'Archived'],
    [QuestionStatusEnum.REVISION, 'status-revision', 'Revision Required'],
  ])('uses the correct class and label for status %s', (status, className, label) => {
    const wrapper = mountComponent(status);
    const card = wrapper.get('.question-status-card');

    expect(card.classes()).toContain(className);
    expect(card.text()).toContain(label);
  });
});
