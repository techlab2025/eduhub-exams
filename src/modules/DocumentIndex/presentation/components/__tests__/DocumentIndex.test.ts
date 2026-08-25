/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GeneratedDocumentIndexModel from '../../../core/models/generated.document.index.model';
import DocumentIndex from '../DocumentIndex.vue';

const fetchStages = vi.fn();
const fetchDocuments = vi.fn();
const generateIndex = vi.fn();
const updateIndex = vi.fn();
const saveIndex = vi.fn();

const stageData = ref([
  {
    id: 128,
    title: 'Governmental',
    branches: [
      {
        id: 361,
        title: 'Primary',
        children: [],
        subjects: [
          {
            id: 284,
            e_c_subject_id: 284,
            title: 'Arabic',
            children: [{ id: 308, e_c_subject_id: 308, title: 'Unit 1', children: [] }],
          },
        ],
      },
    ],
  },
]);
const documentListData = ref<Record<string, unknown>[]>([]);

vi.mock('@/modules/Stages/presentation/controllers/stage.controller', () => ({
  default: {
    getInstance: () => ({ fetchList: fetchStages, listData: stageData }),
  },
}));

vi.mock('@/modules/document/presentation/controllers/document.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList: fetchDocuments,
      listData: documentListData,
      isListLoading: () => false,
      isListFailed: () => false,
    }),
  },
}));

vi.mock('../../controllers/document.index.controller', () => ({
  default: {
    getInstance: () => ({ generateIndex, updateIndex, saveIndex }),
  },
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: { toastSuccess: vi.fn() },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const SelectStub = defineComponent({
  name: 'UpdatedCustomInputSelect',
  props: {
    id: { type: String, default: '' },
    staticOptions: { type: Array, default: () => [] },
    modelValue: { type: Object, default: null },
  },
  emits: ['update:modelValue', 'reload'],
  setup(props) {
    return () => h('div', { 'data-id': props.id });
  },
});

const DialogStub = defineComponent({
  name: 'PrimeDialogStub',
  props: {
    visible: { type: Boolean, default: false },
  },
  emits: ['update:visible', 'hide'],
  setup(props, { slots }) {
    return () => (props.visible ? h('div', { class: 'dialog-stub' }, slots.default?.()) : null);
  },
});

const mountDocumentIndex = () =>
  mount(DocumentIndex, {
    global: {
      stubs: {
        UpdatedCustomInputSelect: SelectStub,
        Dialog: DialogStub,
      },
    },
  });

const selectCurriculumAndShowResults = async (wrapper: ReturnType<typeof mountDocumentIndex>) => {
  const selects = wrapper.findAllComponents(SelectStub);
  await selects[0]?.vm.$emit('update:modelValue', { id: 128, title: 'Governmental' });
  await selects[1]?.vm.$emit('update:modelValue', { id: 361, title: 'Primary' });
  await selects[2]?.vm.$emit('update:modelValue', { id: 284, title: 'Arabic' });
  await wrapper.find('.document-index-page__show-results').trigger('click');
  await flushPromises();
};

describe('DocumentIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    documentListData.value = [];
    generateIndex.mockResolvedValue(
      new DataSuccess({
        data: GeneratedDocumentIndexModel.fromJson({
          book_id: 10,
          book_status: 'completed',
          chapters: [
            {
              id: 22,
              number: '1',
              title: 'Chapter 1 — Reading',
              source_pages: { start: 1, end: 64 },
              lessons: [
                {
                  id: 84,
                  number: '1',
                  title: 'Lesson 1 — Reading',
                  source_pages: { start: 4, end: 13 },
                  topics: [
                    {
                      id: 221,
                      title: 'Reading topic',
                      source_pages: { start: 5, end: 6 },
                    },
                  ],
                },
              ],
            },
          ],
        }),
      }),
    );
    updateIndex.mockResolvedValue(new DataSuccess({ data: GeneratedDocumentIndexModel.example }));
    saveIndex.mockResolvedValue(new DataSuccess({}));
  });

  it('loads the curriculum and renders four custom selects', async () => {
    const wrapper = mountDocumentIndex();
    await flushPromises();

    expect(fetchStages).toHaveBeenCalledOnce();
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(4);
  });

  it('sends the selected subject as the e_c_subject_id filter', async () => {
    const wrapper = mountDocumentIndex();
    await flushPromises();

    await selectCurriculumAndShowResults(wrapper);

    expect(fetchDocuments).toHaveBeenCalledOnce();
    const params = fetchDocuments.mock.calls[0]?.[0];
    expect(params.toMap()).toMatchObject({ e_c_subject_id: 284 });
  });

  it('replaces the subject filter with the selected subject configuration', async () => {
    const wrapper = mountDocumentIndex();
    await flushPromises();

    const selects = wrapper.findAllComponents(SelectStub);
    await selects[0]?.vm.$emit('update:modelValue', { id: 128, title: 'Governmental' });
    await selects[1]?.vm.$emit('update:modelValue', { id: 361, title: 'Primary' });
    await selects[2]?.vm.$emit('update:modelValue', { id: 284, title: 'Arabic' });
    await selects[3]?.vm.$emit('update:modelValue', { id: 308, title: 'Arabic → Unit 1' });
    await wrapper.find('.document-index-page__show-results').trigger('click');

    expect(fetchDocuments).toHaveBeenCalledOnce();
    const params = fetchDocuments.mock.calls[0]?.[0];
    expect(params.toMap()).toMatchObject({ e_c_subject_id: 308 });
  });

  it('opens generated data and switches table rows into edit mode', async () => {
    documentListData.value = [
      {
        id: 17,
        title: 'Arabic student book',
        RefNumber: 'DOC-17',
        doecumentType: { id: 1, title: 'Book' },
        description: 'Student book',
        image: '',
        file: '/book.pdf',
        indexFile: '',
        hasIndex: false,
        tranaslations: {},
      },
    ];
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);
    await wrapper.find('.document-index-page__result-button').trigger('click');
    await flushPromises();

    expect(generateIndex).toHaveBeenCalledWith(
      expect.objectContaining({ documentId: 17 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(wrapper.text()).toContain('document_index.generated_title');
    expect(wrapper.text()).toContain('Chapter 1 — Reading');
    expect(wrapper.text()).toContain('Reading topic');

    await wrapper.find('.document-index-generated__secondary-action').trigger('click');
    expect(wrapper.findAll('.document-index-generated input')).toHaveLength(12);

    await wrapper.find('.document-index-generated__save-action').trigger('click');
    await flushPromises();
    expect(updateIndex).toHaveBeenCalledOnce();

    await wrapper.find('.document-index-generated__save-action').trigger('click');
    await flushPromises();
    expect(saveIndex).toHaveBeenCalledOnce();
  });

  it('aborts the long-running request when cancel indexing is pressed', async () => {
    documentListData.value = [
      {
        id: 17,
        title: 'Arabic student book',
        RefNumber: 'DOC-17',
        doecumentType: { id: 1, title: 'Book' },
        description: '',
        image: '',
        file: '',
        indexFile: '',
        hasIndex: false,
        tranaslations: {},
      },
    ];
    generateIndex.mockReturnValue(new Promise(() => undefined));
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);
    await wrapper.find('.document-index-page__result-button').trigger('click');

    const options = generateIndex.mock.calls[0]?.[1];
    expect(options.signal.aborted).toBe(false);
    await wrapper.find('.document-index-generation button').trigger('click');
    expect(options.signal.aborted).toBe(true);
    expect(wrapper.find('.document-index-generation').exists()).toBe(false);
  });
});
