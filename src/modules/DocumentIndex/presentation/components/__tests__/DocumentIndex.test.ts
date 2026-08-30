/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import DocumentIndex from '../DocumentIndex.vue';

const fetchEducationClassifications = vi.fn();
const fetchBranches = vi.fn();
const fetchSubjects = vi.fn();
const fetchDocuments = vi.fn();
const startIndex = vi.fn();
const checkStatus = vi.fn();

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
    getInstance: () => ({ startIndex, checkStatus }),
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
  props: {
    visible: { type: Boolean, default: false },
    documentId: { type: Number, default: 0 },
    generatedIndex: { type: Object, default: null },
  },
  emits: ['update:visible'],
  setup(props) {
    return () =>
      props.visible
        ? h('div', {
            'data-testid': 'generated-index-dialog',
            'data-document-id': props.documentId,
          })
        : null;
  },
});

const mountDocumentIndex = () =>
  mount(DocumentIndex, {
    global: {
      stubs: {
        UpdatedCustomInputSelect: SelectStub,
        Dialog: DialogStub,
        GeneratedDocumentIndexDialog: GeneratedDialogStub,
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

  it('starts indexing in the AI dialog and collapses it into the result action', async () => {
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

    expect(startIndex.mock.calls[0]?.[0].toMap()).toEqual({
      document_id: 17,
      auto_generate: false,
    });
    expect(wrapper.find('.document-index-generation').exists()).toBe(true);
    expect(wrapper.find('.document-index-page__indexing-action').exists()).toBe(false);

    await wrapper.find('.document-index-generation__minimize').trigger('click');
    expect(wrapper.find('.document-index-generation').exists()).toBe(false);
    expect(wrapper.find('.document-index-page__indexing-action').text()).toContain(
      'document_index.ai_indexing',
    );

    await wrapper.find('.document-index-page__indexing-action button').trigger('click');
    await flushPromises();
    expect(checkStatus.mock.calls[0]?.[0].toMap()).toEqual({ id: 12 });
    expect(wrapper.find('.document-index-generation').exists()).toBe(true);
    expect(wrapper.find('.document-index-page__indexing-action').exists()).toBe(false);
    wrapper.unmount();
  });

  it('opens the cancel confirmation and returns to the AI dialog when indexing is kept', async () => {
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

    await wrapper.find('.document-index-generation__cancel').trigger('click');
    expect(wrapper.find('.document-index-cancel').exists()).toBe(true);

    await wrapper.find('.document-index-cancel__keep').trigger('click');
    expect(wrapper.find('.document-index-cancel').exists()).toBe(false);
    expect(wrapper.find('.document-index-generation').exists()).toBe(true);

    await wrapper.find('.document-index-generation__cancel').trigger('click');
    await wrapper.find('.document-index-cancel__confirm').trigger('click');
    expect(wrapper.find('.document-index-generation').exists()).toBe(false);
    expect(wrapper.find('.document-index-cancel').exists()).toBe(false);
    expect(wrapper.find('.document-index-page__result-button').text()).toBe(
      'document_index.generate_index',
    );
    wrapper.unmount();
  });

  it('checks a completed index and opens the existing generated index dialog', async () => {
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
    checkStatus.mockResolvedValueOnce(
      new DataSuccess({
        data: {
          status: 2,
          isApply: true,
          documentId: 17,
          generatedIndex: { editableItems: [] },
        },
      }),
    );
    const wrapper = mountDocumentIndex();
    await flushPromises();
    await selectCurriculumAndShowResults(wrapper);

    await wrapper.find('.document-index-page__result-button--outline').trigger('click');
    await flushPromises();

    expect(checkStatus.mock.calls[0]?.[0].toMap()).toEqual({ id: 42 });
    expect(
      wrapper.find('[data-testid="generated-index-dialog"]').attributes('data-document-id'),
    ).toBe('17');
  });
});
