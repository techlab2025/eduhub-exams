/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref, type PropType } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { DocumentIndexPatchStatusEnum } from '../../../core/constant/document.index.patch.status.enum';
import DocumentIndexPatchModel from '../../../core/models/document.index.patch.model';
import DocumentIndexStatusModel from '../../../core/models/document.index.status.model';
import GeneratedDocumentIndexModel from '../../../core/models/generated.document.index.model';
import DocumentIndexPatchIndex from '../DocumentIndexPatchIndex.vue';

const fetchList = vi.fn();
const refreshStatus = vi.fn();
const fetchDocumentIndex = vi.fn();
const openProgress = vi.fn();
const listState = ref(
  new DataSuccess({
    data: [
      DocumentIndexPatchModel.fromJson({
        document_id: 11,
        transaction_id: 'TXN-001',
        education_type: { title: 'Governmental' },
        subject: { title: 'English' },
        subject_configuration: { title: 'Unit' },
        document: { id: 11, title: 'English Book' },
        created_by: { name: 'Admin One' },
        created_at: '2026-08-26 10:00:00',
        status: 1,
        is_apply: false,
      }),
      DocumentIndexPatchModel.fromJson({
        document_id: 12,
        transaction_id: 'TXN-002',
        education_type: { title: 'Governmental' },
        subject: { title: 'Arabic' },
        subject_configuration: { title: 'Lesson' },
        document: { id: 12, title: 'Arabic Book' },
        created_by: { name: 'Admin Two' },
        created_at: '2026-08-26 11:00:00',
        status: 3,
        is_apply: false,
      }),
      DocumentIndexPatchModel.fromJson({
        document_id: 13,
        transaction_id: 'TXN-003',
        education_type: { title: 'Governmental' },
        subject: { title: 'Arabic' },
        subject_configuration: { title: 'Chapter' },
        document: { id: 13, title: 'Arabic Student Book' },
        created_by: { name: 'Admin Three' },
        created_at: '2026-08-26 12:00:00',
        status: 2,
        applied: true,
        generated_index: {
          book_id: 13,
          book_status: 'completed',
          chapters: [],
        },
      }),
      DocumentIndexPatchModel.fromJson({
        document_id: 14,
        transaction_id: 'TXN-004',
        education_type: { title: 'Governmental' },
        subject: { title: 'Science' },
        subject_configuration: { title: 'Unit' },
        document: { id: 14, title: 'Science Book' },
        created_by: { name: 'Admin Four' },
        created_at: '2026-08-26 13:00:00',
        status: 2,
        applied: false,
      }),
    ],
  }),
);

vi.mock('../../controllers/document.index.patch.controller', () => ({
  default: {
    getInstance: () => ({
      listState,
      pagination: ref(null),
      fetchList,
      refreshStatus,
    }),
  },
}));

vi.mock('../../controllers/document.index.progress.controller', () => ({
  default: {
    getInstance: () => ({ openProgress }),
  },
}));

vi.mock('../../controllers/document.index.controller', () => ({
  default: {
    getInstance: () => ({ fetchIndex: fetchDocumentIndex }),
  },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: ref('en') }),
}));

const GeneratedDialogStub = defineComponent({
  name: 'GeneratedDocumentIndexDialog',
  props: {
    visible: { type: Boolean, default: false },
    documentId: { type: Number, default: 0 },
    generatedIndex: { type: Object, default: null },
  },
  emits: ['update:visible', 'saved'],
  setup(props) {
    return () =>
      props.visible
        ? h(
            'div',
            { 'data-testid': 'generated-dialog' },
            `${props.documentId}:${String(props.generatedIndex?.bookId ?? '')}`,
          )
        : null;
  },
});

const DropListStub = defineComponent({
  name: 'DropList',
  props: {
    actionList: {
      type: Array as PropType<Array<{ text: string; action?: () => void }>>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          class: 'drop-list-stub',
          type: 'button',
          onClick: () => props.actionList[0]?.action?.(),
        },
        props.actionList[0]?.text,
      );
  },
});

const mountPage = () =>
  mount(DocumentIndexPatchIndex, {
    global: {
      stubs: {
        DropList: DropListStub,
        GeneratedDocumentIndexDialog: GeneratedDialogStub,
      },
    },
  });

describe('DocumentIndexPatchIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchList.mockResolvedValue(listState.value);
    refreshStatus.mockResolvedValue(
      new DataSuccess({
        data: new DocumentIndexStatusModel({
          status: DocumentIndexPatchStatusEnum.COMPLETE,
          isApply: true,
          documentId: 14,
          generatedIndex: GeneratedDocumentIndexModel.example,
        }),
      }),
    );
    fetchDocumentIndex.mockResolvedValue(
      new DataSuccess({ data: GeneratedDocumentIndexModel.example }),
    );
    openProgress.mockResolvedValue(undefined);
  });

  it('renders transaction details with the designed statuses and actions', async () => {
    const wrapper = mountPage();
    await flushPromises();

    expect(fetchList).toHaveBeenCalledOnce();
    expect(fetchList.mock.calls[0]?.[0].toMap()).toMatchObject({
      with_pagination: 1,
      page: 1,
      per_page: 10,
    });
    expect(wrapper.text()).toContain('TXN-001');
    expect(wrapper.text()).toContain('Governmental');
    expect(wrapper.text()).toContain('English Book');
    expect(wrapper.text()).toContain('document_index.status_pending');
    expect(wrapper.text()).toContain('document_index.status_success');
    expect(wrapper.text()).toContain('document_index.status_failed');
    expect(wrapper.find('[data-transaction-id="TXN-001"]').text()).toBe(
      'document_index.view_progress',
    );
    expect(wrapper.find('[data-transaction-id="TXN-003"]').text()).toBe('view');
    expect(wrapper.find('[data-transaction-id="TXN-004"]').text()).toBe('document_index.refresh');
    expect(wrapper.find('[data-transaction-id="TXN-002"]').exists()).toBe(false);
    expect(wrapper.find('input[type="search"]').attributes('placeholder')).toBe(
      'document_index.transaction_search_placeholder',
    );
    expect(wrapper.get('.document-index-patch-page__table').attributes()).toMatchObject({
      role: 'region',
      tabindex: '0',
      'aria-label': 'document_index.patches_title',
    });
    expect(wrapper.get('.document-index-patch-page__table .table-responsive').exists()).toBe(true);
  });

  it('opens the AI progress dialog from a pending transaction', async () => {
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.find('[data-transaction-id="TXN-001"] .drop-list-stub').trigger('click');

    expect(openProgress).toHaveBeenCalledOnce();
  });

  it('fetches the document index details before opening the completed transaction', async () => {
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.find('[data-transaction-id="TXN-003"] .drop-list-stub').trigger('click');
    await flushPromises();

    expect(fetchDocumentIndex.mock.calls[0]?.[0].toMap()).toEqual({
      transaction_id: 'TXN-003',
    });
    expect(wrapper.find('[data-testid="generated-dialog"]').text()).toBe('13:10');
  });

  it('searches the transaction endpoint by the entered term', async () => {
    vi.useFakeTimers();
    const wrapper = mountPage();

    try {
      await wrapper.find('input[type="search"]').setValue('TXN-001');
      vi.advanceTimersByTime(400);
      await flushPromises();

      const params = fetchList.mock.calls[fetchList.mock.calls.length - 1]?.[0];
      expect(params.toMap()).toMatchObject({ page: 1, word: 'TXN-001' });
    } finally {
      wrapper.unmount();
      vi.useRealTimers();
    }
  });

  it('refreshes only the selected transaction when rows do not have patch ids', async () => {
    refreshStatus.mockResolvedValueOnce(
      new DataSuccess({
        data: new DocumentIndexStatusModel({
          status: DocumentIndexPatchStatusEnum.IN_PROGRESS,
          isApply: false,
          documentId: 14,
          generatedIndex: GeneratedDocumentIndexModel.example,
        }),
      }),
    );
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.find('[data-transaction-id="TXN-004"] .drop-list-stub').trigger('click');
    await flushPromises();

    expect(refreshStatus.mock.calls[0]?.[0].toMap()).toEqual({ transaction_id: 'TXN-004' });
    expect(fetchList).toHaveBeenCalledTimes(2);
    expect(
      wrapper.findAll('.document-index-patch-page__status').map((status) => status.text()),
    ).toEqual([
      'document_index.status_pending',
      'document_index.status_failed',
      'document_index.status_success',
      'document_index.status_pending',
    ]);
    expect(wrapper.find('[data-transaction-id="TXN-004"]').text()).toBe(
      'document_index.view_progress',
    );
    expect(wrapper.find('[data-testid="generated-dialog"]').exists()).toBe(false);
  });
});
