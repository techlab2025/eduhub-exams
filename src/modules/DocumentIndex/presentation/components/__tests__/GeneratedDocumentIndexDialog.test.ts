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
        transactionId: 'TXN-012',
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
    expect(updateIndex.mock.calls[0]?.[0].toMap()).toMatchObject({
      transaction_id: 'TXN-012',
      rows: [
        {
          id: 22,
          type: 'chapter',
          level: 'explicit',
          title: 'Economic Resources and Activities',
          from_pdf: 7,
          to_pdf: 31,
          printed_page_label: '7-31',
        },
        expect.any(Object),
        expect.any(Object),
      ],
    });

    await wrapper.find('.document-index-generated__save-action').trigger('click');
    await flushPromises();
    expect(saveIndex).toHaveBeenCalledOnce();
    expect(saveIndex.mock.calls[0]?.[0].toMap()).toMatchObject({
      transaction_id: 'TXN-012',
      rows: expect.any(Array),
    });
    expect(saveIndex.mock.calls[0]?.[0].toMap().rows).toHaveLength(3);
    expect(wrapper.emitted('saved')?.[0]?.[0]).toMatchObject({ documentId: 17 });
  });

  it('renders and submits the fetched hierarchy with its backend row types', async () => {
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
        transactionId: 'TXN-061',
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

    await wrapper.find('.document-index-generated__secondary-action').trigger('click');
    await wrapper.find('.document-index-generated__save-action').trigger('click');
    await flushPromises();

    expect(updateIndex.mock.calls[0]?.[0].toMap()).toMatchObject({
      rows: [
        { id: 380, type: 'subject' },
        { id: 381, type: 'subject' },
        { id: 385, type: 'topic' },
      ],
    });
  });
});
