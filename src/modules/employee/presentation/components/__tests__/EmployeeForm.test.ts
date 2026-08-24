import { describe, it, expect } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import EmployeeForm from '../EmployeeForm.vue';
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
import { EmployeeTypeEnum } from '../../../core/constant/employee.type.enum';

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

// Mock PrimeVue
vi.mock('primevue/config', () => ({
  usePrimeVue: () => ({
    config: { ripple: true },
  }),
}));

// Mock Controller if it exists in the same directory (simplified)
// This is to avoid issues with controllers that might have side effects
// vi.mock('../controllers/employee.controller', () => ({
//   default: {
//     getInstance: () => ({
//       listState: { value: {} },
//       fetchList: vi.fn(),
//       pagination: { value: {} }
//     })
//   }
// }))

describe('EmployeeForm', () => {
  const mountForm = () =>
    mount(EmployeeForm, {
      global: {
        plugins: [i18n],
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
          InputSwitch: true,
          RadioButton: true,
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
          HandleFilesUpload: true,
          UplaodImageInput: true,
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

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = mountForm();
    expect(wrapper.exists()).toBe(true);
  });

  it('shows the subject multiselect for teachers and emits selected subject ids', async () => {
    const wrapper = mountForm();
    await flushPromises();

    const employeeTypeSelect = wrapper.getComponent(UpdatedCustomInputSelect);
    employeeTypeSelect.vm.$emit('update:modelValue', {
      id: EmployeeTypeEnum.TEACHER,
      title: 'Teacher',
    });
    await wrapper.vm.$nextTick();

    const selects = wrapper.findAllComponents(UpdatedCustomInputSelect);
    expect(selects).toHaveLength(2);
    expect(selects[1]?.props('type')).toBe(2);

    selects[1]?.vm.$emit('update:modelValue', [
      { id: 10, title: 'Math' },
      { id: 12, title: 'Science' },
    ]);
    await wrapper.vm.$nextTick();

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0];
    expect(emittedParams?.toMap()).toMatchObject({
      employee_type: EmployeeTypeEnum.TEACHER,
      e_c_subject_ids: [10, 12],
    });
  });
});
