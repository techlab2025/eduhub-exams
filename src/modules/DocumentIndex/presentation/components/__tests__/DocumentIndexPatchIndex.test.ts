/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { DocumentIndexPatchStatusEnum } from '../../../core/constant/document.index.patch.status.enum';
import DocumentIndexPatchModel from '../../../core/models/document.index.patch.model';
import DocumentIndexStatusModel from '../../../core/models/document.index.status.model';
import GeneratedDocumentIndexModel from '../../../core/models/generated.document.index.model';
import DocumentIndexPatchIndex from '../DocumentIndexPatchIndex.vue';

const fetchList = vi.fn();
const checkStatus = vi.fn();
const startIndex = vi.fn();
const listState = ref(
  new DataSuccess({
    data: [
      DocumentIndexPatchModel.fromJson({
        id: 1,
        document_id: 11,
        employee: { name: 'Employee One' },
        created_by: { name: 'Admin One' },
        created_at: '2026-08-26 10:00:00',
        status: 1,
        is_apply: false,
      }),
      DocumentIndexPatchModel.fromJson({
        id: 2,
        document_id: 12,
        employee: { name: 'Employee Two' },
        created_by: { name: 'Admin Two' },
        created_at: '2026-08-26 11:00:00',
        status: 3,
        is_apply: false,
      }),
      DocumentIndexPatchModel.fromJson({
        id: 3,
        document_id: 13,
        employee: { name: 'Employee Three' },
        created_by: { name: 'Admin Three' },
        created_at: '2026-08-26 12:00:00',
        status: 2,
        is_apply: true,
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
      checkStatus,
      startIndex,
    }),
  },
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: { toastSuccess: vi.fn() },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: ref('en') }),
}));

const GeneratedDialogStub = defineComponent({
  name: 'GeneratedDocumentIndexDialog',
  props: {
    visible: { type: Boolean, default: false },
    documentId: { type: Number, default: 0 },
  },
  emits: ['update:visible', 'saved'],
  setup(props) {
    return () =>
      props.visible
        ? h('div', { 'data-testid': 'generated-dialog' }, String(props.documentId))
        : null;
  },
});

const mountPage = () =>
  mount(DocumentIndexPatchIndex, {
    global: { stubs: { GeneratedDocumentIndexDialog: GeneratedDialogStub } },
  });

describe('DocumentIndexPatchIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchList.mockResolvedValue(listState.value);
    startIndex.mockResolvedValue(new DataSuccess({}));
    checkStatus.mockResolvedValue(
      new DataSuccess({
        data: new DocumentIndexStatusModel({
          status: DocumentIndexPatchStatusEnum.COMPLETE,
          isApply: true,
          documentId: 13,
          generatedIndex: GeneratedDocumentIndexModel.example,
        }),
      }),
    );
  });

  it('renders patch jobs with status actions and fetches the list endpoint', async () => {
    const wrapper = mountPage();
    await flushPromises();

    expect(fetchList).toHaveBeenCalledOnce();
    expect(fetchList.mock.calls[0]?.[0].toMap()).toMatchObject({
      with_pagination: 1,
      page: 1,
      per_page: 10,
    });
    expect(wrapper.text()).toContain('Employee One');
    expect(wrapper.text()).toContain('document_index.status_in_progress');
    expect(wrapper.text()).toContain('document_index.status_failed');
    expect(wrapper.find('[data-patch-id="2"]').text()).toBe('document_index.restart');
  });

  it('opens the generated index dialog when the checked job is complete and applied', async () => {
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.find('[data-patch-id="3"]').trigger('click');
    await flushPromises();

    expect(checkStatus.mock.calls[0]?.[0].toMap()).toEqual({ id: 3 });
    expect(wrapper.find('[data-testid="generated-dialog"]').text()).toBe('13');
  });

  it('restarts failed unapplied jobs with their document id', async () => {
    const wrapper = mountPage();
    await flushPromises();

    await wrapper.find('[data-patch-id="2"]').trigger('click');
    await flushPromises();

    expect(startIndex.mock.calls[0]?.[0].toMap()).toEqual({ document_id: 12 });
    expect(fetchList).toHaveBeenCalledTimes(2);
  });
});
