import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import {
  DataFailed,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import StoreRoleParams from '../../../core/params/store.role.params';
import RoleModel from '../../../core/models/role.model';
import RoleEdit from '../RoleEdit.vue';

const { fetchOne, updateRole, fetchList, routerPush, itemState } = vi.hoisted(() => ({
  fetchOne: vi.fn(),
  updateRole: vi.fn(),
  fetchList: vi.fn(),
  routerPush: vi.fn(),
  itemState: { value: { data: null as unknown } },
}));

vi.mock('../../controllers/role.controller', () => ({
  default: {
    getInstance: () => ({
      fetchOne,
      update: updateRole,
      fetchList,
      itemState,
    }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '7' }, fullPath: '/roles/edit/7' }),
  useRouter: () => ({ push: routerPush }),
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    RoleForm: {
      name: 'RoleForm',
      props: ['data', 'errors'],
      emits: ['update-data', 'save-role'],
      template: '<div class="role-form-stub" />',
    },
    RoleFeedbackDialog: {
      name: 'RoleFeedbackDialog',
      props: ['modelValue', 'variant', 'message'],
      emits: ['update:modelValue'],
      template: '<div v-if="modelValue" class="role-dialog-stub">{{ variant }}|{{ message }}</div>',
    },
    RouterLink: { template: '<a><slot /></a>' },
  },
};

describe('RoleEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    itemState.value = new DataSuccess({ data: RoleModel.example });
    fetchOne.mockResolvedValue(itemState.value);
  });

  it('loads the selected role', async () => {
    mount(RoleEdit, { global });
    await flushPromises();

    expect(fetchOne).toHaveBeenCalledOnce();
    expect(fetchOne.mock.calls[0]?.[0].toMap()).toEqual({ role_id: 7 });
  });

  it('shows the backend message when updating fails', async () => {
    const backendMessage = 'Role title already exists.';
    updateRole.mockResolvedValue(
      new DataFailed({ error: new ErrorModel(backendMessage, ErrorType.conflict) }),
    );
    const wrapper = mount(RoleEdit, { global });
    await flushPromises();
    wrapper
      .getComponent({ name: 'RoleForm' })
      .vm.$emit('update-data', new StoreRoleParams({ en: 'Manager' }, ['OE01']));
    await wrapper.vm.$nextTick();

    await wrapper.get('button[type="submit"]').trigger('click');
    await flushPromises();

    expect(wrapper.get('.role-dialog-stub').text()).toContain('duplicate-title');
    expect(wrapper.get('.role-dialog-stub').text()).toContain(backendMessage);
    expect(routerPush).not.toHaveBeenCalled();
  });
});
