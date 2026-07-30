import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import questionsForm from '../questionsForm.vue';

const toastWarningMock = vi.hoisted(() => vi.fn());

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    toastWarning: toastWarningMock,
  },
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

// Mock vue-router
vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    resolve: vi.fn(),
  }),
  useRoute: () => ({
    query: {},
    params: {},
  }),
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    push: vi.fn(),
    resolve: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

// Mock PrimeVue
vi.mock('primevue/config', () => ({
  usePrimeVue: () => ({
    config: { ripple: true },
  }),
}));

describe('questionsForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = mount(questionsForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true,
          Transition: true,
          TransitionGroup: true,
          'router-link': true,
          'router-view': true,
          BasicQuestionDataForm: true,
          QuestionAnswersDataForm: true,
          FolderIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
          $d: (d: unknown) => d,
          $n: (n: unknown) => n,
          $tc: (msg: string) => msg,
        },
        directives: {
          ripple: {},
          tooltip: {},
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('shows validation errors and blocks an incomplete question', async () => {
    const wrapper = mount(questionsForm, {
      global: {
        plugins: [i18n],
        stubs: {
          BasicQuestionDataForm: true,
          QuestionAnswersDataForm: true,
          FolderIcon: true,
        },
      },
    });

    const isValid = await (
      wrapper.vm as unknown as { validate: () => Promise<boolean> }
    ).validate();

    expect(isValid).toBe(false);
    expect(toastWarningMock).toHaveBeenCalledOnce();
    expect(
      wrapper.findComponent({ name: 'BasicQuestionDataForm' }).props('validationErrors'),
    ).toMatchObject({
      title: 'question_title_required',
      subject: 'question_subject_required',
    });
    expect(
      wrapper.findComponent({ name: 'QuestionAnswersDataForm' }).props('validationError'),
    ).toBe('question_answers_required');
  });

  it('accepts a complete question', async () => {
    const wrapper = mount(questionsForm, {
      props: { articleId: 42 },
      global: {
        plugins: [i18n],
        stubs: {
          BasicQuestionDataForm: true,
          QuestionAnswersDataForm: true,
          FolderIcon: true,
        },
      },
    });

    wrapper.findComponent({ name: 'BasicQuestionDataForm' }).vm.$emit('updateData', {
      title: 'Question title',
      questionType: 1,
      subjectId: 1,
      questionSequenceId: 2,
      topics: [{ id: 3 }],
      difficultyLevel: 1,
      skills: [{ skillId: 4, percentage: 100 }],
    });
    wrapper.findComponent({ name: 'QuestionAnswersDataForm' }).vm.$emit('updateData', {
      answers: [
        { title: 'Correct answer', isCorrect: true },
        { title: 'Another answer', isCorrect: false },
      ],
    });
    await wrapper.vm.$nextTick();

    const isValid = await (
      wrapper.vm as unknown as { validate: () => Promise<boolean> }
    ).validate();

    expect(isValid).toBe(true);
    expect(wrapper.emitted('updateData')?.at(-1)?.[0]).toMatchObject({ parentId: 42 });
  });
});
