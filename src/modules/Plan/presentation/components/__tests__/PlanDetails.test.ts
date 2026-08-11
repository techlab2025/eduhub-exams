import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PlanDetailsModel from '../../../core/models/plan.details.model';
import PlanDetails from '../PlanDetails.vue';

const { fetchOneMock, routerPushMock, itemData } = vi.hoisted(() => ({
  fetchOneMock: vi.fn(),
  routerPushMock: vi.fn(),
  itemData: { value: null as PlanDetailsModel | null },
}));

vi.mock('../../controllers/plan.controller', () => ({
  default: {
    getInstance: () => ({ itemData, fetchOne: fetchOneMock }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '5' } }),
  useRouter: () => ({ push: routerPushMock }),
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
const mountComponent = () =>
  mount(PlanDetails, {
    global: {
      plugins: [i18n],
      stubs: {
        ActionsIcon: true,
        EmployeeIcon: true,
        IconClock: true,
        EditIcon: true,
        PricingIcon: true,
      },
    },
  });

describe('PlanDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    itemData.value = PlanDetailsModel.example;
  });

  it('renders summary, pricing, and included features from the details model', () => {
    const wrapper = mountComponent();

    expect(wrapper.get('h1').text()).toBe('The Complete Plan');
    expect(wrapper.find('.pricing-details').exists()).toBe(true);
    expect(wrapper.find('.included-features').exists()).toBe(true);
    expect(wrapper.findAll('.feature-group')).toHaveLength(1);
    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toEqual({ plan_id: 5 });
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

  it('opens the plan edit route from the action button', async () => {
    const wrapper = mountComponent();

    await wrapper.get('.icon-button').trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith('/plans/edit/5');
  });
});
