import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StageTreeSkeleton from '../StageTreeSkeleton.vue';

describe('StageTreeSkeleton', () => {
  it('renders the expected loading placeholders for both tree panels', () => {
    const wrapper = mount(StageTreeSkeleton);

    expect(wrapper.findAll('.skeleton-tree-node')).toHaveLength(6);
    expect(wrapper.findAll('.right-child-row')).toHaveLength(5);
    expect(wrapper.find('.skeleton-search').exists()).toBe(true);
  });
});
