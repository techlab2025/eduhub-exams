import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PlanAdd from '../PlanAdd.vue';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';

const { createMock, fetchListMock, routerPushMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  fetchListMock: vi.fn(),
  routerPushMock: vi.fn(),
}));

vi.mock('../../controllers/plan.controller', () => ({
  default: {
    getInstance: () => ({ create: createMock, fetchList: fetchListMock }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/plans/add' }),
  useRouter: () => ({ push: routerPushMock }),
}));

const global = {
  stubs: {
    PlanForm: {
      name: 'PlanForm',
      emits: ['updateData', 'validityChange'],
      template: '<div class="plan-form-stub" />',
    },
    DraftPlanDialog: {
      name: 'DraftPlanDialog',
      props: ['modelValue'],
      emits: ['update:modelValue', 'acknowledge'],
      template: '<div class="draft-dialog-stub" />',
    },
  },
  mocks: { $t: (key: string) => key },
};

const params = () => ({ status: PlanStatusEnum.ACTIVE });

describe('PlanAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMock.mockResolvedValue({ data: {} });
    fetchListMock.mockResolvedValue(undefined);
  });

  it('shows only Publish and Save as draft and dims Publish initially', () => {
    const wrapper = mount(PlanAdd, { global });

    expect(wrapper.find('.actions').findAll('button')).toHaveLength(2);
    expect(wrapper.get('.publish-button').attributes('disabled')).toBeUndefined();
    expect(wrapper.get('.publish-button').attributes('aria-disabled')).toBe('true');
    expect(wrapper.get('.publish-button').classes()).toContain('is-not-ready');
    expect(wrapper.find('.btn-cancel').exists()).toBe(false);
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
    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Plans' });
  });

  it('sends incomplete work to the API as DRAFT', async () => {
    const wrapper = mount(PlanAdd, { global });
    const planParams = params();
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', planParams);
    await wrapper.vm.$nextTick();

    await wrapper.get('.btn-draft').trigger('click');
    await flushPromises();

    expect(createMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.DRAFT);
    const dialog = wrapper.getComponent({ name: 'DraftPlanDialog' });
    expect(dialog.props('modelValue')).toBe(true);
    expect(routerPushMock).not.toHaveBeenCalled();

    dialog.vm.$emit('acknowledge');
    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Plans' });
  });
});
