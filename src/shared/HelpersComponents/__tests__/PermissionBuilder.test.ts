import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import PermissionBuilder from '../PermissionBuilder.vue';
import { PermissionsEnum } from '@/modules/Permission/core/enums/permissions.enum';
import UserModel from '@/modules/auth/core/models/user.model';
import { useUserStore } from '@/stores/user';

describe('PermissionBuilder', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('renders content when the user has any supplied permission', () => {
    useUserStore().setUser(
      new UserModel({ name: 'User', email: 'user@example.com', permission: ['OE04'] }),
    );
    const wrapper = mount(PermissionBuilder, {
      props: { code: [PermissionsEnum.ORG_EMPLOYEE_UPDATE] },
      slots: { default: '<button>Allowed</button>' },
    });
    expect(wrapper.text()).toContain('Allowed');
  });

  it('renders the fallback when access is denied', () => {
    useUserStore().setUser(new UserModel({ name: 'User', email: 'user@example.com' }));
    const wrapper = mount(PermissionBuilder, {
      props: { code: [PermissionsEnum.ADMIN] },
      slots: { default: 'Allowed', notPermitted: 'Denied' },
    });
    expect(wrapper.text()).toBe('Denied');
  });
});
