import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SaveQuestionConfirmationDialog from '../SaveQuestionConfirmationDialog.vue';

const global = {
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot /></div>',
    },
  },
  mocks: { $t: (key: string) => key },
};

describe('SaveQuestionConfirmationDialog', () => {
  it('opens confirmation and emits confirm from Save', async () => {
    const wrapper = mount(SaveQuestionConfirmationDialog, { global });

    await wrapper.get('.embedded-save').trigger('click');
    await wrapper.get('.confirm-save').trigger('click');

    expect(wrapper.emitted('confirm')).toHaveLength(1);
  });

  it('closes without confirming from Cancel', async () => {
    const wrapper = mount(SaveQuestionConfirmationDialog, { global });

    await wrapper.get('.embedded-save').trigger('click');
    await wrapper.get('.btn-secondary').trigger('click');

    expect(wrapper.emitted('confirm')).toBeUndefined();
  });
});
