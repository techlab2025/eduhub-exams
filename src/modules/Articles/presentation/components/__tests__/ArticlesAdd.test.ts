import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import ArticlesAdd from '../ArticlesAdd.vue';

const { createMock, routerPushMock, validateRequiredFieldsMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  routerPushMock: vi.fn(),
  validateRequiredFieldsMock: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/eg/articles/add' }),
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
      getInstance: () => ({ create: createMock, errorMessage: ref('') }),
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
  const wrapper = mount(ArticlesAdd, { global: globalConfig });
  const params = { status: null };
  wrapper.findComponent({ name: 'ArticleForm' }).vm.$emit('update-data', params);
  return { wrapper, params };
};

describe('ArticlesAdd.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
    validateRequiredFieldsMock.mockResolvedValue(true);
  });

  it('renders only Next and Cancel actions', () => {
    const { wrapper } = mountWithParams();

    expect(wrapper.find('.next-button').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
  });

  it('creates with status 1 and routes to question management on Next', async () => {
    const { wrapper, params } = mountWithParams();

    await wrapper.get('.next-button').trigger('click');
    await flushPromises();

    expect(params.status).toBe(QuestionStatusEnum.CREATED);
    expect(createMock).toHaveBeenCalledWith(params, undefined, '/eg/articles/add', true);
  });

  it('returns to the articles list after confirming cancel', async () => {
    const { wrapper } = mountWithParams();

    await wrapper.get('.btn-cancel').trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Articles' });
  });
});
