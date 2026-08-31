import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AiArrow from '../AiArrow.vue';

describe('AiArrow', () => {
  it('renders its svg using the inherited text color', () => {
    const wrapper = shallowMount(AiArrow);

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('path').attributes('fill')).toBe('currentColor');
  });
});
