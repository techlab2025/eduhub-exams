import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Totalexam from '../Totalexam.vue';

describe('Totalexam', () => {
  it('renders its svg', () => {
    expect(shallowMount(Totalexam).find('svg').exists()).toBe(true);
  });
});
