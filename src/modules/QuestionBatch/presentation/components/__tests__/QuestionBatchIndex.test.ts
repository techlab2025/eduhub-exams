import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
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

describe('QuestionBatchIndex', () => {
  it('fetches the batch list and exposes the generation route', () => {
    const wrapper = mount(QuestionBatchIndex, {
      global: {
        stubs: {
          DataStatusBuilder: { template: '<div />' },
          AppTable: true,
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
  });
});
