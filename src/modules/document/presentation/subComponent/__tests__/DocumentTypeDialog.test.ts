import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DocumentTypeDialog from '../DocumentTypeDialog.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: { page: '1' },
    params: { country_code: 'eg' },
  }),
}));

describe('DocumentTypeDialog', () => {
  it('renders without errors', () => {
    const wrapper = mount(DocumentTypeDialog, {
      props: { visible: false },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
