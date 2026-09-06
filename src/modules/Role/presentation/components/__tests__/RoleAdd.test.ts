import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { DataFailed } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import StoreRoleParams from '../../../core/params/store.role.params';
import RoleAdd from '../RoleAdd.vue';

const { createRole, fetchList, routerPush } = vi.hoisted(() => ({
  createRole: vi.fn(),
  fetchList: vi.fn(),
  routerPush: vi.fn(),
}));

vi.mock('../../controllers/role.controller', () => ({
  default: {
    getInstance: () => ({ create: createRole, fetchList }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/roles/add' }),
  useRouter: () => ({ push: routerPush }),
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    RoleForm: {
      name: 'RoleForm',
      props: ['errors'],
      emits: ['update-data'],
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

describe('RoleAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens the missing-title dialog when the form is empty', async () => {
    const wrapper = mount(RoleAdd, { global });

    await wrapper.get('button[type="submit"]').trigger('click');

    expect(wrapper.get('.role-dialog-stub').text()).toContain('title-required');
    expect(createRole).not.toHaveBeenCalled();
  });

  it('opens the no-actions dialog when no permissions are selected', async () => {
    const wrapper = mount(RoleAdd, { global });
    wrapper
      .getComponent({ name: 'RoleForm' })
      .vm.$emit('update-data', new StoreRoleParams({ en: 'Manager' }, []));
    await wrapper.vm.$nextTick();

    await wrapper.get('button[type="submit"]').trigger('click');

    expect(wrapper.get('.role-dialog-stub').text()).toContain('permissions-required');
    expect(createRole).not.toHaveBeenCalled();
  });

  it('shows the duplicate message returned by the backend', async () => {
    const backendMessage = 'Role title has already been taken.';
    createRole.mockResolvedValue(
      new DataFailed({ error: new ErrorModel(backendMessage, ErrorType.validation) }),
    );
    const wrapper = mount(RoleAdd, { global });
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
