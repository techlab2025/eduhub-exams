import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ContentItem from '../ContentItem.vue';

describe('faqs/ContentItem', () => {
  it('renders without errors', () => {
    const wrapper = mount(ContentItem, {
      props: { item: { content: 'test', header: 'h', id: 1, text: 'txt' } },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
