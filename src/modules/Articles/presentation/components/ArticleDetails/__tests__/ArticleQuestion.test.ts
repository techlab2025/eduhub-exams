import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ArticleQuestion from '../ArticleQuestion.vue';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '42' } }),
}));

vi.mock('../QuestionCard.vue', () => ({
  default: {
    name: 'QuestionCard',
    props: ['allquestion'],
    template: '<div class="question-card-stub" />',
  },
}));

vi.mock('@/shared/icons/ArticleQuestion.vue', () => ({
  default: { name: 'ArticleQuestionIcon', template: '<span class="question-icon-stub" />' },
}));

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a><slot /></a>',
};

const mountComponent = (showHeader = true) =>
  mount(ArticleQuestion, {
    props: {
      artical: {
        id: 42,
        questions: [],
        e_c_subject: { id: 17, title: 'Algebra' },
      } as unknown as ShowQuestionsModel,
      showHeader,
    },
    global: {
      stubs: { RouterLink: RouterLinkStub },
      mocks: { $t: (key: string) => key },
    },
  });

describe('ArticleQuestion', () => {
  it('renders the questions header and configured add route', () => {
    const wrapper = mountComponent();

    expect(wrapper.get('.questions-header__text h2').text()).toBe('article_questions_title');
    expect(wrapper.get('.questions-header__text p').text()).toBe(
      'questions_linked_to_this_passage',
    );
    expect(wrapper.getComponent({ name: 'RouterLink' }).props('to')).toEqual({
      name: 'Add question',
      query: { artical_id: 42, subject_id: 17 },
    });
  });

  it('can hide the header when a parent already renders one', () => {
    const wrapper = mountComponent(false);

    expect(wrapper.find('.questions-header').exists()).toBe(false);
  });
});
