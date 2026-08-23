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
    getInstance: () => ({ generateIndex }),
  },
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
          document_id: 17,
          items: [
            {
              id: 1,
              level: 'Unit',
              title: 'Unit 1 — Reading',
              from_pdf: 1,
              to_pdf: 64,
              printed_page_label: '1-64',
              needs_admin_review: false,
            },
          ],
        }),
      }),
    );
  });

  it('loads the curriculum and renders four custom selects', async () => {
    const wrapper = mountDocumentIndex();
    await flushPromises();

    expect(fetchStages).toHaveBeenCalledOnce();
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(4);
  });

  it('sends only the selected subject-child filter', async () => {
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
    expect(params.toMap()).toMatchObject({ e_c_subject_child_id: 308 });
    expect(params.toMap()).not.toHaveProperty('e_c_subject_id');
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
      expect.objectContaining({ signal: expect.any(AbortSignal), useStaticData: true }),
    );
    expect(wrapper.text()).toContain('document_index.generated_title');
    expect(wrapper.text()).toContain('Unit 1 — Reading');

    await wrapper.find('.document-index-generated__secondary-action').trigger('click');
    expect(wrapper.findAll('.document-index-generated input')).toHaveLength(4);
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
