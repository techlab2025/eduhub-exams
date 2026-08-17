import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';
import faqsEdit from '../faqsEdit.vue';
import FaqsController from '../../controllers/faqs.controller';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import FaqsModel from '../../../core/models/faqs.model';

// Mock vue-router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useRoute: () => ({
    params: { country_code: 'eg', id: '1' },
  }),
}));

// Create a stable mock instance with reactive refs
const mockInstance = {
  fetchOne: vi.fn(),
  update: vi.fn(),
  itemState: ref(new DataSuccess({ data: new FaqsModel({ id: 1, question: 'q', answer: 'a' }) })),
  errorMessage: ref(''),
};

// Mock FaqsController
vi.mock('../../controllers/faqs.controller', () => {
  return {
    default: {
      getInstance: () => mockInstance,
    },
  };
});

describe('faqsEdit', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockInstance.itemState.value = new DataSuccess({
      data: new FaqsModel({ id: 1, question: 'q', answer: 'a' }),
    });
    mockInstance.fetchOne.mockResolvedValue(mockInstance.itemState.value);
    mockInstance.errorMessage.value = '';
  });

  const mountOptions = {
    global: {
      stubs: {
        FaqsForm: true,
      },
      mocks: {
        $t: (msg: string) => msg,
      },
    },
  };

  it('renders and fetches FAQ on mount', async () => {
    const controller = FaqsController.getInstance();
    const wrapper = mount(faqsEdit, mountOptions);
    await flushPromises();

    expect(controller.fetchOne).toHaveBeenCalled();
    expect(wrapper.find('.faqs-title').text()).toBe('faqs');
  });

  it('calls controller.update when save is clicked', async () => {
    const controller = FaqsController.getInstance();
    const wrapper = mount(faqsEdit, mountOptions);
    await flushPromises();

    const mockParams = { question: { en: 'new q' }, answer: { en: 'new a' } };
    wrapper.getComponent({ name: 'FaqsForm' }).vm.$emit('update-data', mockParams);

    await wrapper.find('.btn-primary').trigger('click');

    expect(controller.update).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/faqs');
  });

  it('redirects to list when cancel is clicked', async () => {
    const wrapper = mount(faqsEdit, mountOptions);
    await flushPromises();

    await wrapper.find('.btn-cancel').trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/faqs');
  });
});
