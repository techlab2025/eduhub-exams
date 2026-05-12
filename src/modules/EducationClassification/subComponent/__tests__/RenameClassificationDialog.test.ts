import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import RenameClassificationDialog from '../RenameClassificationDialog.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('RenameClassificationDialog', () => {
  const mountDialog = (props = {}) =>
    mount(RenameClassificationDialog, {
      props: {
        visable: false,
        itemId: 1,
        parentId: 0,
        ...props,
      },
      global: {
        stubs: {
          Dialog: {
            template: '<div v-if="visible"><slot /><slot name="footer" /></div>',
            props: ['visible'],
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when visable is true', () => {
    const wrapper = mountDialog({ visable: true });
    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('does not render when visable is false', () => {
    const wrapper = mountDialog({ visable: false });
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('renders a text input for the title', () => {
    const wrapper = mountDialog({ visable: true });
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('emits update:visable with false when cancel is clicked', async () => {
    const wrapper = mountDialog({ visable: true });
    const buttons = wrapper.findAll('button');
    const cancelBtn = buttons.find((b) => b.text().includes('cancel'));
    if (cancelBtn) {
      await cancelBtn.trigger('click');
    }
    expect(wrapper.emitted('update:visable')).toBeTruthy();
    const emitted = wrapper.emitted('update:visable');
    if (emitted) {
      expect(emitted[0]).toEqual([false]);
    }
  });

  it('emits update:visable with false when save is clicked', async () => {
    const wrapper = mountDialog({ visable: true });
    const buttons = wrapper.findAll('button');
    const saveBtn = buttons.find((b) => b.text().includes('save'));
    if (saveBtn) {
      await saveBtn.trigger('click');
    }
    expect(wrapper.emitted('update:visable')).toBeTruthy();
    const emitted = wrapper.emitted('update:visable');
    if (emitted) {
      expect(emitted[0]).toEqual([false]);
    }
  });

  it('binds v-model to the title input', async () => {
    const wrapper = mountDialog({ visable: true });
    const input = wrapper.find('input[type="text"]');
    await input.setValue('New Title');
    expect((input.element as HTMLInputElement).value).toBe('New Title');
  });
});
