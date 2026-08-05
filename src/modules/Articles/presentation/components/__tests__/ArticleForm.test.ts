import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import ArticleForm from '../ArticleForm.vue';

const { fetchSubjectTreeMock, toastWarningMock } = vi.hoisted(() => ({
  fetchSubjectTreeMock: vi.fn(),
  toastWarningMock: vi.fn(),
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    toastWarning: toastWarningMock,
  },
}));

vi.mock(
  '@/modules/Questions/presentation/controllers/FullSubjectTree/full.subject.tree.controller',
  () => ({
    default: {
      getInstance: () => ({ fetchList: fetchSubjectTreeMock }),
    },
  }),
);

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

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
    params: { id: '1' },
    fullPath: '/eg/articles/edit/1',
  }),
  createRouter: vi.fn(() => ({
    getRoutes: vi.fn(() => []),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

// Mock document module
vi.mock('@/modules/document', () => ({
  DocumentController: {
    getInstance: () => ({
      fetchList: vi.fn(),
    }),
  },
  IndexDocumentParams: class {},
}));

describe('ArticleForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    fetchSubjectTreeMock.mockResolvedValue({ data: [] });
  });

  it('renders without crashing', () => {
    const wrapper = mount(ArticleForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Accordion: true,
          AccordionPanel: true,
          AccordionHeader: true,
          AccordionContent: true,
          Checkbox: true,
          HandleFilesUpload: true,
          UpdatedCustomInputSelect: true,
          FolderCrudIcon: true,
          UploadFileIcon: true,
          AccordionToggleIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('shows inline errors and a warning toast when required fields are missing', async () => {
    const wrapper = mount(ArticleForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Accordion: { template: '<div><slot /></div>' },
          AccordionPanel: { template: '<div><slot /></div>' },
          AccordionHeader: { template: '<div><slot /></div>' },
          AccordionContent: { template: '<div><slot /></div>' },
          Checkbox: true,
          HandleFilesUpload: true,
          UpdatedCustomInputSelect: true,
          FolderCrudIcon: true,
          UploadFileIcon: true,
          AccordionToggleIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const isValid = await (
      wrapper.vm as unknown as { validateRequiredFields: () => Promise<boolean> }
    ).validateRequiredFields();

    expect(isValid).toBe(false);
    expect(wrapper.findAll('.required-field-message')).toHaveLength(5);
    expect(toastWarningMock).toHaveBeenCalledWith('article_validation_warning', {
      title: 'invalid_input_warning_title',
    });
  });

  it('emits the outer subject id separately from the selected sequence id', async () => {
    const wrapper = mount(ArticleForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Accordion: { template: '<div><slot /></div>' },
          AccordionPanel: { template: '<div><slot /></div>' },
          AccordionHeader: { template: '<div><slot /></div>' },
          AccordionContent: { template: '<div><slot /></div>' },
          Checkbox: true,
          HandleFilesUpload: true,
          UpdatedCustomInputSelect: {
            name: 'UpdatedCustomInputSelect',
            props: ['modelValue', 'staticOptions'],
            emits: ['update:modelValue'],
            template: '<div />',
          },
          FolderCrudIcon: true,
          UploadFileIcon: true,
          AccordionToggleIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const subjectSelect = wrapper
      .findAllComponents({ name: 'UpdatedCustomInputSelect' })
      .find((component: VueWrapper) => component.attributes('id') === 'question-sequence');
    if (!subjectSelect) throw new Error('Subject sequence select was not rendered');

    subjectSelect.vm.$emit('update:modelValue', {
      id: 308,
      title: 'mostafa 1 -> mostafa 2 -> mostafaf 2.1',
      subtitle: 284,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('updateData')?.at(-1)?.[0]).toMatchObject({
      e_c_subject_id: 284,
      questionSequenceId: 308,
    });
  });

  it('keeps the first returned node as the subject when building sequence options', async () => {
    fetchSubjectTreeMock.mockResolvedValueOnce({
      data: [
        {
          id: 284,
          e_c_subject_id: 284,
          title: 'mostafa 2',
          full_title: 'mostafa 1 -> mostafa 2',
          children: [
            {
              id: 308,
              e_c_subject_id: 308,
              title: 'mostafaf 2.1',
              full_title: 'mostafa 1 -> mostafa 2 -> mostafaf 2.1',
              children: [],
            },
          ],
        },
      ],
    });

    const wrapper = mount(ArticleForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Accordion: { template: '<div><slot /></div>' },
          AccordionPanel: { template: '<div><slot /></div>' },
          AccordionHeader: { template: '<div><slot /></div>' },
          AccordionContent: { template: '<div><slot /></div>' },
          Checkbox: true,
          HandleFilesUpload: true,
          UpdatedCustomInputSelect: {
            name: 'UpdatedCustomInputSelect',
            props: ['modelValue', 'staticOptions'],
            template: '<div />',
          },
          FolderCrudIcon: true,
          UploadFileIcon: true,
          AccordionToggleIcon: true,
        },
        mocks: { $t: (msg: string) => msg },
      },
    });
    await flushPromises();

    const subjectSelect = wrapper
      .findAllComponents({ name: 'UpdatedCustomInputSelect' })
      .find((component: VueWrapper) => component.attributes('id') === 'question-sequence');
    if (!subjectSelect) throw new Error('Subject sequence select was not rendered');

    expect(subjectSelect.props('staticOptions')).toEqual([
      expect.objectContaining({ id: 308, subtitle: 284 }),
    ]);
  });
});
