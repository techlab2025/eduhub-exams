import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PricingDialog from '../PricingDialog.vue';

// Mock PrimeVue Dialog
vi.mock('primevue/dialog', () => ({
  default: {
    template: '<div v-if="visible"><slot name="header" /><slot /></div>',
    props: ['visible'],
  },
}));

// Mock controller
vi.mock('../../presentation/controllers/EducationPricing/education.pricing.controller', () => ({
  default: {
    getInstance: () => ({
      create: vi.fn(),
    }),
  },
}));

describe('PricingDialog.vue', () => {
  const defaultProps = {
    visible: true,
    level: 1,
    branchName: 'Test Branch',
    branchId: 123,
  };

  it('renders correctly', () => {
    const wrapper = mount(PricingDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
        stubs: {
          PricingDIalogIcon: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
