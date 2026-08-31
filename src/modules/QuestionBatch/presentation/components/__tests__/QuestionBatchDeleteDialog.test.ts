import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import QuestionBatchModel from '../../../core/models/question.batch.model';
import QuestionBatchDeleteDialog from '../QuestionBatchDeleteDialog.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

const DialogStub = defineComponent({
  props: { visible: Boolean },
  setup(props, { slots }) {
    return () => (props.visible ? h('div', slots.container?.()) : null);
  },
});

const batch = (canDelete: boolean) =>
  QuestionBatchModel.fromJson({
    id: 1,
    title: 'Batch-1',
    status: '3',
    can_delete: canDelete,
  });

const mountDialog = (canDelete: boolean) =>
  mount(QuestionBatchDeleteDialog, {
    props: { modelValue: true, batch: batch(canDelete) },
    global: {
      stubs: { Dialog: DialogStub, DeleteIllustration: true },
      mocks: { $t: (key: string) => key },
    },
  });

describe('QuestionBatchDeleteDialog', () => {
  it('confirms deletion for a deletable batch', async () => {
    const wrapper = mountDialog(true);

    expect(wrapper.text()).toContain('question_batch.delete_batch_title');
    await wrapper.get('[data-testid="confirm-delete"]').trigger('click');

    expect(wrapper.emitted('confirm')?.[0]?.[0]).toMatchObject({ id: 1 });
  });

  it('shows the blocked state without a destructive action', () => {
    const wrapper = mountDialog(false);

    expect(wrapper.text()).toContain('question_batch.cannot_delete_batch_title');
    expect(wrapper.find('[data-testid="confirm-delete"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="cancel-delete"]').exists()).toBe(true);
  });

  it('closes from cancel', async () => {
    const wrapper = mountDialog(true);

    await wrapper.get('[data-testid="cancel-delete"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
