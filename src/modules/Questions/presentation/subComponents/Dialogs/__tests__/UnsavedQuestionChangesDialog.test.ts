import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import UnsavedQuestionChangesDialog from '../UnsavedQuestionChangesDialog.vue';

const global = {
  stubs: {
    Dialog: {
      props: ['visible'],
      template: '<div v-if="visible"><slot /></div>',
    },
  },
  mocks: {
    $t: (key: string) => key,
  },
};

describe('UnsavedQuestionChangesDialog', () => {
  it('emits discard when the user confirms leaving', async () => {
    const wrapper = mount(UnsavedQuestionChangesDialog, {
      props: { visible: true },
      global,
    });

    await wrapper.get('.confirm-btn').trigger('click');

    expect(wrapper.emitted('discard')).toHaveLength(1);
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('emits stay when the user keeps editing', async () => {
    const wrapper = mount(UnsavedQuestionChangesDialog, {
      props: { visible: true },
      global,
    });

    await wrapper.get('.btn-secondary').trigger('click');

    expect(wrapper.emitted('stay')).toHaveLength(1);
  });
});
