import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import EducationClassificationConfigurationForm from '../EducationClassificationConfigurationForm.vue';
import EducationConfigurationModel from '../../../core/models/EducationConfiguration/education.configuration.model';
import EducationSubjectConfigurationModel from '../../../core/models/EducationConfiguration/education.subject.configuration.model';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      number_of_branches_integer_warning: 'Number of branches should be an integer',
    },
  },
});

// ── Shared controller mock objects ────────────────────────────────────────────
const mockConfigFetchList = vi.fn();
const mockSubjectFetchList = vi.fn();
const mockConfigCreate = vi.fn();
const mockSubjectCreate = vi.fn();

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationConfiguration/education.configuration.controller',
  () => ({
    default: {
      getInstance: () => ({
        fetchList: mockConfigFetchList,
        create: mockConfigCreate,
        listState: { value: {} },
      }),
    },
  }),
);

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationSubject/education.subject.controller',
  () => ({
    default: {
      getInstance: () => ({
        fetchList: mockSubjectFetchList,
        create: mockSubjectCreate,
        listState: { value: {} },
      }),
    },
  }),
);

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ query: {}, params: {} }),
}));

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: () => ({
    getFormData: vi.fn().mockReturnValue(null),
    setFormData: vi.fn(),
    showReturnWarning: vi.fn(),
    clearFormData: vi.fn(),
  }),
}));

vi.mock('@/shared/icons/FolderCrudIcon.vue', () => ({
  default: { name: 'FolderCrudIcon', template: '<span />' },
}));

const mountForm = (props: Record<string, unknown> = {}) =>
  mount(EducationClassificationConfigurationForm, {
    props,
    global: {
      plugins: [i18n],
      mocks: { $t: (k: string) => k },
      // Stub child components so their buttons don't pollute the DOM
      stubs: {
        SingularPluralForm: {
          name: 'SingularPluralForm',
          template: '<div class="singular-plural-stub" />',
          emits: ['update'],
        },
        MultiLangInput: { template: '<div class="multi-lang-stub" />' },
      },
    },
  });

describe('EducationClassificationConfigurationForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockConfigFetchList.mockResolvedValue(
      new DataSuccess({ data: [EducationConfigurationModel.example] }),
    );
    mockSubjectFetchList.mockResolvedValue(
      new DataSuccess({ data: [EducationSubjectConfigurationModel.example] }),
    );
    mockConfigCreate.mockResolvedValue(
      new DataSuccess({ data: EducationConfigurationModel.example }),
    );
  });

  describe('rendering', () => {
    it('renders without crashing', async () => {
      const wrapper = mountForm();
      await flushPromises();
      expect(wrapper.exists()).toBe(true);
    });

    it('renders two form cards', async () => {
      const wrapper = mountForm();
      await flushPromises();
      expect(wrapper.findAll('.education-classification-form-card')).toHaveLength(2);
    });

    it('renders configuration and subject number inputs', async () => {
      const wrapper = mountForm();
      await flushPromises();
      expect(wrapper.findAll('input[type="number"]')).toHaveLength(2);
    });
  });

  describe('onMounted data fetch', () => {
    it('calls fetchList on both controllers on mount', async () => {
      mountForm();
      await flushPromises();

      expect(mockConfigFetchList).toHaveBeenCalledTimes(1);
      expect(mockSubjectFetchList).toHaveBeenCalledTimes(1);
    });

    it('fills configuration number input from API DataSuccess response', async () => {
      const wrapper = mountForm();
      await flushPromises();

      const inputs = wrapper.findAll('input[type="number"]');
      expect((inputs[0].element as HTMLInputElement).valueAsNumber).toBe(
        EducationConfigurationModel.example.numberOfBranches,
      );
    });

    it('fills subject number input from API DataSuccess response', async () => {
      const wrapper = mountForm();
      await flushPromises();

      const inputs = wrapper.findAll('input[type="number"]');
      expect((inputs[1].element as HTMLInputElement).valueAsNumber).toBe(
        EducationSubjectConfigurationModel.example.numberOfBranches,
      );
    });

    it('keeps the default branch count when fetchList does not return DataSuccess', async () => {
      mockConfigFetchList.mockResolvedValue({ data: null });
      mockSubjectFetchList.mockResolvedValue({ data: null });

      const wrapper = mountForm();
      await flushPromises();

      expect(wrapper.exists()).toBe(true);
      const inputs = wrapper.findAll('input[type="number"]');
      expect((inputs[0].element as HTMLInputElement).valueAsNumber).toBe(0);
    });

    it('disables education content when basic configuration has no data', async () => {
      mockConfigFetchList.mockResolvedValue({ data: null });
      const wrapper = mountForm();
      await flushPromises();

      const educationContent = wrapper.get('.education-content-card');
      expect(educationContent.classes()).toContain('configuration-locked');
      expect(educationContent.attributes('aria-disabled')).toBe('true');
      expect(educationContent.get('button.save-btn').attributes('disabled')).toBeDefined();
    });

    it('enables education content after basic configuration is successfully saved', async () => {
      mockConfigFetchList.mockResolvedValue({ data: null });
      const wrapper = mountForm();
      await flushPromises();

      await wrapper.get('#title').setValue('1');
      await wrapper.findAll('button.save-btn')[0].trigger('click');
      wrapper
        .getComponent({ name: 'SingularPluralForm' })
        .vm.$emit('update', [
          { singular: { en: 'Level', ar: 'مستوى' }, plural: { en: 'Levels', ar: 'مستويات' } },
        ]);
      await flushPromises();

      expect(mockConfigCreate).toHaveBeenCalledOnce();
      expect(wrapper.get('.education-content-card').classes()).not.toContain(
        'configuration-locked',
      );
      expect(wrapper.get('.education-content-card').attributes('aria-disabled')).toBe('false');
    });
  });

  describe('apply buttons', () => {
    it('renders two apply buttons', async () => {
      const wrapper = mountForm();
      await flushPromises();
      // With SingularPluralForm stubbed, only 2 save-btn buttons exist
      expect(wrapper.findAll('button.save-btn')).toHaveLength(2);
    });

    it('clicking the first Apply button emits save-education-classification', async () => {
      const wrapper = mountForm();
      await flushPromises();

      const applyBtns = wrapper.findAll('button.save-btn');
      await applyBtns[0].trigger('click');

      expect(wrapper.emitted('save-education-classification')).toBeTruthy();
    });

    it('clicking the second Apply button emits save-education-subjects', async () => {
      const wrapper = mountForm();
      await flushPromises();

      const applyBtns = wrapper.findAll('button.save-btn');
      await applyBtns[1].trigger('click');

      expect(wrapper.emitted('save-education-subjects')).toBeTruthy();
    });

    it.each([
      [0, 'save-education-classification', 'configuration-branch-error'],
      [1, 'save-education-subjects', 'subject-branch-error'],
    ])(
      'blocks applying zero for branch input %s and shows the minimum error',
      async (inputIndex, eventName, errorId) => {
        const wrapper = mountForm();
        await flushPromises();
        const input = wrapper.findAll('input[type="number"]')[inputIndex as number];
        const applyButton = wrapper.findAll('button.save-btn')[inputIndex as number];

        await input.setValue('0');
        await applyButton.trigger('click');

        expect(wrapper.emitted(eventName as string)).toBeUndefined();
        expect(wrapper.get(`#${errorId}`).text()).toBe('branch_count_minimum_error');
        expect(input.attributes('aria-invalid')).toBe('true');
      },
    );

    it('clears the minimum error after entering a valid number', async () => {
      const wrapper = mountForm();
      await flushPromises();
      const input = wrapper.findAll('input[type="number"]')[0];

      await input.setValue('0');
      await wrapper.findAll('button.save-btn')[0].trigger('click');
      await input.setValue('1');

      expect(wrapper.find('#configuration-branch-error').exists()).toBe(false);
      expect(input.attributes('aria-invalid')).toBe('false');
    });

    it.each([0, 1])('warns and removes decimals from branch input %s', async (inputIndex) => {
      const toastWarningSpy = vi
        .spyOn(dialogManager, 'toastWarning')
        .mockImplementation(() => undefined);
      const wrapper = mountForm();
      await flushPromises();
      const input = wrapper.findAll('input[type="number"]')[inputIndex];

      await input.setValue('2.6');

      expect(toastWarningSpy).toHaveBeenCalledWith('Number of branches should be an integer');
      expect((input.element as HTMLInputElement).valueAsNumber).toBe(2);
    });
  });
});
