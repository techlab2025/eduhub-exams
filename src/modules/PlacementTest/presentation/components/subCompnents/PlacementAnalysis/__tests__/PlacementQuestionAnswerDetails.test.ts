import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import AnswerModel from '@/modules/Questions/core/models/subModels/answer.model';
import PlacementQuestionAnswerDetails from '../PlacementQuestionAnswerDetails.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

describe('PlacementQuestionAnswerDetails', () => {
  it('renders answers and history directly from the question model', () => {
    const question = new ShowQuestionsModel({
      question_description: 'Question details',
      answers: [
        new AnswerModel({ id: 1, answer: 'Heart', is_right_answer: true }),
        new AnswerModel({ id: 2, answer: 'Cell', is_right_answer: false }),
      ],
      questionLogHistory: [
        { time: '5:15 PM', status: 'Submit', createdBy: 'Second Answer (Cell)' },
      ],
    });

    const wrapper = mount(PlacementQuestionAnswerDetails, {
      props: { question },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Question details');
    expect(wrapper.text()).toContain('Heart');
    expect(wrapper.text()).toContain('Cell');
    expect(wrapper.text()).toContain('Correct Answer');
    expect(wrapper.text()).toContain('5:15 PM');
    expect(wrapper.text()).toContain('Submit');
    expect(wrapper.text()).toContain('Second Answer (Cell)');
  });
});
