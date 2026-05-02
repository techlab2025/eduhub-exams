import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AboutIndex from '../AboutIndex.vue';

describe('AboutIndex', () => {
  it('renders without errors', () => {
    const wrapper = mount(AboutIndex);
    expect(wrapper.exists()).toBe(true);
  });
});
