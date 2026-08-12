import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PlanIndex from '../PlanIndex.vue';
import PlanModel from '../../../core/models/plan.model';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';

const { fetchListMock, deleteMock, toggleStatusMock, routerPushMock } = vi.hoisted(() => ({
  fetchListMock: vi.fn(),
  deleteMock: vi.fn(),
  toggleStatusMock: vi.fn(),
  routerPushMock: vi.fn(),
}));

vi.mock('../../controllers/plan.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: {} },
      pagination: { value: null },
      fetchList: fetchListMock,
      delete: deleteMock,
      toggleStatus: toggleStatusMock,
    }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: routerPushMock }),
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      view: 'View',
      edit: 'Edit',
      edit_price: 'Edit Price',
      edit_basic_info: 'Edit Basic Info',
      edit_features: 'Edit Features',
      deactivate: 'Deactivate',
      archive: 'Archive',
      complete: 'Complete',
      activate: 'Activate',
      delete: 'Delete',
      confirm_delete: 'Confirm delete',
      active: 'Active',
      archived: 'Archived',
      plan_archive_filter: 'Archive',
    },
  },
});

const mountComponent = (plan: PlanModel = PlanModel.example) =>
  mount(PlanIndex, {
    global: {
      plugins: [i18n],
      stubs: {
        DataStatusBuilder: {
          template: '<div><slot name="success" :data="items" /></div>',
          data: () => ({ items: [plan] }),
        },
        AppTable: {
          props: ['items'],
          template: '<div><slot name="actions" :item="items[0]" /></div>',
        },
        DropList: {
          name: 'DropList',
          props: ['actionList', 'deleteDialogTitle', 'deleteDialogMessage'],
          template: '<div class="drop-list-stub" />',
        },
        DeactivatePlanDialog: {
          name: 'DeactivatePlanDialog',
          props: ['modelValue', 'loading'],
          emits: ['update:modelValue', 'confirm'],
          template: '<div />',
        },
        ArchivePlanDialog: {
          name: 'ArchivePlanDialog',
          props: ['modelValue', 'loading'],
          emits: ['update:modelValue', 'confirm'],
          template: '<div />',
        },
        ActivatePlanDialog: {
          name: 'ActivatePlanDialog',
          props: ['modelValue', 'loading'],
          emits: ['update:modelValue', 'confirm'],
          template: '<div />',
        },
        PlanDeleteWarningDialog: {
          name: 'PlanDeleteWarningDialog',
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: '<div />',
        },
        FilterDialog: {
          props: ['modelValue', 'dialogClass', 'width'],
          template: '<div><slot name="content"></slot></div>',
        },
        Pagination: true,
        DatePicker: true,
        UpdatedCustomInputSelect: true,
        IndexSearchIcon: true,
      },
    },
  });

const planWithStatus = (status: PlanStatusEnum, subscribers = PlanModel.example.subscribers) =>
  new PlanModel({
    ...PlanModel.example,
    status,
    subscribers,
  });

describe('PlanIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchListMock.mockResolvedValue(undefined);
    deleteMock.mockResolvedValue(undefined);
    toggleStatusMock.mockResolvedValue({ hasError: false });
  });

  it('provides the complete plan action menu through DropList', () => {
    const wrapper = mountComponent();
    const dropList = wrapper.getComponent({ name: 'DropList' });
    const actions = dropList.props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual([
      'View',
      'Edit Price',
      'Edit Basic Info',
      'Edit Features',
      'Deactivate',
      'Archive',
      'Delete',
    ]);
    expect(actions[0].link).toBe('/plans/1');
    expect(actions[1].link).toBe('/plans/edit/1?section=pricing');
    expect(actions[2].link).toBe('/plans/edit/1?section=basic');
    expect(actions[3].link).toBe('/plans/edit/1?section=features');
    expect(actions[4].confirmation).toBeUndefined();
    expect(actions[5].confirmation).toBeUndefined();
    expect(dropList.props('deleteDialogTitle')).toBe('Confirm delete');
  });

  it('deletes the selected plan and refreshes the list', async () => {
    const wrapper = mountComponent(planWithStatus(PlanStatusEnum.ACTIVE, 0));
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    await actions[6].action();
    await flushPromises();

    expect(deleteMock).toHaveBeenCalledOnce();
    expect(deleteMock.mock.calls[0]?.[0].toMap()).toEqual({ subscription_plan_id: 1 });
    expect(fetchListMock).toHaveBeenCalledTimes(2);
  });

  it('shows a warning and does not delete a plan that has subscribers', async () => {
    const wrapper = mountComponent(planWithStatus(PlanStatusEnum.ACTIVE, 3));
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');
    const deleteAction = actions.at(-1);

    expect(deleteAction.skipDeleteConfirmation).toBe(true);
    deleteAction.action();
    await wrapper.vm.$nextTick();

    expect(wrapper.getComponent({ name: 'PlanDeleteWarningDialog' }).props('modelValue')).toBe(
      true,
    );
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('shows only view, complete, and delete for a draft plan', () => {
    const wrapper = mountComponent(planWithStatus(PlanStatusEnum.DRAFT));
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual([
      'View',
      'Complete',
      'Delete',
    ]);
    expect(actions[1].link).toBe('/plans/edit/1');
  });

  it('shows section edits and activates an archived plan after confirmation', async () => {
    const wrapper = mountComponent(planWithStatus(PlanStatusEnum.Archived));
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual([
      'View',
      'Edit Price',
      'Edit Basic Info',
      'Edit Features',
      'Activate',
      'Delete',
    ]);

    actions[4].action();
    await wrapper.vm.$nextTick();

    const activateDialog = wrapper.getComponent({ name: 'ActivatePlanDialog' });
    expect(activateDialog.props('modelValue')).toBe(true);
    expect(toggleStatusMock).not.toHaveBeenCalled();

    activateDialog.vm.$emit('confirm');
    await flushPromises();

    expect(toggleStatusMock.mock.calls[0]?.[0].toMap()).toEqual({
      subscription_plan_id: 1,
      status: PlanStatusEnum.ACTIVE,
    });
    expect(activateDialog.props('modelValue')).toBe(false);
  });

  it('changes the plan status and refreshes the list', async () => {
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    actions[5].action();
    await wrapper.vm.$nextTick();

    const archiveDialog = wrapper.getComponent({ name: 'ArchivePlanDialog' });
    expect(archiveDialog.props('modelValue')).toBe(true);
    expect(toggleStatusMock).not.toHaveBeenCalled();

    archiveDialog.vm.$emit('confirm');
    await flushPromises();

    expect(toggleStatusMock).toHaveBeenCalledOnce();
    expect(toggleStatusMock.mock.calls[0]?.[0].toMap()).toEqual({
      subscription_plan_id: 1,
      status: 3,
    });
    expect(fetchListMock).toHaveBeenCalledTimes(2);
    expect(archiveDialog.props('modelValue')).toBe(false);
  });

  it('fetches archived plans and restores the normal list from the segmented control', async () => {
    const wrapper = mountComponent();
    const modeButtons = wrapper.findAll('.plan-list-toggle button');

    await modeButtons[1].trigger('click');
    await flushPromises();

    expect(fetchListMock.mock.calls.at(-1)?.[0].toMap().status).toBe(3);
    expect(modeButtons[1].attributes('aria-pressed')).toBe('true');

    await modeButtons[0].trigger('click');
    await flushPromises();

    expect(fetchListMock.mock.calls.at(-1)?.[0].toMap().status).toBe(1);
    expect(modeButtons[0].attributes('aria-pressed')).toBe('true');
  });

  it('fetches the initial list without optional filters', () => {
    mountComponent();

    expect(fetchListMock.mock.calls[0]?.[0].toMap()).toEqual({
      with_pagination: 1,
      page: 1,
      per_page: 10,
    });
  });
});
