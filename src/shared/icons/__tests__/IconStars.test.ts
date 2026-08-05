import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import IconStars from '../IconStars.vue';

describe('IconStars', () => {
  it('renders its svg', () => {
    expect(shallowMount(IconStars).find('svg').exists()).toBe(true);
  });
});
