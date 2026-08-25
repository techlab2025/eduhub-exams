import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import RoleModel from '../../../core/models/role.model';
import RoleForm from '../RoleForm.vue';

const { create, fetchOne, push, update } = vi.hoisted(() => ({
  create: vi.fn(),
  fetchOne: vi.fn(),
  push: vi.fn(),
  update: vi.fn(),
}));

vi.mock('../../controllers/role.controller', () => ({
  default: { getInstance: () => ({ create, fetchOne, update }) },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '7' } }),
  useRouter: () => ({ push }),
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

describe('RoleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    create.mockResolvedValue(new DataSuccess({ data: RoleModel.example }));
    update.mockResolvedValue(new DataSuccess({ data: RoleModel.example }));
    fetchOne.mockResolvedValue(
      new DataSuccess({
        data: new RoleModel({ id: 7, roleName: 'Support Agent', permissions: ['OE01'] }),
      }),
    );
  });

  it('stores role_name and selected permissions', async () => {
    const wrapper = mount(RoleForm, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    });
    await wrapper.get('#role-name').setValue('Content Manager');
    await wrapper.get('.permission-pill').trigger('click');
    await wrapper.get('footer button').trigger('click');
    await flushPromises();

    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0]?.[0].toMap()).toEqual({
      role_name: 'Content Manager',
      permissions: ['OE00'],
    });
    expect(push).toHaveBeenCalledWith({ name: 'Roles' });
  });

  it('loads an existing role for editing', async () => {
    const wrapper = mount(RoleForm, {
      props: { mode: 'edit' },
      global: {
        plugins: [i18n],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    });
    await flushPromises();

    expect(fetchOne).toHaveBeenCalledOnce();
    expect((wrapper.get('#role-name').element as HTMLInputElement).value).toBe('Support Agent');
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(1);
  });
});
