import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GeneratedDocumentIndexModel from '../../../core/models/generated.document.index.model';
import GeneratedDocumentIndexDialog from '../GeneratedDocumentIndexDialog.vue';

const updateIndex = vi.fn();
const saveIndex = vi.fn();

vi.mock('../../controllers/document.index.controller', () => ({
  default: {
    getInstance: () => ({ updateIndex, saveIndex }),
  },
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: { toastSuccess: vi.fn() },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const DialogStub = defineComponent({
  props: { visible: { type: Boolean, default: false } },
  emits: ['update:visible', 'hide'],
  setup(props, { slots }) {
    return () => (props.visible ? h('div', { class: 'dialog-stub' }, slots.default?.()) : null);
  },
});

describe('GeneratedDocumentIndexDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateIndex.mockResolvedValue(new DataSuccess({ data: GeneratedDocumentIndexModel.example }));
    saveIndex.mockResolvedValue(new DataSuccess({}));
  });

  it('edits, updates and saves the generated index', async () => {
    const wrapper = mount(GeneratedDocumentIndexDialog, {
      props: {
        visible: true,
        documentId: 17,
        generatedIndex: GeneratedDocumentIndexModel.example,
      },
      global: { stubs: { Dialog: DialogStub } },
    });

    expect(wrapper.text()).toContain('Economic Resources and Activities');
    expect(wrapper.text()).toContain('document_index.needs_admin_review');
    expect(wrapper.text()).toContain('document_index.no_review');
    await wrapper.find('.document-index-generated__secondary-action').trigger('click');
    expect(wrapper.findAll('.document-index-generated input').length).toBeGreaterThan(0);

    await wrapper.find('.document-index-generated__save-action').trigger('click');
    await flushPromises();
    expect(updateIndex).toHaveBeenCalledOnce();

    await wrapper.find('.document-index-generated__save-action').trigger('click');
    await flushPromises();
    expect(saveIndex).toHaveBeenCalledOnce();
    expect(wrapper.emitted('saved')?.[0]?.[0]).toMatchObject({ documentId: 17 });
  });

  it('renders the fetched subject and all recursive children as table rows', () => {
    const fetchedIndex = GeneratedDocumentIndexModel.fromJson({
      book_id: 61,
      book_status: 'completed',
      subject: {
        id: 380,
        title: 'علوم',
        inference_level: 'explicit',
        source_pages: { start: 56, end: 68 },
        children: [
          {
            id: 381,
            title: 'التفاعلات الكيميائية',
            inference_level: 'explicit',
            source_pages: { start: 62, end: 108 },
            Needs_Admn_Review: true,
            children: [
              {
                id: 385,
                title: 'أنواع التفاعلات الكيميائية',
                inference_level: 'inferred',
                source_pages: { start: 64, end: 72 },
                children: [],
              },
            ],
          },
        ],
      },
    });

    const wrapper = mount(GeneratedDocumentIndexDialog, {
      props: {
        visible: true,
        documentId: 61,
        generatedIndex: fetchedIndex,
      },
      global: { stubs: { Dialog: DialogStub } },
    });

    expect(wrapper.findAll('tbody tr')).toHaveLength(3);
    expect(wrapper.text()).toContain('علوم');
    expect(wrapper.text()).toContain('التفاعلات الكيميائية');
    expect(wrapper.text()).toContain('أنواع التفاعلات الكيميائية');
    expect(wrapper.text()).toContain('explicit');
    expect(wrapper.text()).toContain('inferred');
    expect(wrapper.text()).toContain('document_index.needs_review');
  });
});
