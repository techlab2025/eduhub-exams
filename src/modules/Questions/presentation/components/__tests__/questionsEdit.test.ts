import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { QuestionStatusEnum } from '../../../core/constant/question.status.enum';
import questionsEdit from '../questionsEdit.vue';

const { fetchOneMock, updateMock, routerPushMock, routerBackMock, itemDataMock } = vi.hoisted(
  () => ({
    fetchOneMock: vi.fn(),
    updateMock: vi.fn(),
    routerPushMock: vi.fn(),
    routerBackMock: vi.fn(),
    itemDataMock: { value: { parentId: 42 } },
  }),
);

vi.mock('../../controllers/questions.controller', () => ({
  default: {
    getInstance: () => ({
      fetchOne: fetchOneMock,
      update: updateMock,
      itemData: itemDataMock,
      errorMessage: { value: '' },
    }),
  },
}));

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    replace: vi.fn(),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '7' },
    query: { article_id: '42' },
    fullPath: '/questions/edit/7?article_id=42',
  }),
  useRouter: () => ({ push: routerPushMock, back: routerBackMock }),
}));

const global = {
  stubs: {
    QuestionsForm: {
      name: 'QuestionsForm',
      methods: { validate: () => Promise.resolve(true) },
      template: '<div class="questions-form-stub" />',
    },
    WithReviewDialog: {
      name: 'WithReviewDialog',
      props: ['saveStatus'],
      emits: ['with-review', 'without-review'],
      template: `
        <div class="review-action" :data-save-status="saveStatus">
          <button class="with-review" @click="$emit('with-review')">with review</button>
          <button class="without-review" @click="$emit('without-review')">without review</button>
        </div>
      `,
    },
    CancelQuestionDialog: {
      name: 'CancelQuestionDialog',
      emits: ['cancel'],
      template: '<button class="btn-cancel" @click="$emit(\'cancel\')">cancel</button>',
    },
  },
  mocks: {
    $t: (key: string) => key,
  },
};

const editParams = () => ({ id: 7, parentId: 42, status: undefined });

describe('questionsEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchOneMock.mockResolvedValue(undefined);
    updateMock.mockResolvedValue(new DataSuccess({ data: {} }));
    itemDataMock.value = { parentId: 42 };
  });

  it('renders the same four actions as the add form', async () => {
    const wrapper = mount(questionsEdit, { global });
    await flushPromises();

    expect(wrapper.findAll('.review-action')).toHaveLength(2);
    expect(wrapper.find('.btn-draft').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
    expect(fetchOneMock).toHaveBeenCalledOnce();
  });

  it('updates as approved and returns to the article questions after Save', async () => {
    const wrapper = mount(questionsEdit, { global });
    wrapper.findComponent({ name: 'QuestionsForm' }).vm.$emit('update-data', editParams());

    await wrapper.get('[data-save-status="1"] .without-review').trigger('click');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(QuestionStatusEnum.APPROVED);
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Article questions',
      params: { artical_id: 42 },
    });
  });

  it('updates with review then opens a new question for the same article', async () => {
    const wrapper = mount(questionsEdit, { global });
    wrapper.findComponent({ name: 'QuestionsForm' }).vm.$emit('update-data', editParams());

    await wrapper.get('[data-save-status="2"] .with-review').trigger('click');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(QuestionStatusEnum.NOT_REVIEW);
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Add question',
      query: { article_id: 42 },
    });
  });

  it('updates the question as a draft', async () => {
    const wrapper = mount(questionsEdit, { global });
    wrapper.findComponent({ name: 'QuestionsForm' }).vm.$emit('update-data', editParams());

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(QuestionStatusEnum.DRAFT);
  });

  it('returns to the article questions when cancelling', async () => {
    const wrapper = mount(questionsEdit, { global });

    await wrapper.get('.btn-cancel').trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Article questions',
      params: { artical_id: 42 },
    });
  });
});
