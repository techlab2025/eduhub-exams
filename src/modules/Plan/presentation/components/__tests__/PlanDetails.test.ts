import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PlanDetailsModel from '../../../core/models/plan.details.model';
import PlanDetails from '../PlanDetails.vue';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';

const { fetchOneMock, deleteMock, toggleStatusMock, routerReplaceMock, itemData, itemState } =
  vi.hoisted(() => ({
    fetchOneMock: vi.fn(),
    deleteMock: vi.fn(),
    toggleStatusMock: vi.fn(),
    routerReplaceMock: vi.fn(),
    itemData: { value: null as PlanDetailsModel | null },
    itemState: { value: {} },
  }));

vi.mock('../../controllers/plan.controller', () => ({
  default: {
    getInstance: () => ({
      itemData,
      itemState,
      fetchOne: fetchOneMock,
      delete: deleteMock,
      toggleStatus: toggleStatusMock,
    }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '5' } }),
  useRouter: () => ({ replace: routerReplaceMock }),
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
const mountComponent = () =>
  mount(PlanDetails, {
    global: {
      plugins: [i18n],
      stubs: {
        DataStatusBuilder: {
          name: 'DataStatusBuilder',
          template: '<div><slot name="success" /></div>',
        },
        ActionsIcon: true,
        EmployeeIcon: true,
        IconClock: true,
        EditIcon: true,
        PricingIcon: true,
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
          props: ['modelValue', 'actionType'],
          emits: ['update:modelValue'],
          template: '<div />',
        },
      },
    },
  });

describe('PlanDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    itemData.value = PlanDetailsModel.example;
    fetchOneMock.mockResolvedValue(undefined);
    deleteMock.mockResolvedValue(undefined);
    toggleStatusMock.mockResolvedValue({ hasError: false });
  });

  it('renders summary, pricing, and included features from the details model', () => {
    const wrapper = mountComponent();

    expect(wrapper.get('h1').text()).toBe('The Complete Plan');
    expect(wrapper.find('.pricing-details').exists()).toBe(true);
    expect(wrapper.find('.included-features').exists()).toBe(true);
    expect(wrapper.findAll('.feature-group')).toHaveLength(6);
    expect(wrapper.findAll('.feature-group').at(0)?.findAll('.sub-feature')).toHaveLength(4);
    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toEqual({ subscription_plan_id: 5 });
  });

  it('switches to the activity log tab', async () => {
    const wrapper = mountComponent();

    await wrapper.findAll('.details-tabs button')[1].trigger('click');

    expect(wrapper.find('.activity-log').exists()).toBe(true);
    expect(wrapper.findAll('.activity-entry')).toHaveLength(1);
    expect(wrapper.get('.activity-avatar').text()).toBe('AH');
    expect(wrapper.find('.activity-dot').exists()).toBe(true);
    expect(wrapper.text()).toContain('Updated plan pricing');
    expect(wrapper.find('.pricing-details').exists()).toBe(false);
  });

  it('shows the active-plan action list in DropList', () => {
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual([
      'edit_price',
      'edit_basic_info',
      'edit_features',
      'deactivate',
      'archive',
      'delete',
    ]);
    expect(actions[0].link).toBe('/plans/edit/1?section=pricing');
  });

  it('shows only complete and delete for a draft plan', () => {
    itemData.value = PlanDetailsModel.fromJson({
      id: 5,
      status: PlanStatusEnum.DRAFT,
      'subscribers:': 0,
      title: [],
      description: [],
    });
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    expect(actions.map((action: { text: string }) => action.text)).toEqual(['complete', 'delete']);
    expect(actions[0].link).toBe('/plans/edit/5');
  });

  it('activates an archived plan only after confirmation', async () => {
    itemData.value = PlanDetailsModel.fromJson({
      id: 5,
      status: PlanStatusEnum.Archived,
      'subscribers:': 2,
      title: [],
      description: [],
    });
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    actions[3].action();
    await wrapper.vm.$nextTick();

    const dialog = wrapper.getComponent({ name: 'ActivatePlanDialog' });
    expect(dialog.props('modelValue')).toBe(true);
    expect(toggleStatusMock).not.toHaveBeenCalled();

    dialog.vm.$emit('confirm');
    await flushPromises();

    expect(toggleStatusMock.mock.calls[0]?.[0].toMap()).toEqual({
      subscription_plan_id: 5,
      status: PlanStatusEnum.ACTIVE,
    });
    expect(fetchOneMock).toHaveBeenCalledTimes(3);
  });

  it('blocks deletion when the plan has subscribers', async () => {
    itemData.value = PlanDetailsModel.fromJson({
      id: 5,
      status: PlanStatusEnum.ACTIVE,
      subscribers: 3,
      title: [],
      description: [],
    });
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');
    const deleteAction = actions.at(-1);

    expect(deleteAction.skipDeleteConfirmation).toBe(true);
    deleteAction.action();
    await wrapper.vm.$nextTick();

    const warningDialog = wrapper.getComponent({ name: 'PlanDeleteWarningDialog' });
    expect(warningDialog.props('modelValue')).toBe(true);
    expect(warningDialog.props('actionType')).toBe('delete');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('blocks deactivation and shows warning dialog when plan has subscribers', async () => {
    itemData.value = PlanDetailsModel.fromJson({
      id: 5,
      status: PlanStatusEnum.ACTIVE,
      subscribers: 3,
      title: [],
      description: [],
    });
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');
    const deactivateAction = actions[3];

    deactivateAction.action();
    await wrapper.vm.$nextTick();

    const warningDialog = wrapper.getComponent({ name: 'PlanDeleteWarningDialog' });
    expect(warningDialog.props('modelValue')).toBe(true);
    expect(warningDialog.props('actionType')).toBe('deactivate');
  });

  it('blocks archiving and shows warning dialog when plan has subscribers', async () => {
    itemData.value = PlanDetailsModel.fromJson({
      id: 5,
      status: PlanStatusEnum.ACTIVE,
      subscribers: 3,
      title: [],
      description: [],
    });
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');
    const archiveAction = actions[4];

    archiveAction.action();
    await wrapper.vm.$nextTick();

    const warningDialog = wrapper.getComponent({ name: 'PlanDeleteWarningDialog' });
    expect(warningDialog.props('modelValue')).toBe(true);
    expect(warningDialog.props('actionType')).toBe('archive');
  });

  it('deletes a plan without subscribers and returns to the index', async () => {
    itemData.value = PlanDetailsModel.fromJson({
      id: 5,
      status: PlanStatusEnum.ACTIVE,
      'subscribers:': 0,
      title: [],
      description: [],
    });
    const wrapper = mountComponent();
    const actions = wrapper.getComponent({ name: 'DropList' }).props('actionList');

    await actions.at(-1).action();

    expect(deleteMock.mock.calls[0]?.[0].toMap()).toEqual({ subscription_plan_id: 5 });
    expect(routerReplaceMock).toHaveBeenCalledWith({ name: 'Plans' });
  });
});
