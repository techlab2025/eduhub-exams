import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ArticleQuestion from '../ArticleQuestion.vue';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';

const routeMock = {
  params: { id: '42' },
  query: {} as Record<string, string>,
};

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
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

vi.mock('../../ArticleQuestionCreateDialog.vue', () => ({
  default: {
    name: 'ArticleQuestionCreateDialog',
    props: ['visible', 'articleId', 'subjectId', 'sequenceId'],
    emits: ['update:visible', 'saved'],
    template: '<div v-if="visible" class="article-question-dialog-stub" />',
  },
}));

const mountComponent = (showHeader = true) =>
  mount(ArticleQuestion, {
    props: {
      artical: {
        id: 42,
        questions: [],
        subjectTree: { id: 361, title: 'Branch' },
        sequenceTree: { id: 284, title: 'mostafa 2' },
        e_c_subject: { id: 284, title: 'mostafa 2' },
      } as unknown as ShowQuestionsModel,
      showHeader,
    },
    global: {
      mocks: { $t: (key: string) => key },
    },
  });

describe('ArticleQuestion', () => {
  beforeEach(() => {
    routeMock.query = {};
  });

  it('opens the article question dialog with its branch and sequence', async () => {
    const wrapper = mountComponent();

    expect(wrapper.get('.questions-header__text h2').text()).toBe('article_questions_title');
    expect(wrapper.get('.questions-header__text p').text()).toBe(
      'questions_linked_to_this_passage',
    );
    await wrapper.get('.questions-header__add').trigger('click');

    expect(wrapper.getComponent({ name: 'ArticleQuestionCreateDialog' }).props()).toMatchObject({
      visible: true,
      articleId: 42,
      subjectId: 361,
      sequenceId: 284,
    });
  });

  it('requests article refresh after a question is saved', () => {
    const wrapper = mountComponent();

    wrapper.getComponent({ name: 'ArticleQuestionCreateDialog' }).vm.$emit('saved');

    expect(wrapper.emitted('updateData')).toHaveLength(1);
  });

  it('uses the show response selection instead of stale route ids', async () => {
    routeMock.query = { subject_id: '284', sequence_id: '308' };
    const wrapper = mountComponent();

    await wrapper.get('.questions-header__add').trigger('click');

    expect(wrapper.getComponent({ name: 'ArticleQuestionCreateDialog' }).props()).toMatchObject({
      subjectId: 361,
      sequenceId: 284,
    });
  });

  it('can hide the header when a parent already renders one', () => {
    const wrapper = mountComponent(false);

    expect(wrapper.find('.questions-header').exists()).toBe(false);
  });
});
