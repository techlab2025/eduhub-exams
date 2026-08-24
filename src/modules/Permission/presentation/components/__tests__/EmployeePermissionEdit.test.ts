import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import EmployeePermissionModel from '../../../core/models/employee.permission.model';
import EmployeePermissionEdit from '../EmployeePermissionEdit.vue';

const fetchOne = vi.fn();
const storeEmployeePermissions = vi.fn();
const push = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '9' }, query: { name: 'Mona' } }),
  useRouter: () => ({ push }),
}));

vi.mock('../../controllers/permission.controller', () => ({
  default: {
    getInstance: () => ({
      itemState: { value: new DataSuccess({ data: new EmployeePermissionModel(9, ['OE01']) }) },
      fetchOne,
      storeEmployeePermissions,
    }),
  },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      employee: 'Employee',
      permission: {
        page_title: 'Employee Permissions',
        page_description: 'Permissions for {employee}',
        cancel: 'Cancel',
      },
    },
  },
});

describe('EmployeePermissionEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchOne.mockResolvedValue(new DataSuccess({ data: new EmployeePermissionModel(9, ['OE01']) }));
  });

  it('loads the selected employee permissions', async () => {
    const wrapper = mount(EmployeePermissionEdit, {
      global: {
        plugins: [i18n],
        stubs: {
          DataStatusBuilder: { template: '<div><slot name="success" /></div>' },
        },
      },
    });
    await flushPromises();
    expect(fetchOne).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('Mona');
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(1);
  });

  it('starts with nothing selected when the employee has no permissions', async () => {
    fetchOne.mockResolvedValueOnce(new DataSuccess({ data: new EmployeePermissionModel(9, []) }));
    const wrapper = mount(EmployeePermissionEdit, {
      global: {
        plugins: [i18n],
        stubs: {
          DataStatusBuilder: { template: '<div><slot name="success" /></div>' },
        },
      },
    });
    await flushPromises();
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(0);
  });
});
