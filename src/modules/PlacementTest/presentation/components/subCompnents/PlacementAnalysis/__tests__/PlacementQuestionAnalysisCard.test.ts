import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import AnswerModel from '@/modules/Questions/core/models/subModels/answer.model';
import PlacementQuestionAnalysisCard from '../PlacementQuestionAnalysisCard.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

describe('PlacementQuestionAnalysisCard', () => {
  it('renders question metadata, duration, and expandable details', async () => {
    const question = new ShowQuestionsModel({
      id: 1,
      questionTitle: 'Question title',
      questionType: QuestionTypeEnum.mcq,
      difficulty: QuestionDifficultyEnum.hard,
      correctStatus: 0,
      note: 'High',
      answers: [new AnswerModel({ id: 1, answer: 'Heart', is_right_answer: true })],
      questionLogHistory: [
        { time: '5:15 PM', status: 'Submit', createdBy: 'First Answer (Heart)' },
      ],
    });

    const wrapper = mount(PlacementQuestionAnalysisCard, {
      props: { question, number: 1, duration: 80 },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('MCQ');
    expect(wrapper.text()).toContain('Hard');
    expect(wrapper.text()).toContain('1min : 20s');
    expect(wrapper.text()).toContain('High');
    await wrapper.get('button').trigger('click');
    expect(wrapper.text()).toContain('Heart');
    expect(wrapper.text()).toContain('Correct Answer');
    expect(wrapper.text()).toContain('History Log');
    expect(wrapper.text()).toContain('First Answer (Heart)');
  });
});
