import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import QuestionBatchModel from '../../../core/models/question.batch.model';

const fetchList = vi.fn().mockResolvedValue(undefined);
const batches = [
  QuestionBatchModel.example,
  QuestionBatchModel.fromJson({ id: 2, title: 'Batch-Draft', status: '1' }),
  QuestionBatchModel.fromJson({ id: 3, title: 'Batch-Failed', status: '4' }),
];
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: vi.fn() }),
}));
vi.mock('../../controllers/question.batch.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList,
      listState: { value: new DataSuccess({ data: batches }) },
      pagination: { value: null },
    }),
  },
}));

import QuestionBatchIndex from '../QuestionBatchIndex.vue';

const DataStatusBuilderStub = defineComponent({
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => slots.success?.({ data: batches });
  },
});

const PopoverStub = defineComponent({
  setup(_, { expose, slots }) {
    expose({ toggle: () => undefined });
    return () => h('div', { class: 'popover-stub' }, slots.default?.());
  },
});

const mountIndex = () =>
  mount(QuestionBatchIndex, {
    global: {
      stubs: {
        DataStatusBuilder: DataStatusBuilderStub,
        Pagination: true,
        TableSkelaton: true,
        IndexSearchIcon: true,
        DialogIconFillter: true,
        Popover: PopoverStub,
        QuestionBatchActions: true,
        QuestionBatchDeleteDialog: true,
      },
    },
  });

describe('QuestionBatchIndex', () => {
  beforeEach(() => {
    fetchList.mockClear();
  });

  it('renders fields returned by fetch_question_batches', () => {
    const wrapper = mountIndex();

    expect(fetchList).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('question_batch.id');
    expect(wrapper.text()).toContain('Batch-2026-001');
    expect(wrapper.text()).toContain('Governmental');
    expect(wrapper.text()).toContain('Primary');
    expect(wrapper.text()).toContain('First');
    expect(wrapper.text()).toContain('Arabic');
    expect(wrapper.text()).toContain('School Book, Term 1');
    expect(wrapper.text()).toContain('Ahmed Ali');
    expect(wrapper.text()).toContain('09-05-2022');
    expect(wrapper.findAll('.question-batch-index__education-arrow')).toHaveLength(2);
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(4);

    const table = wrapper.get('.question-batch-index__table table');
    expect(table.find('.th-actions').exists()).toBe(true);
    expect(table.findAll('.td-actions')).toHaveLength(batches.length);
  });

  it('renders the summary cards from the loaded batches', () => {
    const wrapper = mountIndex();

    expect(wrapper.get('[data-summary="total"] strong').text()).toBe('3');
    expect(wrapper.get('[data-summary="approved"] strong').text()).toBe('1');
    expect(wrapper.get('[data-summary="draft"] strong').text()).toBe('1');
    expect(wrapper.get('[data-summary="failed"] strong').text()).toBe('1');
  });

  it('filters table rows by one or more statuses', async () => {
    const wrapper = mountIndex();
    await wrapper.get('.question-batch-index__filter').trigger('click');
    const draftFilter = wrapper
      .findAll('.question-batch-filter__option')
      .find((option) => option.text().includes('question_batch.draft'));

    expect(draftFilter).toBeDefined();
    await draftFilter?.trigger('click');

    const table = wrapper.get('.question-batch-index__table');
    expect(table.text()).toContain('Batch-Draft');
    expect(table.text()).not.toContain('Batch-2026-001');
    expect(table.text()).not.toContain('Batch-Failed');
  });
});
