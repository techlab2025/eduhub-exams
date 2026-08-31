/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import DocumentIndexProgressController from '../../controllers/document.index.progress.controller';
import DocumentIndex from '../DocumentIndex.vue';

const fetchEducationClassifications = vi.fn();
const fetchBranches = vi.fn();
const fetchSubjects = vi.fn();
const fetchDocuments = vi.fn();
const startIndex = vi.fn();

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

vi.mock('../../controllers/document.index.patch.controller', () => ({
  default: {
    getInstance: () => ({ startIndex }),
  },
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: { toastSuccess: vi.fn() },
}));

vi.mock('@/assets/images/Book Cover Design 1.png', () => ({
  default: 'default-document-cover.png',
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

const mountDocumentIndex = () =>
  mount(DocumentIndex, {
    global: {
      stubs: {
        UpdatedCustomInputSelect: SelectStub,
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
  const progressController = DocumentIndexProgressController.getInstance();

  beforeEach(() => {
    vi.clearAllMocks();
    progressController.reset();
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
    startIndex.mockResolvedValue(new DataSuccess({ data: 12 }));
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

  it('uses the default cover for missing and failed document images', async () => {
    documentListData.value = [
      {
        id: 17,
        title: 'Document without image',
        RefNumber: 'DOC-17',
        doecumentType: { id: 1, title: 'Book' },
        description: '',
        image: '',
        file: '',
        indexFile: '',
        hasIndex: false,
        tranaslations: {},
      },
      {
        id: 18,
        title: 'Document with failed image',
        RefNumber: 'DOC-18',
        doecumentType: { id: 1, title: 'Book' },
        description: '',
        image: 'https://example.com/missing-cover.png',
        file: '',
        indexFile: '',
        hasIndex: false,
        tranaslations: {},
      },
    ];
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);

    const images = wrapper.findAll('.document-index-page__thumbnail img');
    expect(images[0]?.attributes('src')).toBe('default-document-cover.png');
    expect(images[1]?.attributes('src')).toBe('https://example.com/missing-cover.png');

    await images[1]?.trigger('error');
    expect(images[1]?.attributes('src')).toBe('default-document-cover.png');
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

  it('keeps progress available only while start_document_index is pending', async () => {
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
    let resolveStart: ((result: DataSuccess<number>) => void) | undefined;
    startIndex.mockReturnValueOnce(
      new Promise<DataSuccess<number>>((resolve) => {
        resolveStart = resolve;
      }),
    );
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);
    await wrapper.find('.document-index-page__result-button').trigger('click');
    await flushPromises();

    expect(startIndex.mock.calls[0]?.[0].toMap()).toEqual({
      document_id: 17,
      auto_generate: false,
    });
    expect(progressController.generationDialogVisible.value).toBe(true);
    expect('indexingProgress' in progressController).toBe(false);
    expect(progressController.hasActiveIndexing.value).toBe(true);

    progressController.minimize();
    expect(progressController.generationDialogVisible.value).toBe(false);
    expect(progressController.hasActiveIndexing.value).toBe(true);

    progressController.openActiveProgress();
    expect(progressController.generationDialogVisible.value).toBe(true);

    resolveStart?.(new DataSuccess({ data: 12 }));
    await flushPromises();

    expect(progressController.generationDialogVisible.value).toBe(false);
    expect(progressController.hasActiveIndexing.value).toBe(false);
    expect(fetchDocuments).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it('opens the AI dialog immediately while the start request is pending', async () => {
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
    let resolveStart: ((result: DataSuccess<number>) => void) | undefined;
    startIndex.mockReturnValueOnce(
      new Promise<DataSuccess<number>>((resolve) => {
        resolveStart = resolve;
      }),
    );
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);

    await wrapper.find('.document-index-page__result-button').trigger('click');

    expect(progressController.generationDialogVisible.value).toBe(true);
    expect(progressController.startingDocumentId.value).toBe(17);

    resolveStart?.(new DataSuccess({ data: 12 }));
    await flushPromises();

    expect(progressController.generationDialogVisible.value).toBe(false);
    expect(progressController.startingDocumentId.value).toBeUndefined();
    expect(fetchDocuments).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it('does not render the generated-index action while status checking is unavailable', async () => {
    documentListData.value = [
      {
        id: 17,
        title: 'Indexed book',
        RefNumber: 'DOC-17',
        doecumentType: { id: 1, title: 'Book' },
        description: 'Student book',
        image: '',
        file: '/book.pdf',
        indexFile: '/book-index.pdf',
        hasIndex: true,
        indexPatchId: 42,
        indexStatus: 2,
        tranaslations: {},
      },
    ];
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);

    expect(wrapper.find('.document-index-page__result-button--outline').exists()).toBe(false);
    expect(startIndex).not.toHaveBeenCalled();
  });
});
