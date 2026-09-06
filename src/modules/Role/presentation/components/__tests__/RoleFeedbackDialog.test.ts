import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import RoleFeedbackDialog from '../RoleFeedbackDialog.vue';

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
  variant: InstanceType<typeof RoleFeedbackDialog>['$props']['variant'],
  message = '',
) =>
  mount(RoleFeedbackDialog, {
    props: { modelValue: true, variant, message },
    global: { stubs: { Dialog: DialogStub } },
  });

describe('RoleFeedbackDialog', () => {
  it('shows the missing-title validation and closes from cancel', async () => {
    const wrapper = mountDialog('title-required');

    expect(wrapper.text()).toContain('role.dialogs.title_required.title');
    expect(wrapper.text()).toContain('role.dialogs.title_required.message');
    expect(wrapper.find('[data-testid="role-dialog-confirm"]').exists()).toBe(false);

    await wrapper.get('[data-testid="role-dialog-cancel"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('emits confirm from the delete confirmation state', async () => {
    const wrapper = mountDialog('delete-confirm');

    await wrapper.get('[data-testid="role-dialog-confirm"]').trigger('click');

    expect(wrapper.emitted('confirm')).toEqual([[]]);
  });

  it('shows the exact backend message in an error state', () => {
    const backendMessage = 'Cannot delete role because it is assigned to one or more employees.';
    const wrapper = mountDialog('delete-error', backendMessage);

    expect(wrapper.text()).toContain(backendMessage);
    expect(wrapper.text()).not.toContain('role.dialogs.delete_error.message');
  });
});
