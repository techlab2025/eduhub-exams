import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import EducationClassificationForm from '../EducationClassificationForm.vue';
import EducationClassificationModel from '../../../core/models/education.classification.model';

// Shared mock store — one instance reused across all calls so component and test share it
const mockGetFormData = vi.fn().mockReturnValue(null);
const mockSetFormData = vi.fn();

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ query: {}, params: {} }),
}));

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: () => ({
    getFormData: mockGetFormData,
    setFormData: mockSetFormData,
    showReturnWarning: vi.fn(),
    clearFormData: vi.fn(),
  }),
}));

vi.mock('@/shared/icons/FolderCrudIcon.vue', () => ({
  default: { name: 'FolderCrudIcon', template: '<span />' },
}));

const mountForm = (props: Record<string, unknown> = {}) =>
  mount(EducationClassificationForm, {
    props,
    global: { mocks: { $t: (k: string) => k } },
  });

describe('EducationClassificationForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockGetFormData.mockReset().mockReturnValue(null);
    mockSetFormData.mockReset();
  });

  describe('rendering', () => {
    it('renders without crashing', async () => {
      const wrapper = mountForm();
      await flushPromises();
      expect(wrapper.exists()).toBe(true);
    });

    it('renders a title input field', async () => {
      const wrapper = mountForm();
      await flushPromises();
      expect(wrapper.find('input#title').exists()).toBe(true);
    });

    it('renders a Save button', async () => {
      const wrapper = mountForm();
      await flushPromises();
      expect(wrapper.find('button.save-btn').exists()).toBe(true);
    });
  });

  describe('country prop', () => {
    it('pre-fills title input when country prop is provided', async () => {
      const country = new EducationClassificationModel({
        id: 1,
        title: 'Basic Education',
        created_at: '2022-01-01',
        status: true,
      });
      const wrapper = mountForm({ country });
      await nextTick();
      await nextTick();

      const input = wrapper.find('input#title');
      expect((input.element as HTMLInputElement).value).toBe('Basic Education');
    });

    it('leaves title empty when no country prop provided', async () => {
      const wrapper = mountForm();
      await flushPromises();

      expect((wrapper.find('input#title').element as HTMLInputElement).value).toBe('');
    });
  });

  describe('emit events', () => {
    it('emits save-education-classification when Save button is clicked', async () => {
      const wrapper = mountForm();
      await flushPromises();

      await wrapper.find('button.save-btn').trigger('click');

      expect(wrapper.emitted('save-education-classification')).toBeTruthy();
    });

    it('emits updateData with params when title input changes', async () => {
      const wrapper = mountForm();
      await flushPromises();

      await wrapper.find('input#title').setValue('New Classification');
      await wrapper.find('input#title').trigger('input');

      expect(wrapper.emitted('updateData')).toBeTruthy();
      const emittedParams = wrapper.emitted('updateData')![0][0] as any;
      expect(emittedParams.title).toBe('New Classification');
    });
  });

  describe('form store integration', () => {
    it('restores title from saved form data on mount', async () => {
      mockGetFormData.mockReturnValue({ title: 'Saved Title' });

      const wrapper = mountForm({ formKey: 'test-key' });
      await flushPromises();
      await nextTick();

      expect((wrapper.find('input#title').element as HTMLInputElement).value).toBe('Saved Title');
    });

    it('calls setFormData when title changes', async () => {
      const wrapper = mountForm({ formKey: 'my-key' });
      await flushPromises();

      await wrapper.find('input#title').setValue('Test Title');
      await wrapper.find('input#title').trigger('input');

      expect(mockSetFormData).toHaveBeenCalledWith(
        'my-key',
        expect.objectContaining({ title: 'Test Title' }),
      );
    });
  });
});
