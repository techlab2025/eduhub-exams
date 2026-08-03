import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlacementTestShow from '../PlacementTestShow.vue';

const fetchOne = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '12' } }),
}));

vi.mock('../../controllers/placement.test.controller', () => ({
  default: {
    getInstance: () => ({
      itemState: { value: {} },
      fetchOne,
    }),
  },
}));

describe('PlacementTestShow', () => {
  beforeEach(() => {
    fetchOne.mockClear();
  });

  it('fetches the placement test details when mounted', () => {
    const wrapper = shallowMount(PlacementTestShow);

    expect(wrapper.exists()).toBe(true);
    expect(fetchOne).toHaveBeenCalledOnce();
  });
});
