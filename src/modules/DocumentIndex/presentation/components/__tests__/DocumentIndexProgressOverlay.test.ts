/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

const startIndex = vi.fn();
const checkStatus = vi.fn();

vi.mock('../../controllers/document.index.patch.controller', () => ({
  default: {
    getInstance: () => ({ startIndex, checkStatus }),
  },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

import DocumentIndexProgressController from '../../controllers/document.index.progress.controller';
import DocumentIndexProgressOverlay from '../DocumentIndexProgressOverlay.vue';

const DialogStub = defineComponent({
  name: 'PrimeDialogStub',
  props: { visible: { type: Boolean, default: false } },
  emits: ['update:visible'],
  setup(props, { slots }) {
    return () => (props.visible ? h('div', { class: 'dialog-stub' }, slots.default?.()) : null);
  },
});

const GeneratedDialogStub = defineComponent({
  name: 'GeneratedDocumentIndexDialog',
  props: { visible: { type: Boolean, default: false } },
  emits: ['update:visible'],
  setup() {
    return () => null;
  },
});

const mountOverlay = () =>
  mount(DocumentIndexProgressOverlay, {
    global: {
      stubs: {
        Dialog: DialogStub,
        GeneratedDocumentIndexDialog: GeneratedDialogStub,
      },
    },
  });

describe('DocumentIndexProgressOverlay', () => {
  const controller = DocumentIndexProgressController.getInstance();

  beforeEach(() => {
    vi.clearAllMocks();
    controller.reset();
    startIndex.mockResolvedValue(new DataSuccess({ data: 12 }));
    checkStatus.mockResolvedValue(
      new DataSuccess({
        data: {
          status: 1,
          isApply: false,
          documentId: 17,
          generatedIndex: { editableItems: [] },
        },
      }),
    );
  });

  it('pins minimized progress to the global overlay and reopens the dialog', async () => {
    await controller.startIndex(17);
    const wrapper = mountOverlay();

    expect(wrapper.find('.document-index-generation').exists()).toBe(true);
    expect(wrapper.find('.document-index-generation__progress-value').text()).toBe('10%');

    await wrapper.find('.document-index-generation__minimize').trigger('click');

    expect(wrapper.find('.document-index-generation').exists()).toBe(false);
    expect(wrapper.find('.document-index-floating-progress').exists()).toBe(true);
    expect(wrapper.find('.document-index-floating-progress').text()).toContain(
      'document_index.ai_indexing',
    );

    await wrapper.find('.document-index-floating-progress button').trigger('click');
    await flushPromises();

    expect(checkStatus.mock.calls[0]?.[0].toMap()).toEqual({ id: 12 });
    expect(wrapper.find('.document-index-generation').exists()).toBe(true);
  });

  it('cancels the active floating job through the confirmation dialog', async () => {
    await controller.startIndex(17);
    const wrapper = mountOverlay();

    await wrapper.find('.document-index-generation__cancel').trigger('click');
    expect(wrapper.find('.document-index-cancel').exists()).toBe(true);

    await wrapper.find('.document-index-cancel__confirm').trigger('click');

    expect(controller.hasActiveIndexing.value).toBe(false);
    expect(wrapper.find('.document-index-generation').exists()).toBe(false);
    expect(wrapper.find('.document-index-floating-progress').exists()).toBe(false);
  });
});
