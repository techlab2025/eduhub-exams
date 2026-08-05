import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PlansCreat from '../PlansCreat.vue';

describe('PlansCreat', () => {
  it('renders its svg', () => {
    expect(shallowMount(PlansCreat).find('svg').exists()).toBe(true);
  });
});
