import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import QuestionBatchModel from '../../../core/models/question.batch.model';

const fetchList = vi.fn().mockResolvedValue(undefined);
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: vi.fn() }),
}));
vi.mock('../../controllers/question.batch.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList,
      listState: { value: new DataSuccess({ data: [QuestionBatchModel.example] }) },
      pagination: { value: null },
    }),
  },
}));

import QuestionBatchIndex from '../QuestionBatchIndex.vue';

const DataStatusBuilderStub = defineComponent({
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => slots.success?.({ data: [QuestionBatchModel.example] });
  },
});

describe('QuestionBatchIndex', () => {
  beforeEach(() => {
    fetchList.mockClear();
  });

  it('renders fields returned by fetch_question_batches', () => {
    const wrapper = mount(QuestionBatchIndex, {
      global: {
        stubs: {
          DataStatusBuilder: DataStatusBuilderStub,
          Pagination: true,
          TableSkelaton: true,
          IndexSearchIcon: true,
          IndexPluseIcon: true,
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    expect(fetchList).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('question_batch.new_batch');
    expect(wrapper.text()).toContain('question_batch.id');
    expect(wrapper.text()).toContain('Batch-2026-001');
    expect(wrapper.text()).toContain('Governmental');
    expect(wrapper.text()).toContain('Primary');
    expect(wrapper.text()).toContain('First');
    expect(wrapper.text()).toContain('Arabic');
    expect(wrapper.text()).toContain('School Book, Term 1');
    expect(wrapper.text()).toContain('Ahmed Ali');
    expect(wrapper.text()).toContain('09-05-2022');
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(2);
  });
});
