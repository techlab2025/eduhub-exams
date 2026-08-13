import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import ArticalQuestionsList from '../ArticalQuestionsList.vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';

const { fetchOneMock, itemStateMock, routeMock, routerPushMock, updateReviewStatusMock } =
  vi.hoisted(() => ({
    fetchOneMock: vi.fn(),
    itemStateMock: { value: { data: null as null | Record<string, unknown> } },
    routeMock: {
      params: { artical_id: '42' },
      query: { subject_id: '290', sequence_id: '304' } as Record<string, string>,
    },
    routerPushMock: vi.fn(),
    updateReviewStatusMock: vi.fn(),
  }));

vi.mock('../../controllers/Article.controller', () => ({
  default: {
    getInstance: () => ({
      fetchOne: fetchOneMock,
      itemState: itemStateMock,
    }),
  },
}));

vi.mock('../ArticleQuestionCreateDialog.vue', () => ({
  default: {
    name: 'ArticleQuestionCreateDialog',
    props: {
      visible: Boolean,
      articleId: Number,
      subjectId: Number,
      sequenceId: Number,
    },
    emits: ['update:visible', 'saved'],
    template: '<div v-if="visible" class="question-dialog-stub" />',
  },
}));

vi.mock('@/modules/Questions/presentation/controllers/questions.controller', () => ({
  default: {
    getInstance: () => ({ updateReviewStatus: updateReviewStatusMock }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  useRouter: () => ({ push: routerPushMock }),
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      article_form_progress: 'Article form progress',
      article_details_step: 'Article Details',
      step_one: 'Step 1',
      question_management_step: 'Question Management',
      step_two: 'Step 2',
      article_questions_loading: 'Loading',
      article_questions_title: 'Questions',
      article_questions_empty_title: 'Start With Your First Question',
      article_questions_empty_description: 'No questions yet',
      save: 'Save',
      article_questions_back: 'Back',
      article_questions_add_button: 'Add New Question',
      article_questions_dialog_tip: 'Complete the required fields',
      article_show: 'Show',
      'Save As draft': 'Save As draft',
    },
  },
});
const global = {
  plugins: [i18n],
  stubs: {
    ArticleQuestion: { template: '<div class="article-question-stub" />' },
    WithReviewDialog: {
      name: 'WithReviewDialog',
      props: ['saveStatus'],
      emits: ['with-review', 'without-review'],
      template: '<button class="review-action-stub" :data-save-status="saveStatus" />',
    },
    CancelQuestionDialog: {
      name: 'CancelQuestionDialog',
      emits: ['cancel'],
      template: '<button class="cancel-action-stub" />',
    },
  },
};

describe('ArticalQuestionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeMock.query = { subject_id: '290', sequence_id: '304' };
    itemStateMock.value.data = null;
    fetchOneMock.mockResolvedValue(undefined);
    updateReviewStatusMock.mockResolvedValue(new DataSuccess({ data: true }));
  });

  it('uses the article subject and sequence trees when query ids are absent', async () => {
    routeMock.query = {};
    itemStateMock.value.data = {
      questions: [],
      number_of_questions: 0,
      subjectTree: { id: 361, title: 'mostafa 1' },
      sequenceTree: { id: 284, title: 'mostafa 2' },
      e_c_subject: { id: 284, title: 'mostafa 2' },
    };
    const wrapper = mount(ArticalQuestionsList, { global });
    await flushPromises();

    await wrapper.get('.add-question-button').trigger('click');

    expect(wrapper.findComponent({ name: 'ArticleQuestionCreateDialog' }).props()).toMatchObject({
      subjectId: 284,
      sequenceId: 284,
    });
  });

  it('opens the add-question dialog, then closes and refetches after saving', async () => {
    itemStateMock.value.data = { questions: [], number_of_questions: 0 };
    const wrapper = mount(ArticalQuestionsList, { global });
    await flushPromises();

    expect(fetchOneMock).toHaveBeenCalledOnce();
    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toMatchObject({ question_id: 42 });
    expect(wrapper.find('.empty-questions-card').exists()).toBe(true);
    expect(wrapper.find('.completion-actions').exists()).toBe(false);
    expect(wrapper.findAll('.empty-state-actions button')).toHaveLength(2);
    expect(wrapper.find('.question-dialog-stub').exists()).toBe(false);

    await wrapper.get('.add-question-button').trigger('click');
    const questionDialog = wrapper.findComponent({ name: 'ArticleQuestionCreateDialog' });
    expect(questionDialog.exists()).toBe(true);
    expect(questionDialog.props()).toMatchObject({
      visible: true,
      articleId: 42,
      subjectId: 290,
      sequenceId: 304,
    });

    questionDialog.vm.$emit('saved');
    await flushPromises();

    expect(wrapper.find('.question-dialog-stub').exists()).toBe(false);
    expect(fetchOneMock).toHaveBeenCalledTimes(2);
  });

  it('renders ArticleQuestion and enables finishing when questions exist', async () => {
    itemStateMock.value.data = { questions: [{ id: 1 }], number_of_questions: 1 };
    const wrapper = mount(ArticalQuestionsList, { global });
    await flushPromises();

    expect(wrapper.find('.article-question-stub').exists()).toBe(true);
    expect(wrapper.get('.question-management-toolbar').text()).toContain('Questions');
    expect(wrapper.get('.question-count').text()).toBe('1');
    expect(wrapper.findAll('.completion-actions > *')).toHaveLength(4);

    await wrapper.get('.question-management-toolbar .add-question-button').trigger('click');
    const questionDialog = wrapper.findComponent({ name: 'ArticleQuestionCreateDialog' });
    expect(questionDialog.props('visible')).toBe(true);

    questionDialog.vm.$emit('saved');
    await flushPromises();

    expect(wrapper.find('.question-dialog-stub').exists()).toBe(false);
    expect(fetchOneMock).toHaveBeenCalledTimes(2);

    wrapper.findComponent({ name: 'WithReviewDialog' }).vm.$emit('without-review');
    await flushPromises();

    expect(updateReviewStatusMock).toHaveBeenCalledOnce();
    expect(updateReviewStatusMock.mock.calls[0]?.[0].toMap()).toEqual({
      question_id: 42,
      status: QuestionStatusEnum.APPROVED,
    });
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Show article',
      params: { id: 42 },
      query: { subject_id: 290, sequence_id: 304 },
    });
  });

  it('changes the article status to 3 before cancelling', async () => {
    itemStateMock.value.data = { questions: [{ id: 1 }], number_of_questions: 1 };
    const wrapper = mount(ArticalQuestionsList, { global });
    await flushPromises();

    wrapper.findComponent({ name: 'CancelQuestionDialog' }).vm.$emit('cancel');
    await flushPromises();

    expect(updateReviewStatusMock.mock.calls[0]?.[0].toMap()).toEqual({
      question_id: 42,
      status: 3,
    });
    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Articles' });
  });

  it('routes Back to the table and Show to article details when no questions exist', async () => {
    itemStateMock.value.data = { questions: [], number_of_questions: 0 };
    const wrapper = mount(ArticalQuestionsList, { global });
    await flushPromises();

    await wrapper.get('.back-button').trigger('click');
    await wrapper.get('.finish-button').trigger('click');

    expect(routerPushMock).toHaveBeenNthCalledWith(1, { name: 'Articles' });
    expect(routerPushMock).toHaveBeenNthCalledWith(2, {
      name: 'Show article',
      params: { id: 42 },
      query: { subject_id: 290, sequence_id: 304 },
    });
  });
});
