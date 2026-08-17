import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NoItemContainer from '../NoItemContainer.vue';

describe('NoItemContainer', () => {
  it('renders the supplied empty-state content and image', () => {
    const wrapper = mount(NoItemContainer, {
      props: {
        image: '/empty-state.png',
        title: 'No results',
        description: 'Try changing the filters.',
      },
    });

    expect(wrapper.get('img').attributes('src')).toBe('/empty-state.png');
    expect(wrapper.get('h2').text()).toBe('No results');
    expect(wrapper.get('p').text()).toBe('Try changing the filters.');
  });
});
