import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DocumentTypeDialog from '../DocumentTypeDialog.vue';

describe('DocumentTypeDialog', () => {
  it('renders without errors', () => {
    const wrapper = mount(DocumentTypeDialog, {
      props: { visible: false },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
