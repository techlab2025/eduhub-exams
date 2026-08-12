import { expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import DraftPlanDialog from '../DraftPlanDialog.vue';

it('renders the draft success design and acknowledges it', async () => {
  const wrapper = mount(DraftPlanDialog, {
    props: { modelValue: true },
    global: {
      stubs: {
        Dialog: {
          props: ['visible'],
          template: '<div><slot name="container" /></div>',
        },
      },
      mocks: { $t: (key: string) => key },
    },
  });

  expect(wrapper.get('img').attributes('src')).toContain('DraftDialogIcon.gif');
  expect(wrapper.get('h2').text()).toBe('draft_added_title');
  expect(wrapper.get('p').text()).toBe('draft_added_message');

  await wrapper.get('button').trigger('click');

  expect(wrapper.emitted('acknowledge')).toHaveLength(1);
});
