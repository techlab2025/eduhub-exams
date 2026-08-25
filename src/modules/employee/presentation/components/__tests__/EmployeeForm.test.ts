import { describe, it, expect } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import EmployeeForm from '../EmployeeForm.vue';
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
import { EmployeeTypeEnum } from '../../../core/constant/employee.type.enum';
import StageController from '@/modules/Stages/presentation/controllers/stage.controller';
import StageModel from '@/modules/Stages/core/models/stage.model';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import EmployeeModel from '../../../core/models/employee.model';
import RoleController from '@/modules/Role/presentation/controllers/role.controller';
import RoleModel from '@/modules/Role/core/models/role.model';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
const fetchStagesSpy = vi.spyOn(StageController.getInstance(), 'fetchList');
const fetchRolesSpy = vi.spyOn(RoleController.getInstance(), 'fetchList');
const educationClassificationTree = [
  StageModel.fromJson({
    id: 128,
    title: 'mostafa',
    full_title: 'mostafa',
    branches: [
      {
        id: 361,
        title: 'mostafa 1',
        subjects: [
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
          {
            id: 285,
            e_c_subject_id: 285,
            title: 'mostafa 3',
            full_title: 'mostafa 1 -> mostafa 3',
            children: [],
          },
        ],
        children: [],
      },
    ],
    children: [],
  }),
];

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
  const mountForm = (employee?: EmployeeModel) =>
    mount(EmployeeForm, {
      props: { employee },
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
    fetchStagesSpy.mockResolvedValue(new DataSuccess({ data: educationClassificationTree }));
    fetchRolesSpy.mockResolvedValue(
      new DataSuccess({
        data: [new RoleModel({ id: 4, roleName: 'Content Manager', permissions: [] })],
      }),
    );
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
    expect(selects).toHaveLength(3);
    expect(selects[2]?.props('type')).toBe(2);

    selects[2]?.vm.$emit('update:modelValue', [
      { id: 10, title: 'Math' },
      { id: 12, title: 'Science' },
    ]);
    await wrapper.vm.$nextTick();

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0];
    expect(emittedParams?.toMap()).toMatchObject({
      type: EmployeeTypeEnum.TEACHER,
      e_c_subject_ids: [10, 12],
    });
  });

  it('loads full-title subject options through StageController', async () => {
    const wrapper = mountForm();
    await flushPromises();

    wrapper.getComponent(UpdatedCustomInputSelect).vm.$emit('update:modelValue', {
      id: EmployeeTypeEnum.TEACHER,
      title: 'Teacher',
    });
    await wrapper.vm.$nextTick();

    const subjectSelect = wrapper.findAllComponents(UpdatedCustomInputSelect)[2];
    expect(fetchStagesSpy).toHaveBeenCalledOnce();
    expect(subjectSelect?.props('staticOptions')).toMatchObject([
      { id: 308, title: 'mostafa 1 -> mostafa 2 -> mostafaf 2.1' },
      { id: 285, title: 'mostafa 1 -> mostafa 3' },
    ]);
  });

  it('fills edit inputs and teacher subjects from show_employee', async () => {
    const employee = EmployeeModel.fromJson({
      id: 30,
      employee_ref: '',
      first_name: 'Employee ID1',
      last_name: 'Employee ID2',
      image: null,
      gender: 1,
      status: 2,
      type: 2,
      role_id: 4,
      role_name: 'Content Manager',
      subjects: [
        { id: 308, e_c_subject_id: 308, title: 'mostafaf 2.1' },
        { id: 285, e_c_subject_id: 285, title: 'mostafa 3' },
      ],
      email: 'Employeeid@gmail.com',
      phone: '0101546452312',
    });
    const wrapper = mountForm(employee);
    await flushPromises();

    const inputs = wrapper.findAll('input.field-input');
    expect(inputs[0]?.element.value).toBe('Employee ID1');
    expect(inputs[1]?.element.value).toBe('Employee ID2');
    expect(inputs[3]?.element.value).toBe('Employeeid@gmail.com');
    expect(inputs[5]?.element.value).toBe('0101546452312');

    const selects = wrapper.findAllComponents(UpdatedCustomInputSelect);
    expect(selects[0]?.props('modelValue')).toMatchObject({ id: EmployeeTypeEnum.TEACHER });
    expect(selects[1]?.props('modelValue')).toMatchObject({ id: 4, title: 'Content Manager' });
    expect(selects[2]?.props('modelValue')).toMatchObject([
      { id: 308, title: 'mostafa 1 -> mostafa 2 -> mostafaf 2.1' },
      { id: 285, title: 'mostafa 1 -> mostafa 3' },
    ]);
  });

  it('emits the selected employee role id', async () => {
    const wrapper = mountForm();
    await flushPromises();

    const roleSelect = wrapper.findAllComponents(UpdatedCustomInputSelect)[1];
    roleSelect?.vm.$emit('update:modelValue', { id: 4, title: 'Content Manager' });
    await wrapper.vm.$nextTick();

    const emittedParams = wrapper.emitted('updateData')?.at(-1)?.[0];
    expect(emittedParams?.toMap()).toMatchObject({ role_id: 4 });
  });
});
