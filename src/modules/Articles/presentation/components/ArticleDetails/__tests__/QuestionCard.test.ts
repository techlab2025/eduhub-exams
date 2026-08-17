import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import QuestionCard from '../QuestionCard.vue';
import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '42' } }),
}));

vi.mock('../../../controllers/Article.controller', () => ({
  default: { getInstance: () => ({ delete: vi.fn(), fetchOne: vi.fn() }) },
}));

const mockQuestions = [
  {
    id: 1,
    question_id: 1,
    questionTitle: 'Which of the following is correct?',
    createdAt: '2026-05-31',
    difficulty: QuestionDifficultyEnum.easy,
    questionType: QuestionTypeEnum.mcq,
    answers: [
      {
        answer: 'Correct Answer',
        is_right_answer: true,
      },
      {
        answer: 'Incorrect Answer',
        is_right_answer: false,
      },
    ],
  },
  {
    id: 2,
    question_id: 2,
    questionTitle: 'True or False question?',
    createdAt: '2026-05-31',
    difficulty: QuestionDifficultyEnum.hard,
    questionType: QuestionTypeEnum.true_false,
    answers: [],
  },
] as unknown as ShowQuestionsModel[];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { easy: 'Easy', hard: 'Hard', MCQ: 'MCQ', 'True/False': 'True/False' } },
});

const mountCard = () =>
  mount(QuestionCard, {
    props: { allquestion: mockQuestions },
    global: {
      plugins: [i18n],
      mocks: { $t: (key: string) => key },
      stubs: { DropList: true, McqIcon: true, TrueFalse: true, MatcingingIcon: true },
    },
  });

describe('QuestionCard.vue', () => {
  it('renders correctly with given questions', () => {
    const wrapper = mountCard();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll('.num-question')).toHaveLength(2);
  });

  it('displays correct question texts and indices', () => {
    const wrapper = mountCard();

    const headers = wrapper.findAll('.header-card h6');
    expect(headers[0].text()).toContain('questions 1');
    expect(headers[1].text()).toContain('questions 2');

    const texts = wrapper.findAll('.question_text p');
    expect(texts[0].text()).toBe('Which of the following is correct?');
    expect(texts[1].text()).toBe('True or False question?');
  });

  it('applies correct CSS classes for difficulty and status/type', () => {
    const wrapper = mountCard();

    const difficultySpans = wrapper.findAll('.type .value');
    expect(difficultySpans[0].classes()).toContain('Easy');
    expect(difficultySpans[0].text()).toBe('Easy');
    expect(difficultySpans[1].classes()).toContain('Hard');
    expect(difficultySpans[1].text()).toBe('Hard');

    const statusSpans = wrapper.findAll('.type .value-status');
    expect(statusSpans[0].classes()).toContain('MCQ');
    expect(statusSpans[0].text()).toContain('MCQ');
    expect(statusSpans[1].classes()).toContain('True/False');
    expect(statusSpans[1].text()).toContain('True/False');
  });

  it('renders answer options correctly', () => {
    const wrapper = mountCard();

    const answers = wrapper.findAll('.answer');
    expect(answers).toHaveLength(2);

    expect(answers[0].find('.answer_text').text()).toBe('Correct Answer');
    expect(answers[1].find('.answer_text').text()).toBe('Incorrect Answer');
  });
});
