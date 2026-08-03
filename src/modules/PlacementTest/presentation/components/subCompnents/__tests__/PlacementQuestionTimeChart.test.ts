import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import PlacemntAllocationModel, {
  PlacemntAllocationQuestionModel,
} from '@/modules/PlacementTest/core/models/subModels/placementallocation.model';
import PlacementQuestionTimeChart from '../PlacementQuestionTimeChart.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      placement_test: {
        time_allocation_each_question: 'Time Allocation For Each Question',
        seconds_short: 's',
        question_number_short: '{number}Q',
        question_time_label: 'Question {number}: {seconds} seconds',
        no_question_time_data: 'No question time data available',
        questions_answered_difficulty: 'Questions Answered by Difficulty Level',
        correct: 'Correct',
        wrong: 'Wrong',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
    },
  },
});

describe('PlacementQuestionTimeChart', () => {
  it('renders question durations, statuses, and difficulty totals from the placement model', () => {
    const placementTest = new ShowPlcaementTestModel({
      allocation: new PlacemntAllocationModel({
        allTime: [
          new PlacemntAllocationQuestionModel({
            time: 15,
            difficultyLevel: 3,
            correctStatus: 0,
            questionNumber: 1,
          }),
          new PlacemntAllocationQuestionModel({
            time: 32,
            difficultyLevel: 2,
            correctStatus: 1,
            questionNumber: 2,
          }),
          new PlacemntAllocationQuestionModel({
            time: 46,
            difficultyLevel: 1,
            correctStatus: 1,
            questionNumber: 3,
          }),
        ],
        Easy: 20,
        totalnumberEasy: 20,
        Medium: 55,
        totalnumberMedium: 60,
        Hard: 10,
        totalnumberHard: 20,
      }),
    });

    const wrapper = mount(PlacementQuestionTimeChart, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Time Allocation For Each Question');
    expect(wrapper.text()).toContain('1Q');
    expect(wrapper.text()).toContain('2Q');
    expect(wrapper.text()).toContain('3Q');
    expect(wrapper.text()).toContain('Questions Answered by Difficulty Level');
    expect(wrapper.text()).toContain('20 / 20');
    expect(wrapper.text()).toContain('55 / 60');
    expect(wrapper.text()).toContain('10 / 20');
    expect(wrapper.findAll('.question-time-chart__answer-status')).toHaveLength(3);
    expect(wrapper.find('.question-time-chart__bar--hard').exists()).toBe(true);
    expect(wrapper.find('.question-time-chart__bar--medium').exists()).toBe(true);
    expect(wrapper.find('.question-time-chart__bar--easy').exists()).toBe(true);
  });

  it('renders the empty state when no duration data is available', () => {
    const wrapper = mount(PlacementQuestionTimeChart, {
      props: { placementTest: new ShowPlcaementTestModel({}) },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('No question time data available');
  });
});
