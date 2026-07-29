import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import QuestionHeader from './QuestionHeader.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '10' } }),
  useRouter: () => ({
    currentRoute: { value: { params: { id: '10' } } },
    push: vi.fn(),
  }),
}));

vi.mock('../../controllers/questions.controller', () => ({
  default: {
    getInstance: () => ({
      delete: vi.fn(),
      updateReviewStatus: vi.fn(),
    }),
  },
}));

const mountComponent = (reviewStatus: QuestionStatusEnum) =>
  mount(QuestionHeader, {
    props: {
      questionData: {
        review_status: reviewStatus,
        approvedBy: 'Reviewer',
        createdAt: '2026-07-29',
      } as ShowQuestionsModel,
    },
    global: {
      mocks: {
        $t: (key: string) => key,
      },
      stubs: {
        EditIcon: true,
        RevisionQuestion: {
          template: '<button class="revision-action">Revision</button>',
        },
      },
    },
  });

describe('QuestionHeader', () => {
  it('shows only revision and archive actions for an approved question', () => {
    const wrapper = mountComponent(QuestionStatusEnum.APPROVED);

    expect(wrapper.find('.revision-action').exists()).toBe(true);
    expect(wrapper.text()).toContain('archive');
    expect(wrapper.text()).not.toContain('edit');
    expect(wrapper.find('.action-btn.delete').exists()).toBe(false);
  });
});
