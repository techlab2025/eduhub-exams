import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PlanEdit from '../PlanEdit.vue';
import EditPlanParams from '../../../core/params/edit.plan.params';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanStatusEnum } from '../../../core/enums/plan.status.enum';

const { itemData, fetchOneMock, updateMock, fetchListMock, routerPushMock } = vi.hoisted(() => ({
  itemData: { value: { status: 4 } },
  fetchOneMock: vi.fn(),
  updateMock: vi.fn(),
  fetchListMock: vi.fn(),
  routerPushMock: vi.fn(),
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
  useRoute: () => ({ params: { id: '8' }, fullPath: '/plans/edit/8' }),
  useRouter: () => ({ push: routerPushMock }),
}));

const global = {
  mocks: { $t: (key: string) => key },
  stubs: {
    PlanForm: {
      name: 'PlanForm',
      emits: ['updateData', 'validityChange'],
      methods: { validate: () => Promise.resolve(true) },
      template: '<div class="plan-form-stub" />',
    },
    DraftPlanDialog: {
      name: 'DraftPlanDialog',
      props: ['modelValue'],
      emits: ['update:modelValue', 'acknowledge'],
      template: '<div class="draft-dialog-stub" />',
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
    updateMock.mockResolvedValue({ data: {} });
    fetchListMock.mockResolvedValue(undefined);
  });

  it('hides edit actions until the plan data changes', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();

    expect(wrapper.find('.actions').exists()).toBe(false);

    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', params());
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.actions button')).toHaveLength(2);
    expect(wrapper.find('.publish-button').exists()).toBe(true);
    expect(wrapper.find('.btn-draft').exists()).toBe(true);
    expect(wrapper.find('.btn-cancel').exists()).toBe(false);
  });

  it('publishes a draft as active', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const planParams = params();
    const form = wrapper.getComponent({ name: 'PlanForm' });
    form.vm.$emit('updateData', planParams);
    form.vm.$emit('validityChange', true);
    await wrapper.vm.$nextTick();

    await wrapper.get('.publish-button').trigger('click');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.ACTIVE);
    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Plans' });
  });

  it('keeps draft status when saving a draft', async () => {
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();
    const planParams = params();
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', planParams);
    await wrapper.vm.$nextTick();

    await wrapper.get('.btn-draft').trigger('click');
    const dialog = wrapper.getComponent({ name: 'DraftPlanDialog' });
    expect(dialog.props('modelValue')).toBe(true);
    expect(updateMock).not.toHaveBeenCalled();

    dialog.vm.$emit('acknowledge');
    await flushPromises();

    expect(updateMock.mock.calls[0]?.[0].status).toBe(PlanStatusEnum.DRAFT);
    expect(routerPushMock).toHaveBeenCalledWith({ name: 'Plans' });
  });

  it('uses the same change-triggered actions for a non-draft plan', async () => {
    itemData.value = { status: PlanStatusEnum.ACTIVE };
    const wrapper = mount(PlanEdit, { global });
    await flushPromises();

    expect(wrapper.find('.actions').exists()).toBe(false);

    const changedParams = params();
    changedParams.status = PlanStatusEnum.ACTIVE;
    wrapper.getComponent({ name: 'PlanForm' }).vm.$emit('updateData', changedParams);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.publish-button').exists()).toBe(true);
    expect(wrapper.find('.btn-draft').exists()).toBe(true);
  });
});
