import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DocumentForm from '../DocumentForm.vue';
import DocumentShowModel from '../../../core/models/document.show.model';
import type AddDocumentParams from '../../../core/params/add.document.params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import documentFormStyles from '../../styles/_document_form.scss?raw';
import globalStyles from '@/styles/main.scss?raw';
import compiledStyles from '@/styles/main.min.css?raw';

const toastWarningMock = vi.hoisted(() => vi.fn());
const { branchTree, fetchClassificationsMock, fetchBranchesMock, fetchSubjectsMock } = vi.hoisted(
  () => ({
    branchTree: [
      {
        id: 107,
        full_title: '123',
        children: [
          {
            id: 108,
            full_title: '123 -> 2',
            children: [
              { id: 109, full_title: '123 -> 2 -> 3', children: [] },
              { id: 172, full_title: '123 -> 2 -> test', children: [] },
            ],
          },
          {
            id: 148,
            full_title: '123 -> 5',
            children: [
              {
                id: 149,
                e_c_branch_id: 149,
                full_title: '123 -> 5 -> 6',
                children: [],
              },
            ],
          },
        ],
      },
    ],
    fetchClassificationsMock: vi.fn(),
    fetchBranchesMock: vi.fn(),
    fetchSubjectsMock: vi.fn(),
  }),
);

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    toastWarning: toastWarningMock,
  },
}));

vi.mock('@/modules/Subjects/presentation/controllers/subject.controller', () => ({
  default: {
    getInstance: () => ({ fetchList: fetchBranchesMock }),
  },
}));

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationSubject/education.subject.item.controller',
  () => ({
    default: {
      getInstance: () => ({ fetchList: fetchSubjectsMock }),
    },
  }),
);

vi.mock('@/modules/EducationClassification', () => ({
  EducationClassificationController: {
    getInstance: () => ({ fetchList: fetchClassificationsMock }),
  },
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    resolve: vi.fn(),
  }),
  useRoute: () => ({
    query: {},
    params: {},
  }),
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    push: vi.fn(),
    resolve: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    d: (date: unknown) => date,
    n: (number: unknown) => number,
  }),
}));

// Mock PrimeVue
vi.mock('primevue/config', () => ({
  usePrimeVue: () => ({
    config: { ripple: true },
  }),
}));

describe('DocumentForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    fetchClassificationsMock.mockResolvedValue(
      new DataSuccess({ data: [{ id: 42, title: 'Basic education' }] }),
    );
    fetchBranchesMock.mockResolvedValue(new DataSuccess({ data: branchTree }));
    fetchSubjectsMock.mockImplementation((params) => {
      const { parent_id: parentId } = params.toMap();
      if (parentId === 284) {
        return Promise.resolve(
          new DataSuccess({
            data: [
              {
                subject_id: 502,
                subject_title: 'Mathematics -> Algebra',
                has_children: false,
              },
            ],
          }),
        );
      }
      if (parentId === 502) {
        return Promise.resolve(
          new DataSuccess({
            data: [
              {
                subject_id: 700,
                subject_title: 'Linear equations',
                has_children: false,
              },
            ],
          }),
        );
      }
      if (parentId === 285 || parentId === 308) {
        return Promise.resolve(new DataSuccess({ data: [] }));
      }
      if (parentId === 700) return Promise.resolve(new DataSuccess({ data: [] }));
      return Promise.resolve(
        new DataSuccess({
          data: [
            { subject_id: 284, subject_title: 'mostafa 2', has_children: false },
            { subject_id: 308, subject_title: 'mostafa 2.1', has_children: false },
            { subject_id: 285, subject_title: 'mostafa 3', has_children: false },
          ],
        }),
      );
    });
  });

  it('renders without crashing', () => {
    const wrapper = mount(DocumentForm, {
      props: {
        formKey: 'add-document',
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: true,
          TransitionGroup: true,
          'router-link': true,
          'router-view': true,
          // PrimeVue
          DataTable: true,
          Column: true,
          Button: true,
          InputText: true,
          Dialog: true,
          Toast: true,
          Select: true,
          MultiSelect: true,
          Dropdown: true,
          FileUpload: true,
          Card: true,
          Accordion: true,
          AccordionTab: true,
          Tree: true,
          Breadcrumb: true,
        },
        mocks: {
          $t: (msg: string) => msg,
          $d: (d: unknown) => d,
          $n: (n: unknown) => n,
          $tc: (msg: string) => msg,
        },
        directives: {
          ripple: {},
          tooltip: {},
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('does not apply document select padding based on selection state', () => {
    const stateSpecificPaddingRules = [
      /\.input-select\s+\.selected-value\s*\{[^}]*padding:/s,
      /\.p-select-label\.p-placeholder\s*\{[^}]*padding:/s,
    ];

    for (const rule of stateSpecificPaddingRules) {
      expect(documentFormStyles).not.toMatch(rule);
      expect(globalStyles).not.toMatch(rule);
      expect(compiledStyles).not.toMatch(rule);
    }
  });

  it('emits the populated edit data without requiring a description change', () => {
    const wrapper = mount(DocumentForm, {
      props: {
        document: DocumentShowModel.example,
        formKey: 'edit-document-1',
      },
      global: {
        stubs: {
          UpdatedCustomInputSelect: true,
          MultiLangInput: true,
          HandleFilesUpload: true,
          DocumentIcon: true,
          DeleteTagIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const emittedParams = wrapper.emitted('updateData')?.[0]?.[0] as AddDocumentParams;

    expect(emittedParams).toBeTruthy();
    expect(emittedParams.translations.description).toEqual(DocumentShowModel.example.description);
  });

  it('marks removed edit assets with an asterisk and omits unchanged assets', async () => {
    const savedDocument = new DocumentShowModel({
      ...DocumentShowModel.example,
      images: 'https://cdn.example.test/cover.png',
      files: 'https://cdn.example.test/document.pdf',
    });
    const wrapper = mount(DocumentForm, {
      props: { document: savedDocument, formKey: 'edit-document-assets' },
      global: {
        stubs: {
          UpdatedCustomInputSelect: true,
          MultiLangInput: true,
          HandleFilesUpload: {
            name: 'HandleFilesUpload',
            props: ['index', 'file'],
            emits: ['change'],
            template: '<div class="file-upload-stub" />',
          },
          DocumentIcon: true,
          DeleteTagIcon: true,
        },
        mocks: { $t: (msg: string) => msg },
      },
    });
    await flushPromises();

    const unchangedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(unchangedParams.images).toBe('');
    expect(unchangedParams.files).toBe('');

    const uploadInputs = wrapper.findAllComponents({ name: 'HandleFilesUpload' });
    uploadInputs[0]?.vm.$emit('change', []);
    await wrapper.vm.$nextTick();
    const imageRemovedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(imageRemovedParams.images).toBe('*');
    expect(imageRemovedParams.files).toBe('');

    uploadInputs[1]?.vm.$emit('change', []);
    await wrapper.vm.$nextTick();
    const bothRemovedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(bothRemovedParams.images).toBe('*');
    expect(bothRemovedParams.files).toBe('*');
  });

  it('restores all dependent select values from the show-document response', async () => {
    const savedDocument = DocumentShowModel.fromJson({
      id: 10,
      title: [{ locale: 'en', title: 'Saved document' }],
      description: [{ locale: 'en', description: 'Saved description' }],
      reference_number: 'DOC-10',
      document_type: { id: 7, title: 'Guide' },
      stage: {
        id: 149,
        title: '123 -> 5 -> 6',
        education_classification: { id: 42, title: 'Basic education' },
      },
      subject: { id: 502, title: 'Algebra', parent_id: 284 },
      tags: [],
    });

    const wrapper = mount(DocumentForm, {
      props: { document: savedDocument, formKey: 'edit-document-10' },
      global: {
        stubs: {
          UpdatedCustomInputSelect: {
            name: 'UpdatedCustomInputSelect',
            props: ['id', 'modelValue', 'staticOptions', 'controller', 'params', 'disabled'],
            emits: ['update:modelValue'],
            template: '<div class="select-stub" />',
          },
          MultiLangInput: true,
          HandleFilesUpload: true,
        },
        mocks: { $t: (msg: string) => msg },
      },
    });

    await flushPromises();

    const getSelect = (id: string) => {
      const select = wrapper
        .findAllComponents({ name: 'UpdatedCustomInputSelect' })
        .find((item) => item.props('id') === id);
      if (!select) throw new Error(`Missing select: ${id}`);
      return select;
    };

    expect(getSelect('document-education-classification').props('modelValue')).toEqual(
      expect.objectContaining({ id: 42, title: 'Basic education' }),
    );
    expect(getSelect('document-branch').props('modelValue')).toEqual(
      expect.objectContaining({ id: 149, title: '123 -> 5 -> 6' }),
    );
    expect(getSelect('document-subject').props('modelValue')).toEqual(
      expect.objectContaining({ id: 284, title: 'mostafa 2' }),
    );
    expect(getSelect('document-subject-configuration').props('modelValue')).toEqual(
      expect.objectContaining({ id: 502, title: 'Mathematics -> Algebra' }),
    );
    expect(getSelect('document-subject-configuration-2').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 700, title: 'Linear equations' }),
    ]);
    expect(fetchSubjectsMock.mock.calls.map(([params]) => params.toMap())).toEqual([
      { education_classification_branch_id: 149 },
      { education_classification_branch_id: 149, parent_id: 284 },
      { education_classification_branch_id: 149, parent_id: 502 },
    ]);
  });

  it('restores every selected subject level for a deeply nested document subject', async () => {
    const savedDocument = DocumentShowModel.fromJson({
      id: 11,
      title: [{ locale: 'en', title: 'Nested subject document' }],
      description: [{ locale: 'en', description: 'Nested subject description' }],
      reference_number: 'DOC-11',
      document_type: { id: 7, title: 'Guide' },
      stage: {
        id: 149,
        title: '123 -> 5 -> 6',
        education_classification: { id: 42, title: 'Basic education' },
      },
      subject: { id: 700, title: 'Linear equations', parent_id: 502 },
      tags: [],
    });

    const wrapper = mount(DocumentForm, {
      props: { document: savedDocument, formKey: 'edit-document-11' },
      global: {
        stubs: {
          UpdatedCustomInputSelect: {
            name: 'UpdatedCustomInputSelect',
            props: ['id', 'modelValue', 'staticOptions', 'disabled'],
            emits: ['update:modelValue'],
            template: '<div class="select-stub" />',
          },
          MultiLangInput: true,
          HandleFilesUpload: true,
        },
        mocks: { $t: (msg: string) => msg },
      },
    });

    await flushPromises();

    const getSelect = (id: string) => {
      const select = wrapper
        .findAllComponents({ name: 'UpdatedCustomInputSelect' })
        .find((item) => item.props('id') === id);
      if (!select) throw new Error(`Missing select: ${id}`);
      return select;
    };

    expect(getSelect('document-subject').props('modelValue')).toEqual(
      expect.objectContaining({ id: 284, title: 'mostafa 2' }),
    );
    expect(getSelect('document-subject-configuration').props('modelValue')).toEqual(
      expect.objectContaining({ id: 502, title: 'Mathematics -> Algebra' }),
    );
    expect(getSelect('document-subject-configuration-2').props('modelValue')).toEqual(
      expect.objectContaining({ id: 700, title: 'Linear equations' }),
    );
    expect(
      wrapper
        .findAllComponents({ name: 'UpdatedCustomInputSelect' })
        .some((item) => item.props('id') === 'document-subject-configuration-3'),
    ).toBe(false);
    expect(fetchSubjectsMock.mock.calls.map(([params]) => params.toMap())).toEqual([
      { education_classification_branch_id: 149 },
      { education_classification_branch_id: 149, parent_id: 284 },
      { education_classification_branch_id: 149, parent_id: 502 },
      { education_classification_branch_id: 149, parent_id: 700 },
    ]);

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(emittedParams.toMap()).toMatchObject({ stage_id: 149, subject_id: 700 });
  });

  it('restores a parent subject from the full show-document response', async () => {
    fetchBranchesMock.mockResolvedValueOnce(
      new DataSuccess({
        data: [
          {
            id: 361,
            e_c_branch_id: 361,
            title: 'mostafa 1',
            full_title: 'mostafa 1',
            children: [],
          },
        ],
      }),
    );

    const savedDocument = DocumentShowModel.fromJson({
      id: 76,
      title: [{ locale: 'en', title: 'adsdasdas' }],
      description: [{ locale: 'en', description: 'asdsadas' }],
      document_type: { id: 28, title: [{ locale: 'en', title: 'asdad' }] },
      reference_number: '12312332',
      stage: {
        id: 361,
        title: 'mostafa 1',
        education_classification: { id: 128, title: 'mostafa' },
      },
      subject: {
        id: 285,
        e_c_subject_id: 285,
        title: 'mostafa 3',
        parent_id: null,
        education_classification_branch: { id: 361, title: 'mostafa 1' },
      },
      tags: [{ tag: 'asdasdas' }],
    });

    const wrapper = mount(DocumentForm, {
      props: { document: savedDocument, formKey: 'edit-document-76' },
      global: {
        stubs: {
          UpdatedCustomInputSelect: {
            name: 'UpdatedCustomInputSelect',
            props: ['id', 'modelValue', 'staticOptions', 'controller', 'params', 'disabled'],
            emits: ['update:modelValue'],
            template: '<div class="select-stub" />',
          },
          MultiLangInput: true,
          HandleFilesUpload: true,
        },
        mocks: { $t: (msg: string) => msg },
      },
    });

    await flushPromises();

    const getSelect = (id: string) => {
      const select = wrapper
        .findAllComponents({ name: 'UpdatedCustomInputSelect' })
        .find((item) => item.props('id') === id);
      if (!select) throw new Error(`Missing select: ${id}`);
      return select;
    };

    expect(getSelect('document-education-classification').props('modelValue')).toEqual(
      expect.objectContaining({ id: 128, title: 'mostafa' }),
    );
    expect(getSelect('document-branch').props('modelValue')).toEqual(
      expect.objectContaining({
        id: 361,
        title: 'mostafa 1',
      }),
    );
    expect(getSelect('document-subject').props('modelValue')).toEqual(
      expect.objectContaining({ id: 285, title: 'mostafa 3' }),
    );
    expect(fetchSubjectsMock.mock.calls.at(-1)?.[0].toMap()).toEqual({
      education_classification_branch_id: 361,
      parent_id: 285,
    });

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(emittedParams.toMap()).toMatchObject({ stage_id: 361, subject_id: 285 });
  });

  it('shows inline errors for every required document field', async () => {
    const wrapper = mount(DocumentForm, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: true,
          MultiLangInput: true,
          HandleFilesUpload: true,
          DocumentIcon: true,
          DeleteTagIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const isValid = await (
      wrapper.vm as unknown as { validate: () => Promise<boolean> }
    ).validate();

    expect(isValid).toBe(false);
    expect(toastWarningMock).toHaveBeenCalledWith('document_required_fields_warning', {
      title: 'invalid_input_warning_title',
    });
    expect(wrapper.findAll('[data-document-error]').map((error) => error.text())).toEqual([
      'document_name_required',
      'document_reference_number_required',
      'document_type_required',
      'document_education_classification_required',
      'document_branch_required',
      'document_subject_required',
      'document_description_required',
    ]);
  });

  it('loads leaf branches and subjects through the dependent selects', async () => {
    const wrapper = mount(DocumentForm, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: {
            name: 'UpdatedCustomInputSelect',
            props: ['id', 'modelValue', 'staticOptions', 'controller', 'params', 'disabled'],
            emits: ['update:modelValue'],
            template: '<div class="select-stub" />',
          },
          MultiLangInput: true,
          HandleFilesUpload: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const getSelect = (id: string) => {
      const select = wrapper
        .findAllComponents({ name: 'UpdatedCustomInputSelect' })
        .find((item) => item.props('id') === id);
      if (!select) throw new Error(`Missing select: ${id}`);
      return select;
    };

    await flushPromises();
    expect(fetchClassificationsMock).toHaveBeenCalledOnce();
    expect(getSelect('document-education-classification').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 42, title: 'Basic education' }),
    ]);

    getSelect('document-education-classification').vm.$emit('update:modelValue', {
      id: 42,
      title: 'Basic education',
    });
    await flushPromises();

    expect(fetchBranchesMock.mock.calls[0]?.[0].toMap()).toMatchObject({
      education_classification_id: 42,
      with_subject: false,
    });
    expect(getSelect('document-branch').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 109, title: '123 -> 2 -> 3' }),
      expect.objectContaining({ id: 172, title: '123 -> 2 -> test' }),
      expect.objectContaining({ id: 149, title: '123 -> 5 -> 6' }),
    ]);

    getSelect('document-branch').vm.$emit('update:modelValue', {
      id: 149,
      title: '123 -> 5 -> 6',
    });
    await flushPromises();

    expect(fetchSubjectsMock.mock.calls[0]?.[0].toMap()).toEqual({
      education_classification_branch_id: 149,
    });
    expect(getSelect('document-subject').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 284, title: 'mostafa 2' }),
      expect.objectContaining({ id: 308, title: 'mostafa 2.1' }),
      expect.objectContaining({ id: 285, title: 'mostafa 3' }),
    ]);
    expect(getSelect('document-subject').props('modelValue')).toBeNull();

    getSelect('document-subject').vm.$emit('update:modelValue', {
      id: 284,
      title: 'mostafa 2',
    });
    await flushPromises();

    expect(fetchSubjectsMock.mock.calls[1]?.[0].toMap()).toEqual({
      education_classification_branch_id: 149,
      parent_id: 284,
    });
    expect(getSelect('document-subject-configuration').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 502, title: 'Mathematics -> Algebra' }),
    ]);

    const rootSubjectParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(rootSubjectParams.toMap()).toMatchObject({ stage_id: 149, subject_id: 284 });

    getSelect('document-subject-configuration').vm.$emit('update:modelValue', {
      id: 502,
      title: 'Mathematics -> Algebra',
    });
    await flushPromises();

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(emittedParams.toMap()).toMatchObject({ stage_id: 149, subject_id: 502 });
    expect(getSelect('document-subject-configuration-2').props('staticOptions')).toEqual([
      expect.objectContaining({ id: 700, title: 'Linear equations' }),
    ]);

    getSelect('document-subject-configuration').vm.$emit('update:modelValue', null);
    await wrapper.vm.$nextTick();
    const clearedParams = wrapper.emitted('updateData')?.at(-1)?.[0] as AddDocumentParams;
    expect(clearedParams.toMap()).toMatchObject({ stage_id: 149, subject_id: 284 });
    expect(
      wrapper
        .findAllComponents({ name: 'UpdatedCustomInputSelect' })
        .some((item) => item.props('id') === 'document-subject-configuration-2'),
    ).toBe(false);
  });
});
