import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TabsSelection from '../TabsSelection.vue';

// Mock router and controller dependencies
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock(
  '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController',
  () => ({
    default: {
      getInstance: () => ({
        state: { value: { data: [] } },
        FetchMyZones: vi.fn().mockResolvedValue({}),
      }),
    },
  }),
);

describe('TabsSelection', () => {
  it('renders without errors', () => {
    const wrapper = mount(TabsSelection, {
      props: { ProjectId: 1 },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
