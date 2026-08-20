import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PlanEdit from '../PlanEdit.vue';
import EditPlanParams from '../../../core/params/edit.plan.params';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

const {
  itemData,
  fetchOneMock,
  updateMock,
  fetchListMock,
  routerPushMock,
  routeLeaveRegistrationMock,
  validateMock,
  validateTitleMock,
  routeMock,
} = vi.hoisted(() => ({
  itemData: { value: { status: 4 } },
  fetchOneMock: vi.fn(),
  updateMock: vi.fn(),
  fetchListMock: vi.fn(),
  routerPushMock: vi.fn(),
  routeLeaveRegistrationMock: vi.fn(),
  validateMock: vi.fn(),
  validateTitleMock: vi.fn(),
  routeMock: {
    params: { id: '8' },
    fullPath: '/plans/edit/8?section=features&listMode=3&page=2',
    query: { section: 'features', listMode: '3', page: '2' },
  },
}));

vi.mock('../../controllers/plan.controller', () => ({
  default: {
    getInstance: () => ({
      itemData,
      fetchOne: fetchOneMock,
      update: updateMock,
      fetchList: fetchListMock,
    }),
  },
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: routeLeaveRegistrationMock,
  useRoute: () => routeMock,
  useRouter: () => ({ push: routerPushMock }),
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    PlanForm: {
      name: 'PlanForm',
      emits: ['updateData', 'validityChange', 'featuresLoaded'],
      methods: { validate: validateMock, validateTitle: validateTitleMock },
      template: '<div class="plan-form-stub" />',
    },
    DraftPlanDialog: {
      name: 'DraftPlanDialog',
      props: ['modelValue'],
      emits: ['update:modelValue', 'acknowledge'],
      template: '<div class="draft-dialog-stub" />',
    },
    PlanDeleteWarningDialog: {
      name: 'PlanDeleteWarningDialog',
      props: ['modelValue', 'actionType'],
      emits: ['update:modelValue'],
      template: '<div class="warning-dialog-stub" />',
    },
    UnsavedPlanChangesDialog: {
      name: 'UnsavedPlanChangesDialog',
      props: ['modelValue'],
      emits: ['update:modelValue', 'confirm', 'cancel'],
      template: `
        <div v-if="modelValue" class="unsaved-plan-dialog-stub">
          <button class="stay" @click="$emit('cancel')">Cancel</button>
          <button class="leave" @click="$emit('confirm')">OK</button>
        </div>
      `,
    },
    RouterLink: {
      props: ['to'],
      template: '<a><slot /></a>',
    },
  },
};

const params = () =>
  new EditPlanParams({
    id: 8,
    section: 'features',
    translations: new TranslationParams({}),
    status: PlanStatusEnum.DRAFT,
    highlightBadge: [],
    pricing: [],
    hasTrail: false,
    trialDays: 0,
    features: [],
  });

describe('PlanEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    itemData.value = { status: PlanStatusEnum.DRAFT };
    fetchOneMock.mockResolvedValue(undefined);
    validateMock.mockResolvedValue(true);
    validateTitleMock.mockResolvedValue(true);
    updateMock.mockResolvedValue(new DataSuccess({ data: {} }));
    fetchListMock.mockResolvedValue(undefined);
  });

  it('shows cancel action initially and adds publish/draft actions when plan data changes', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();

    expect(wrapper.find('.actions').exists()).toBe(true);
    expect(wrapper.find('.publish-button').exists()).toBe(false);
    expect(wrapper.find('.btn-draft').exists()).toBe(false);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);

    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();
    expect(wrapper.find('.publish-button').exists()).toBe(false);
    expect(wrapper.find('.btn-draft').exists()).toBe(false);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);

    const changedParams = params();
    changedParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    expect(wrapper.findAll('.actions button')).toHaveLength(3);
    expect(wrapper.find('.publish-button').exists()).toBe(true);
    expect(wrapper.find('.btn-draft').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
  });

  it('navigates back to plans list when cancel button is clicked', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();

    await wrapper.get('.btn-cancel').trigger('click');
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Plans',
      query: { listMode: '3', page: '2' },
    });
  });

  it('publishes a draft as active', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();
    const planParams = params();
    planParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', planParams);
    form.vm.$emit('validityChange', true);
    await wrapper.vm.$nextTick();

    await wrapper.get('.publish-button').trigger('click');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.ACTIVE);
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Plans',
      query: { listMode: '3', page: '2' },
    });
    expect(fetchListMock).not.toHaveBeenCalled();
  });

  it('keeps draft status when saving a draft', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();
    const planParams = params();
    planParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', planParams);
    await flushPromises();

    await wrapper.get('.btn-draft').trigger('click');
    const dialog = wrapper.getComponent({ name: 'DraftPlanDialog' });
    expect(dialog.props('modelValue')).toBe(true);
    expect(updateMock).not.toHaveBeenCalled();

    dialog.vm.$emit('acknowledge');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.DRAFT);
    expect(updateMock.mock.calls[0]?.[0].toMap()).toMatchObject({
      subscription_plan_id: 8,
      status: PlanStatusEnum.DRAFT,
    });
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Plans',
      query: { listMode: '3', page: '2' },
    });
    expect(fetchListMock).not.toHaveBeenCalled();
  });

  it('does not open the edit draft dialog when the title is empty', async () => {
    validateTitleMock.mockResolvedValueOnce(false);
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    const changedParams = params();
    changedParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    expect(validateTitleMock).toHaveBeenCalledOnce();
    expect(wrapper.getComponent({ name: 'DraftPlanDialog' }).props('modelValue')).toBe(false);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('uses the same change-triggered actions for a non-draft plan', async () => {
    itemData.value = { status: PlanStatusEnum.ACTIVE };
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();

    expect(wrapper.find('.btn-cancel').exists()).toBe(true);

    const form = wrapper.getComponent({ name: 'PlanForm' });
    const initialParams = params();
    initialParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', initialParams);
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    const changedParams = params();
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    expect(wrapper.find('.publish-button').exists()).toBe(true);
    expect(wrapper.find('.btn-draft').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
  });

  it('shows warning dialog when trying to save as draft for a plan with subscribers', async () => {
    itemData.value = { status: PlanStatusEnum.ACTIVE, subscribers: 5 };
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();

    const form = wrapper.getComponent({ name: 'PlanForm' });
    const initialParams = params();
    initialParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', initialParams);
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    const changedParams = params();
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    await wrapper.get('.btn-draft').trigger('click');
    await wrapper.vm.$nextTick();

    const warningDialog = wrapper.getComponent({ name: 'PlanDeleteWarningDialog' });
    expect(warningDialog.props('modelValue')).toBe(true);
    expect(warningDialog.props('actionType')).toBe('draft');
    expect(wrapper.getComponent({ name: 'DraftPlanDialog' }).props('modelValue')).toBe(false);
  });

  it('asks before leaving after plan data changes', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    const changedParams = params();
    changedParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0];
    const stayResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.unsaved-plan-dialog-stub .stay').trigger('click');
    expect(await stayResult).toBe(false);

    const leaveResult = guard();
    await wrapper.vm.$nextTick();
    await wrapper.get('.unsaved-plan-dialog-stub .leave').trigger('click');
    expect(await leaveResult).toBe(true);
  });

  it('does not send a request or navigate when edit form validation fails', async () => {
    validateMock.mockResolvedValueOnce(false);
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    const changedParams = params();
    changedParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    await wrapper.get('.publish-button').trigger('click');
    await flushPromises();

    expect(updateMock).not.toHaveBeenCalled();
    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it('keeps edit form data and does not navigate when update fails', async () => {
    updateMock.mockResolvedValueOnce({ hasError: true });
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', params());
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    const changedParams = params();
    changedParams.status = PlanStatusEnum.ACTIVE;
    form.vm.$emit('updateData', changedParams);
    await flushPromises();

    await wrapper.get('.publish-button').trigger('click');
    await flushPromises();

    expect(routerPushMock).not.toHaveBeenCalled();

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0];
    const leaveResult = guard();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.unsaved-plan-dialog-stub').exists()).toBe(true);
    await wrapper.get('.unsaved-plan-dialog-stub .stay').trigger('click');
    expect(await leaveResult).toBe(false);
  });
});
