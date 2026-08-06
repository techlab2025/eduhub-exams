import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { QuestionStatusEnum } from '../../../core/constant/question.status.enum';
import questionsIndex from '../questionsIndex.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
const fetchListMock = vi.hoisted(() => vi.fn());

// Mock dependencies
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { country_code: 'eg' },
    query: { page: '1', word: '', status: '2' },
    fullPath: '/eg/questions',
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  createRouter: vi.fn(() => ({
    getRoutes: vi.fn(() => []),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

vi.mock('../../controllers/questions.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: {} },
      fetchList: fetchListMock,
      pagination: { value: {} },
    }),
  },
}));

const globalConfig = {
  plugins: [createPinia(), i18n],
  stubs: {
    'router-link': true,
    DataStatusBuilder: true,
    AppTable: true,
    Pagination: true,
    DropList: true,
    FilterDialog: true,
    IndexSearchIcon: true,
    IndexPluseIcon: true,
  },
  mocks: {
    $t: (msg: string) => msg,
  },
};

const mountWithTableItem = (status: QuestionStatusEnum) =>
  mount(questionsIndex, {
    global: {
      ...globalConfig,
      stubs: {
        ...globalConfig.stubs,
        DataStatusBuilder: {
          template: '<div><slot name="success" :data="[]" /></div>',
        },
        AppTable: {
          name: 'AppTable',
          props: ['rowSelectable', 'rowDisabled'],
          template: `<div><slot name="actions" :item="{ id: 10, status: ${status} }" /></div>`,
        },
      },
    },
  });

describe('questionsIndex.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(questionsIndex, { global: globalConfig });
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the search input', () => {
    const wrapper = mount(questionsIndex, { global: globalConfig });
    const searchInput = wrapper.find('.search-input');
    expect(searchInput.exists()).toBe(true);
  });

  it('contains the "Add Questions" button', () => {
    const wrapper = mount(questionsIndex, { global: globalConfig });
    const addButton = wrapper.find('.btn-add');
    expect(addButton.exists()).toBe(true);
  });

  it('uses the status query when fetching questions', async () => {
    mount(questionsIndex, { global: globalConfig });
    await flushPromises();

    const params = fetchListMock.mock.calls.at(-1)?.[0];
    expect(params.status).toBe(2);
  });

  it('shows only the view action for an approved question', () => {
    const wrapper = mountWithTableItem(QuestionStatusEnum.APPROVED);
    const actions = wrapper.findComponent({ name: 'DropList' }).props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual(['show_question']);
  });

  it('hides the selection checkbox for approved questions', () => {
    const wrapper = mountWithTableItem(QuestionStatusEnum.APPROVED);
    const table = wrapper.findComponent({ name: 'AppTable' });
    const rowSelectable = table.props('rowSelectable') as (item: {
      status: QuestionStatusEnum;
    }) => boolean;

    expect(rowSelectable({ status: QuestionStatusEnum.APPROVED })).toBe(false);
    expect(rowSelectable({ status: QuestionStatusEnum.CREATED })).toBe(true);
    expect(table.props('rowDisabled')).toBeUndefined();
  });

  it('shows edit, view, and delete actions for a non-approved question', () => {
    const wrapper = mountWithTableItem(QuestionStatusEnum.CREATED);
    const actions = wrapper.findComponent({ name: 'DropList' }).props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual([
      'Edit',
      'show_question',
      'delete',
    ]);
  });
});
