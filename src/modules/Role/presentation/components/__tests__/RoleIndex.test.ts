import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { defineComponent, h } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import RoleModel from '../../../core/models/role.model';
import RoleIndex from '../RoleIndex.vue';

const { fetchList } = vi.hoisted(() => ({ fetchList: vi.fn() }));

vi.mock('../../controllers/role.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList,
      delete: vi.fn(),
      listState: { value: new DataSuccess({ data: [] }) },
      pagination: { value: null },
    }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: vi.fn() }),
}));

const role = new RoleModel({ id: 7, roleName: 'Content Manager', permissions: ['OE01'] });
const StatusStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.success?.({ data: [role] }));
  },
});
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

describe('RoleIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchList.mockResolvedValue(new DataSuccess({ data: [role] }));
  });

  it('loads and displays roles with view and edit actions', async () => {
    const wrapper = mount(RoleIndex, {
      global: {
        plugins: [i18n],
        stubs: {
          DataStatusBuilder: StatusStub,
          Pagination: true,
          TableSkelaton: true,
          DeleteDialog: { template: '<div><slot name="Dialog" /></div>' },
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    await flushPromises();

    expect(fetchList).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('Content Manager');
    expect(wrapper.text()).toContain('role.actions.view');
    expect(wrapper.text()).toContain('role.actions.edit');
  });
});
