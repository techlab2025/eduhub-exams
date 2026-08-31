import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { QuestionBatchStatusEnum } from '../../../core/constant/question.batch.status.enum';
import QuestionBatchActions from '../QuestionBatchActions.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

const PopoverStub = defineComponent({
  setup(_, { expose, slots }) {
    expose({ toggle: () => undefined, hide: () => undefined });
    return () => h('div', { class: 'popover-stub' }, slots.default?.());
  },
});

const mountActions = (status: string) =>
  mount(QuestionBatchActions, {
    props: { status },
    global: {
      stubs: {
        Popover: PopoverStub,
        ActionsIcon: true,
        DeleteIcon: true,
        IconCheck: true,
        ViewIcon: true,
      },
      mocks: { $t: (key: string) => key },
    },
  });

describe('QuestionBatchActions', () => {
  it('shows view and delete only for an approved batch', () => {
    const wrapper = mountActions(QuestionBatchStatusEnum.APPROVED);

    expect(wrapper.find('[data-action="view"]').exists()).toBe(true);
    expect(wrapper.find('[data-action="approve"]').exists()).toBe(false);
    expect(wrapper.find('[data-action="delete"]').exists()).toBe(true);
  });

  it.each([
    QuestionBatchStatusEnum.DRAFT,
    QuestionBatchStatusEnum.READY_FOR_REVIEW,
    QuestionBatchStatusEnum.REJECTED,
  ])('shows approve for status %s', (status) => {
    const wrapper = mountActions(status);

    expect(wrapper.find('[data-action="approve"]').exists()).toBe(true);
  });

  it('emits the selected action', async () => {
    const wrapper = mountActions(QuestionBatchStatusEnum.DRAFT);

    await wrapper.get('[data-action="approve"]').trigger('click');

    expect(wrapper.emitted('approve')).toHaveLength(1);
  });
});
