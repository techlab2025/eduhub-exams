import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AboutForm from '../AboutForm.vue';

describe('AboutForm', () => {
  it('renders without errors', () => {
    const wrapper = mount(AboutForm, {
      props: { formKey: 'test-key' },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
