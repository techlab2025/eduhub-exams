import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import IconDimoned from '../IconDimoned.vue';

describe('IconDimoned', () => {
  it('renders its svg', () => {
    expect(shallowMount(IconDimoned).find('svg').exists()).toBe(true);
  });
});
