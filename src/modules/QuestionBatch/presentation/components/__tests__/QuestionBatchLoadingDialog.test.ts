import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
import QuestionBatchLoadingDialog from '../QuestionBatchLoadingDialog.vue';

describe('QuestionBatchLoadingDialog', () => {
  it('shows progress and emits cancellation', async () => {
    const wrapper = mount(QuestionBatchLoadingDialog, {
      props: { visible: true },
      global: { stubs: { Dialog: { template: '<div><slot /></div>' } } },
    });
    expect(wrapper.text()).toContain('question_batch.generating');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });
});
