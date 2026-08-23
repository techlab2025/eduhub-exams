import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';

const fetchStages = vi.fn().mockResolvedValue(undefined);
const fetchEmployees = vi.fn().mockResolvedValue(undefined);
const fetchDocuments = vi.fn().mockResolvedValue(undefined);

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('vue-router', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/modules/Stages/presentation/controllers/stage.controller', () => ({
  default: { getInstance: () => ({ fetchList: fetchStages, listData: { value: [] } }) },
}));
vi.mock('@/modules/employee/presentation/controllers/employee.controller', () => ({
  default: { getInstance: () => ({ fetchList: fetchEmployees, listData: { value: [] } }) },
}));
vi.mock('@/modules/document/presentation/controllers/document.controller', () => ({
  default: { getInstance: () => ({ fetchList: fetchDocuments, listData: { value: [] } }) },
}));
vi.mock('../../controllers/question.batch.controller', () => ({
  default: { getInstance: () => ({ generateBatch: vi.fn() }) },
}));

import QuestionBatchGenerate from '../QuestionBatchGenerate.vue';

describe('QuestionBatchGenerate', () => {
  it('loads curriculum and reviewer options and renders generation settings', async () => {
    const wrapper = mount(QuestionBatchGenerate, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: { template: '<div class="select-stub" />' },
          QuestionBatchLoadingDialog: true,
          GeneratedQuestionBatchDialog: true,
        },
      },
    });
    await flushPromises();
    expect(fetchStages).toHaveBeenCalledOnce();
    expect(fetchEmployees).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('question_batch.generate_setting');
  });
});
