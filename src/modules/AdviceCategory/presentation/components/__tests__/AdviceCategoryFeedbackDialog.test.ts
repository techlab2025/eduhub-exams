import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import AdviceCategoryFeedbackDialog from '../AdviceCategoryFeedbackDialog.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const DialogStub = defineComponent({
  props: { visible: Boolean },
  setup(props, { slots }) {
    return () => (props.visible ? h('div', slots.container?.()) : null);
  },
});

const mountDialog = (
  variant: InstanceType<typeof AdviceCategoryFeedbackDialog>['$props']['variant'],
  message = '',
) =>
  mount(AdviceCategoryFeedbackDialog, {
    props: { modelValue: true, variant, message },
    global: {
      stubs: {
        Dialog: DialogStub,
        DeleteIcon: true,
      },
    },
  });

describe('AdviceCategoryFeedbackDialog', () => {
  it('emits confirm from the delete confirmation state', async () => {
    const wrapper = mountDialog('delete-confirm');

    expect(wrapper.text()).toContain('advice_category_page.dialogs.delete.title');
    await wrapper.get('[data-testid="advice-category-delete-confirm"]').trigger('click');

    expect(wrapper.emitted('confirm')).toEqual([[]]);
  });

  it('shows the exact backend error and closes from cancel', async () => {
    const backendMessage = 'This category contains 4 tips or advice.';
    const wrapper = mountDialog('delete-error', backendMessage);

    expect(wrapper.text()).toContain(backendMessage);
    expect(wrapper.find('[data-testid="advice-category-delete-confirm"]').exists()).toBe(false);

    await wrapper.get('[data-testid="advice-category-dialog-cancel"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
