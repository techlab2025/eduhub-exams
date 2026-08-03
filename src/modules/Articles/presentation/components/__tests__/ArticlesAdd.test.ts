import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
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
    WithReviewDialog: {
      name: 'WithReviewDialog',
      props: ['saveStatus'],
      emits: ['with-review', 'without-review'],
      template: `
        <div class="save-review-action" :data-save-status="saveStatus">
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

  it('renders Save, Save & New, draft, and cancel actions', () => {
    const { wrapper } = mountWithParams();

    expect(wrapper.findAll('.save-review-action')).toHaveLength(2);
    expect(wrapper.find('.btn-draft').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
  });

  it.each([
    { selector: '.with-review', status: QuestionStatusEnum.NOT_REVIEW },
    { selector: '.without-review', status: QuestionStatusEnum.APPROVED },
  ])('sets review status before Save', async ({ selector, status }) => {
    createMock.mockResolvedValueOnce(new DataSuccess({ data: { id: 42 } }));
    const { wrapper, params } = mountWithParams();

    await wrapper.get(`[data-save-status="1"] ${selector}`).trigger('click');
    await flushPromises();

    expect(params.status).toBe(status);
    expect(createMock).toHaveBeenCalledWith(params, undefined, '/eg/articles/add', true);
  });

  it('saves a draft with draft review status and local draft data', async () => {
    createMock.mockResolvedValueOnce(new DataSuccess({ data: { id: 42 } }));
    const { wrapper, params } = mountWithParams();

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    expect(params.status).toBe(QuestionStatusEnum.DRAFT);
    expect(localStorage.getItem('article-draft')).not.toBeNull();
    expect(createMock).toHaveBeenCalledWith(params, undefined, '/eg/articles/add');
  });

  it('returns to the articles list after confirming cancel', async () => {
    const { wrapper } = mountWithParams();

    await wrapper.get('.btn-cancel').trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Articles' });
  });
});
