import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PLanDetailsSkelaton from '../PLanDetailsSkelaton.vue';

describe('PLanDetailsSkelaton', () => {
  it('renders placeholders for each plan details section', () => {
    const wrapper = mount(PLanDetailsSkelaton);

    expect(wrapper.get('.plan-details-skeleton').attributes('aria-hidden')).toBe('true');
    expect(wrapper.findAll('.meta-item')).toHaveLength(5);
    expect(wrapper.findAll('.pricing-item')).toHaveLength(4);
    expect(wrapper.findAll('.feature-group')).toHaveLength(3);
  });
});
