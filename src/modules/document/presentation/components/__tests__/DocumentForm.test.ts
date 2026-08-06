import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DocumentForm from '../DocumentForm.vue';

const toastWarningMock = vi.hoisted(() => vi.fn());
const stageControllerMock = vi.hoisted(() => ({
  listData: { value: [] as unknown[] },
  fetchList: vi.fn(),
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    toastWarning: toastWarningMock,
  },
}));

vi.mock('@/modules/Stages/presentation/controllers/stage.controller', () => ({
  default: {
    getInstance: () => stageControllerMock,
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
    d: (d: any) => d,
    n: (n: any) => n,
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
    stageControllerMock.listData.value = [];
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
      'document_subject_required',
      'document_description_required',
    ]);
  });

  it('uses the first subject id and full title for nested branch options', async () => {
    stageControllerMock.listData.value = [
      {
        id: 130,
        branches: [
          {
            id: 362,
            subjects: [],
            children: [
              {
                id: 393,
                subjects: [
                  {
                    id: 286,
                    title: '1',
                    full_title: 'zxczxczxc -> 2 -> 1 -> 1',
                  },
                ],
                children: [],
              },
              {
                id: 394,
                subjects: [],
                children: [],
              },
            ],
          },
        ],
      },
    ];

    const wrapper = mount(DocumentForm, {
      global: {
        stubs: {
          UpdatedCustomInputSelect: true,
          MultiLangInput: true,
          HandleFilesUpload: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
    await flushPromises();

    expect(wrapper.findComponent('#doc-branch').props('staticOptions')).toEqual([
      expect.objectContaining({
        id: 286,
        title: 'zxczxczxc -> 2 -> 1 -> 1',
        subtitle: 393,
      }),
    ]);
  });
});
