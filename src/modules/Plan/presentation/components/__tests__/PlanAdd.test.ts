import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PlanAdd from '../PlanAdd.vue';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

const {
  createMock,
  fetchListMock,
  routerPushMock,
  routeLeaveRegistrationMock,
  validateMock,
  validateTitleMock,
  routeMock,
} = vi.hoisted(() => ({
  createMock: vi.fn(),
  fetchListMock: vi.fn(),
  routerPushMock: vi.fn(),
  routeLeaveRegistrationMock: vi.fn(),
  validateMock: vi.fn(),
  validateTitleMock: vi.fn(),
  routeMock: {
    fullPath: '/plans/add?status=3&page=2',
    query: { status: '3', page: '2' },
  },
}));

vi.mock('../../controllers/plan.controller', () => ({
  default: {
    getInstance: () => ({ create: createMock, fetchList: fetchListMock }),
  },
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: routeLeaveRegistrationMock,
  useRoute: () => routeMock,
  useRouter: () => ({ push: routerPushMock }),
}));

const global = {
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
  },
  mocks: { $t: (key: string) => key },
};

const params = () => ({ status: PlanStatusEnum.ACTIVE });

describe('PlanAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    validateMock.mockResolvedValue(true);
    validateTitleMock.mockResolvedValue(true);
    createMock.mockResolvedValue(new DataSuccess({ data: {} }));
    fetchListMock.mockResolvedValue(undefined);
  });

  it('shows only Publish and Save as draft and dims Publish initially', () => {
    const wrapper = mount(PlanAdd, { global });

    expect(wrapper.find('.actions').findAll('button')).toHaveLength(3);
    expect(wrapper.get('.publish-button').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('.publish-button').attributes('aria-disabled')).toBe('true');
    expect(wrapper.get('.publish-button').classes()).toContain('is-not-ready');
    expect(wrapper.find('.btn-cancel').exists()).toBe(true);
  });

  it('publishes as ACTIVE after the complete-form event', async () => {
    const wrapper = mount(PlanAdd, { global });
    const form = wrapper.getComponent({ name: 'PlanForm' });
    const planParams = params();
    form.vm.$emit('updateData', planParams);
    form.vm.$emit('validityChange', true);
    await wrapper.vm.$nextTick();

    await wrapper.get('.publish-button').trigger('click');
    await flushPromises();

    expect(createMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.ACTIVE);
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Plans',
      query: { status: '3', page: '2' },
    });
  });

  it('sends incomplete work to the API as DRAFT', async () => {
    const wrapper = mount(PlanAdd, { global });
    const planParams = params();
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', planParams);
    await wrapper.vm.$nextTick();

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    const dialog = wrapper.getComponent({ name: 'DraftPlanDialog' });
    expect(dialog.props('modelValue')).toBe(true);
    expect(createMock).not.toHaveBeenCalled();
    expect(routerPushMock).not.toHaveBeenCalled();

    dialog.vm.$emit('acknowledge');
    await flushPromises();

    expect(createMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.DRAFT);
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'Plans',
      query: { status: '3', page: '2' },
    });
  });

  it('does not open the draft dialog when the title is empty', async () => {
    validateTitleMock.mockResolvedValueOnce(false);
    const wrapper = mount(PlanAdd, { global });
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', params());

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    expect(validateTitleMock).toHaveBeenCalledOnce();
    expect(wrapper.getComponent({ name: 'DraftPlanDialog' }).props('modelValue')).toBe(false);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('asks before leaving after form data changes', async () => {
    const wrapper = mount(PlanAdd, { global });
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', { status: PlanStatusEnum.ACTIVE, title: '' });
    form.vm.$emit('featuresLoaded');
    await flushPromises();

    form.vm.$emit('updateData', { status: PlanStatusEnum.ACTIVE, title: 'New plan' });
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

  it('does not send a request or navigate when form validation fails', async () => {
    validateMock.mockResolvedValueOnce(false);
    const wrapper = mount(PlanAdd, { global });
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', params());

    await wrapper.get('.publish-button').trigger('click');
    await flushPromises();

    expect(createMock).not.toHaveBeenCalled();
    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it('keeps add form data and does not navigate when publishing fails', async () => {
    createMock.mockResolvedValueOnce({ hasError: true });
    const wrapper = mount(PlanAdd, { global });
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', { status: PlanStatusEnum.ACTIVE, title: '' });
    form.vm.$emit('featuresLoaded');
    await flushPromises();
    form.vm.$emit('updateData', { status: PlanStatusEnum.ACTIVE, title: 'New plan' });

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

  it('does not navigate when saving a draft fails', async () => {
    createMock.mockResolvedValueOnce({ hasError: true });
    const wrapper = mount(PlanAdd, { global });
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', params());

    await wrapper.get('.btn-draft').trigger('click');
    wrapper.getComponent({ name: 'DraftPlanDialog' }).vm.$emit('acknowledge');
    await flushPromises();

    expect(routerPushMock).not.toHaveBeenCalled();
  });

  it('blocks navigation without opening the warning while a request is running', async () => {
    let resolveCreate: ((result: DataSuccess<object>) => void) | undefined;
    createMock.mockReturnValueOnce(
      new Promise<DataSuccess<object>>((resolve) => {
        resolveCreate = resolve;
      }),
    );
    const wrapper = mount(PlanAdd, { global });
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', { status: PlanStatusEnum.ACTIVE, title: '' });
    form.vm.$emit('featuresLoaded');
    await flushPromises();
    form.vm.$emit('updateData', { status: PlanStatusEnum.ACTIVE, title: 'New plan' });
    await flushPromises();

    void wrapper.get('.publish-button').trigger('click');
    await wrapper.vm.$nextTick();

    const guard = routeLeaveRegistrationMock.mock.calls.at(-1)?.[0];
    expect(guard()).toBe(false);
    expect(wrapper.find('.unsaved-plan-dialog-stub').exists()).toBe(false);

    resolveCreate?.(new DataSuccess({ data: {} }));
    await flushPromises();
  });
});
