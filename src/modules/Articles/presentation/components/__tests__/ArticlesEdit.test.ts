import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import ArticlesEdit from '../ArticlesEdit.vue';

const { fetchOneMock, updateMock, routerPushMock, validateRequiredFieldsMock } = vi.hoisted(() => ({
  fetchOneMock: vi.fn(),
  updateMock: vi.fn(),
  routerPushMock: vi.fn(),
  validateRequiredFieldsMock: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '7' }, fullPath: '/eg/articles/edit/7' }),
  useRouter: () => ({ push: routerPushMock }),
  createRouter: () => ({
    getRoutes: vi.fn(() => []),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  }),
  createWebHistory: vi.fn(),
}));

vi.mock('../../controllers/Article.controller', async () => {
  const { ref } = await import('vue');
  return {
    default: {
      getInstance: () => ({
        fetchOne: fetchOneMock,
        update: updateMock,
        itemData: ref({ id: 7, title: 'Test Article' }),
        errorMessage: ref(''),
      }),
    },
  };
});

const globalConfig = {
  plugins: [createPinia()],
  stubs: {
    ArticleForm: {
      name: 'ArticleForm',
      emits: ['update-data'],
      setup: (_props: unknown, { expose }: { expose: (value: object) => void }) => {
        expose({ validateRequiredFields: validateRequiredFieldsMock });
      },
      template: '<div class="article-form-stub" />',
    },
    CancelQuestionDialog: {
      name: 'CancelQuestionDialog',
      emits: ['cancel'],
      template: '<button class="btn-cancel" @click="$emit(\'cancel\')">cancel</button>',
    },
  },
  mocks: {
    $t: (message: string) => message,
  },
};

const mountWithParams = () => {
  const wrapper = mount(ArticlesEdit, { global: globalConfig });
  wrapper.findComponent({ name: 'ArticleForm' }).vm.$emit('update-data', {
    question_description: 'Description',
    attachments: [],
    question: 'Article title',
    question_type: 5,
    e_c_subject_id: 12,
    questionSequenceId: 34,
    documents: { id: 2, text: 'Source' },
    explanation: { explanation: 'Explanation', attachments: [] },
  });
  return wrapper;
};

describe('ArticlesEdit.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    validateRequiredFieldsMock.mockResolvedValue(true);
    updateMock.mockResolvedValue(new DataSuccess({ data: { id: 7 } as never }));
  });

  it('renders only Next and Cancel actions', () => {
    const wrapper = mountWithParams();

    expect(wrapper.find('.next-button').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
  });

  it('updates the article and continues to question management on Next', async () => {
    const wrapper = mountWithParams();

    await wrapper.get('.next-button').trigger('click');
    await flushPromises();

    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7, e_c_subject_id: 12, questionSequenceId: 34 }),
      undefined,
      '/eg/articles/edit/7',
      false,
    );
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Article questions',
      params: { artical_id: 7 },
      query: { subject_id: 12, sequence_id: 34 },
    });
  });

  it('does not update when required-field validation fails', async () => {
    validateRequiredFieldsMock.mockResolvedValue(false);
    const wrapper = mountWithParams();

    await wrapper.get('.next-button').trigger('click');
    await flushPromises();

    expect(updateMock).not.toHaveBeenCalled();
    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it('returns to the articles list after confirming cancel', async () => {
    const wrapper = mountWithParams();

    await wrapper.get('.btn-cancel').trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Articles' });
    expect(updateMock).not.toHaveBeenCalled();
  });
});
