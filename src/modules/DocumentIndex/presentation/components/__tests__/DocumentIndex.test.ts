/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GeneratedDocumentIndexModel from '../../../core/models/generated.document.index.model';
import DocumentIndex from '../DocumentIndex.vue';

const fetchEducationClassifications = vi.fn();
const fetchBranches = vi.fn();
const fetchSubjects = vi.fn();
const fetchDocuments = vi.fn();
const generateIndex = vi.fn();
const updateIndex = vi.fn();
const saveIndex = vi.fn();

const documentListData = ref<Record<string, unknown>[]>([]);

vi.mock('@/modules/EducationClassification', () => ({
  EducationClassificationController: {
    getInstance: () => ({ fetchList: fetchEducationClassifications }),
  },
}));

vi.mock('@/modules/Subjects/presentation/controllers/subject.controller', () => ({
  default: {
    getInstance: () => ({ fetchList: fetchBranches }),
  },
}));

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationSubject/education.subject.item.controller',
  () => ({
    default: {
      getInstance: () => ({ fetchList: fetchSubjects }),
    },
  }),
);

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
  await wrapper
    .findAllComponents(SelectStub)[0]
    ?.vm.$emit('update:modelValue', { id: 128, title: 'Governmental' });
  await flushPromises();
  await wrapper
    .findAllComponents(SelectStub)[1]
    ?.vm.$emit('update:modelValue', { id: 361, title: 'Primary' });
  await flushPromises();
  await wrapper
    .findAllComponents(SelectStub)[2]
    ?.vm.$emit('update:modelValue', { id: 284, title: 'Arabic' });
  await flushPromises();
  await wrapper.find('.document-index-page__show-results').trigger('click');
  await flushPromises();
};

describe('DocumentIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    documentListData.value = [];
    fetchEducationClassifications.mockResolvedValue(
      new DataSuccess({
        data: [{ id: 128, title: 'Governmental' }],
      }),
    );
    fetchBranches.mockResolvedValue(
      new DataSuccess({
        data: [{ id: 361, e_c_branch_id: 361, title: 'Primary', children: [] }],
      }),
    );
    fetchSubjects.mockImplementation((params) => {
      const { parent_id: parentId } = params.toMap();
      if (parentId === 284) {
        return Promise.resolve(
          new DataSuccess({
            data: [{ subject_id: 308, subject_title: 'Unit 1', has_children: true }],
          }),
        );
      }
      if (parentId === 308) {
        return Promise.resolve(
          new DataSuccess({
            data: [{ subject_id: 309, subject_title: 'Lesson 1', has_children: false }],
          }),
        );
      }
      if (parentId === 309) return Promise.resolve(new DataSuccess({ data: [] }));
      return Promise.resolve(
        new DataSuccess({
          data: [{ subject_id: 284, subject_title: 'Arabic', has_children: true }],
        }),
      );
    });
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

  it('loads all education classifications and renders the three base selects', async () => {
    const wrapper = mountDocumentIndex();
    await flushPromises();

    expect(fetchEducationClassifications).toHaveBeenCalledOnce();
    expect(fetchEducationClassifications.mock.calls[0]?.[0].toMap()).toMatchObject({
      with_pagination: 0,
      page: 1,
      per_page: 100,
    });
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(3);
  });

  it('loads branches and every available subject level with dependent ids', async () => {
    const wrapper = mountDocumentIndex();
    await flushPromises();

    await wrapper
      .findAllComponents(SelectStub)[0]
      ?.vm.$emit('update:modelValue', { id: 128, title: 'Governmental' });
    await flushPromises();
    expect(fetchBranches.mock.calls[0]?.[0].toMap()).toMatchObject({
      education_classification_id: 128,
    });

    await wrapper
      .findAllComponents(SelectStub)[1]
      ?.vm.$emit('update:modelValue', { id: 361, title: 'Primary' });
    await flushPromises();
    expect(fetchSubjects.mock.calls[0]?.[0].toMap()).toEqual({
      education_classification_branch_id: 361,
    });

    await wrapper
      .findAllComponents(SelectStub)[2]
      ?.vm.$emit('update:modelValue', { id: 284, title: 'Arabic' });
    await flushPromises();
    expect(fetchSubjects.mock.calls[1]?.[0].toMap()).toEqual({
      education_classification_branch_id: 361,
      parent_id: 284,
    });
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(4);

    await wrapper
      .findAllComponents(SelectStub)[3]
      ?.vm.$emit('update:modelValue', { id: 308, title: 'Unit 1' });
    await flushPromises();
    expect(fetchSubjects.mock.calls[2]?.[0].toMap()).toEqual({
      education_classification_branch_id: 361,
      parent_id: 308,
    });
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(5);

    await wrapper
      .findAllComponents(SelectStub)[4]
      ?.vm.$emit('update:modelValue', { id: 309, title: 'Lesson 1' });
    await flushPromises();
    expect(fetchSubjects.mock.calls[3]?.[0].toMap()).toEqual({
      education_classification_branch_id: 361,
      parent_id: 309,
    });
    expect(wrapper.findAllComponents(SelectStub)).toHaveLength(5);
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

    await wrapper
      .findAllComponents(SelectStub)[0]
      ?.vm.$emit('update:modelValue', { id: 128, title: 'Governmental' });
    await flushPromises();
    await wrapper
      .findAllComponents(SelectStub)[1]
      ?.vm.$emit('update:modelValue', { id: 361, title: 'Primary' });
    await flushPromises();
    await wrapper
      .findAllComponents(SelectStub)[2]
      ?.vm.$emit('update:modelValue', { id: 284, title: 'Arabic' });
    await flushPromises();
    await wrapper
      .findAllComponents(SelectStub)[3]
      ?.vm.$emit('update:modelValue', { id: 308, title: 'Unit 1' });
    await flushPromises();
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
