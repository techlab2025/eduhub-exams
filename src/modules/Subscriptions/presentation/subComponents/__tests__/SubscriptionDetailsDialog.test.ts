import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Component from '../SubscriptionDetailsDialog.vue';

const mocks = vi.hoisted(() => ({
  fetchOne: vi.fn().mockResolvedValue(undefined),
  itemData: {
    __v_isRef: true,
    value: {
      user: { id: 1, name: 'Ahmed Hawam', serial: 'Stu-124' },
      educationType: { id: 1, title: 'International-Primary - Grade 1' },
      plan: {
        id: 1,
        title: 'Starter Plan',
        status: '1',
        totalPaid: '150 L.E',
        paymentMethod: 'Visa',
        subscribeDate: '20-6-2026',
        expireDate: '20-7-2026',
      },
    },
  },
  isItemLoading: vi.fn(() => false),
}));

vi.mock('../../controllers/subscription.controller', () => ({
  default: {
    getInstance: () => mocks,
  },
}));

describe('SubscriptionDetailsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.itemData.value.plan.status = '1';
  });

  it('fetches and renders the selected subscription details, then closes', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: true,
        subscriptionId: 7,
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
      },
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          Dialog: {
            props: ['visible'],
            template: '<div v-if="visible"><slot name="container" /></div>',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Ahmed Hawam');
    expect(wrapper.text()).toContain('Starter Plan');
    expect(wrapper.text()).toContain('150 L.E');
    expect(mocks.fetchOne).toHaveBeenCalledOnce();
    expect(mocks.fetchOne.mock.calls[0][0].toMap()).toEqual({ subscription_id: 7 });

    await wrapper.find('header button').trigger('click');

    expect(wrapper.props('modelValue')).toBe(false);
  });

  it('renders pending subscriptions with the pending status style', () => {
    mocks.itemData.value.plan.status = '0';

    const wrapper = mount(Component, {
      props: { modelValue: true, subscriptionId: 7 },
      global: {
        mocks: { $t: (key: string) => key },
        stubs: {
          Dialog: {
            props: ['visible'],
            template: '<div v-if="visible"><slot name="container" /></div>',
          },
        },
      },
    });

    const status = wrapper.get('.details-status');

    expect(status.classes()).toContain('details-status-0');
    expect(status.text()).toBe('subscription_status_0');
  });
});
