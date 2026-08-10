import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { QuestionStatusEnum } from '../../../core/constant/question.status.enum';
import questionsEdit from '../questionsEdit.vue';

const {
  fetchOneMock,
  updateMock,
  routerPushMock,
  routerBackMock,
  itemDataMock,
  routeLeaveRegistrationMock,
} = vi.hoisted(() => ({
  fetchOneMock: vi.fn(),
  updateMock: vi.fn(),
  routerPushMock: vi.fn(),
  routerBackMock: vi.fn(),
  itemDataMock: {
    value: { parentId: 42 } as { parentId?: number; review_status?: QuestionStatusEnum },
  },
  routeLeaveRegistrationMock: vi.fn(),
}));

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
  onBeforeRouteLeave: routeLeaveRegistrationMock,
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
    UnsavedQuestionChangesDialog: {
      name: 'UnsavedQuestionChangesDialog',
      props: ['visible'],
      emits: ['update:visible', 'discard', 'stay'],
      template: `
        <div v-if="visible" class="unsaved-dialog">
          <button class="discard" @click="$emit('discard')">discard</button>
          <button class="stay" @click="$emit('stay')">stay</button>
        </div>
      `,
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

  it('locks the complete form and removes save actions for an archived question', async () => {
    itemDataMock.value = {
      parentId: 42,
      review_status: QuestionStatusEnum.ARCHIVED,
    };
    const wrapper = mount(questionsEdit, { global });
    await flushPromises();

    const formFieldset = wrapper.get('.question-form-fieldset');

    expect(formFieldset.attributes('disabled')).toBeDefined();
    expect(formFieldset.attributes('inert')).toBeDefined();
    expect(formFieldset.attributes('aria-disabled')).toBe('true');
    expect(wrapper.findAll('.review-action')).toHaveLength(0);
    expect(wrapper.find('.btn-draft').exists()).toBe(false);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('asks before leaving an edited question with unsaved changes', async () => {
    const wrapper = mount(questionsEdit, { global });
    await flushPromises();
    wrapper.findComponent({ name: 'QuestionsForm' }).vm.$emit('update-data', {
      id: 7,
      toMap: () => ({ question_id: 7, question: 'Changed question' }),
    });
    await flushPromises();

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0];
    const navigationResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.unsaved-dialog .discard').trigger('click');

    expect(await navigationResult).toBe(true);
  });
});
