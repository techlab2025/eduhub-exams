import { defineComponent } from 'vue';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import en from '@/locales/en.json';
import AppTable from '@/shared/HelpersComponents/AppTable.vue';
import DropList from '@/shared/HelpersComponents/DropList.vue';
import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
import NotificationPlanModel from '../../../core/models/notification.plan.model';
import NotificationPlanIndex from '../NotificationPlanIndex.vue';

const { deleteMock, fetchListMock, pushMock, toggleStatusMock } = vi.hoisted(() => ({
  deleteMock: vi.fn(),
  fetchListMock: vi.fn(),
  pushMock: vi.fn(),
  toggleStatusMock: vi.fn(),
}));

const listItem = NotificationPlanModel.fromJson({
  notification_plan_id: 7,
  title: 'Question Activity Alerts',
  is_active: true,
  actions: [{ value: 1 }],
  employees: [{ id: 2, name: 'Ahmed Hawam' }],
  created_by: { name: 'Portal Admin' },
  created_at: '2026-09-02T09:20:42.000000Z',
});

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();

  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
  };
});

vi.mock('../../controllers/notification.plan.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList: fetchListMock,
      delete: deleteMock,
      toggleStatus: toggleStatusMock,
      listState: { value: {} },
      pagination: { value: null },
    }),
  },
}));

const DataStatusBuilderStub = defineComponent({
  setup() {
    return { data: [listItem] };
  },
  template: '<div><slot name="success" :data="data" /></div>',
});

const AppTableStub = defineComponent({
  name: 'AppTable',
  props: {
    headers: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    selectable: Boolean,
  },
  template: '<div class="app-table-stub"><slot name="actions" :item="items[0]" /></div>',
});

const FilterDialogStub = defineComponent({
  name: 'FilterDialog',
  props: ['modelValue', 'dialogClass', 'width'],
  emits: ['update:modelValue'],
  template:
    '<div class="filter-dialog-stub"><button class="filter-trigger" @click="$emit(\'update:modelValue\', true)">Filter</button><div v-if="modelValue"><slot name="content" /><slot name="footer" /></div></div>',
});

const mountIndex = () =>
  shallowMount(NotificationPlanIndex, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: 'en',
          messages: { en },
        }),
      ],
      stubs: {
        AppTable: AppTableStub,
        DataStatusBuilder: DataStatusBuilderStub,
        FilterDialog: FilterDialogStub,
      },
    },
  });

describe('NotificationPlanIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    fetchListMock.mockResolvedValue(undefined);
    toggleStatusMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the Figma toolbar and complete table columns', async () => {
    const wrapper = mountIndex();
    await flushPromises();

    const table = wrapper.getComponent(AppTable);
    expect(wrapper.find('input[type="search"]').attributes('placeholder')).toBe(
      'Search by plan ID or title',
    );
    expect(table.props('selectable')).toBe(true);
    expect(table.props('headers').map(({ label }: { label: string }) => label)).toEqual([
      'Plan ID',
      'Title',
      'Recipients Number',
      'Actions Number',
      'Status',
      'Created By',
      'Created At',
    ]);
    expect(wrapper.getComponent(FilterDialog).props()).toMatchObject({
      dialogClass: 'notification-plan-filter-dialog',
      width: '28.125rem',
    });
  });

  it('opens the filter dialog and applies its active status', async () => {
    const wrapper = mountIndex();
    await wrapper.find('.filter-trigger').trigger('click');
    fetchListMock.mockClear();

    expect(wrapper.findAll('.notification-plan-filter__section')).toHaveLength(4);
    await wrapper.find('input[value="active"]').setValue(true);
    await wrapper.find('.notification-plan-filter__actions .btn-primary').trigger('click');
    await flushPromises();

    expect(fetchListMock).toHaveBeenCalledOnce();
    expect(fetchListMock.mock.calls[0]?.[0]).toMatchObject({ isActive: true });
    expect(wrapper.getComponent(FilterDialog).props('modelValue')).toBe(false);
  });

  it('provides the complete row action menu with a status switch', () => {
    const wrapper = mountIndex();
    const menu = wrapper.getComponent(DropList);
    const actions = menu.props('actionList');

    expect(menu.props('variant')).toBe('notification-plan');
    expect(actions.map(({ text }: { text: string }) => text)).toEqual([
      'View',
      'Edit',
      'Deactivate',
      'Delete',
    ]);
    expect(actions[2]).toMatchObject({ toggleValue: true });
    expect(actions[3]).toMatchObject({ danger: true });
  });

  it('requests filtered data after the search debounce', async () => {
    const wrapper = mountIndex();
    await flushPromises();
    fetchListMock.mockClear();

    await wrapper.find('input[type="search"]').setValue('alerts');
    await vi.advanceTimersByTimeAsync(350);

    expect(fetchListMock).toHaveBeenCalledOnce();
    expect(fetchListMock.mock.calls[0]?.[0]).toMatchObject({
      word: 'alerts',
      pageNumber: 1,
      perPage: 10,
    });
  });

  it('navigates to the create page from the add action', async () => {
    const wrapper = mountIndex();

    await wrapper.find('.notification-plan-index__add').trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/notification-plans/add');
  });
});
