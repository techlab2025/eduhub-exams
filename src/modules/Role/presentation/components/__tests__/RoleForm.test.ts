import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import MultiLangInput from '@/shared/MultiLangInput.vue';
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
        data: new RoleModel({
          id: 7,
          roleName: 'Support Agent',
          translations: { en: 'Support Agent', ar: 'موظف دعم' },
          permissions: ['OE01'],
        }),
      }),
    );
  });

  it('stores translated role titles and selected permissions', async () => {
    const wrapper = mount(RoleForm, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    });
    wrapper.getComponent(MultiLangInput).vm.$emit('update:modelValue', {
      en: 'Content Manager',
      ar: 'مدير المحتوى',
    });
    await wrapper.vm.$nextTick();
    await wrapper.get('.permission-group__bulk-actions button').trigger('click');
    await wrapper.get('footer button').trigger('click');
    await flushPromises();

    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0]?.[0].toMap()).toEqual({
      translations: { title: { en: 'Content Manager', ar: 'مدير المحتوى' } },
      permissions: ['OE01', 'OE02', 'OE03', 'OE04', 'OE05'],
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
    expect(wrapper.getComponent(MultiLangInput).props('modelValue')).toEqual({
      en: 'Support Agent',
      ar: 'موظف دعم',
    });
    expect(wrapper.findAll('.permission-pill--selected')).toHaveLength(1);
  });
});
