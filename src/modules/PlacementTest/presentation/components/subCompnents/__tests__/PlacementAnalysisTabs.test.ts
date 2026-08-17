import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import TitleInterface from '@/base/Data/Models/titleInterface';
import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import PlacementSkillAnalysisModel from '@/modules/PlacementTest/core/models/subModels/placment.skill.analysis.model';
import QuestionAnswerAnalysisModel from '@/modules/PlacementTest/core/models/subModels/question.answer.analysis.model';
import PlacementAnalysisTabs from '../PlacementAnalysisTabs.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

const strongQuestion = new ShowQuestionsModel({
  id: 1,
  questionTitle: 'Strong question',
  question_description: 'Strong question details',
  questionType: QuestionTypeEnum.mcq,
  difficulty: QuestionDifficultyEnum.easy,
  correctStatus: 1,
  subjectTree: new TitleInterface({ id: 1, title: 'Unit 1', full_title: 'Unit 1 / Chapter 1' }),
  topics: [new TitleInterface({ id: 11, title: 'Strong Topic' })],
});

const weakQuestion = new ShowQuestionsModel({
  id: 2,
  questionTitle: 'Weak question',
  questionType: QuestionTypeEnum.true_false,
  difficulty: QuestionDifficultyEnum.hard,
  correctStatus: 0,
  subjectTree: new TitleInterface({ id: 2, title: 'Unit 2', full_title: 'Unit 2 / Chapter 2' }),
  topics: [new TitleInterface({ id: 22, title: 'Weak Topic' })],
});

const skill = new PlacementSkillAnalysisModel({
  skill: new TitleInterface({ id: 1, title: 'Understanding' }),
  precentage: 90,
});

const placementTest = new ShowPlcaementTestModel({
  SkillsAnalysis: [skill],
  MostImportantSkillsAnalysis: [skill],
  NeedDevelopSkillsAnalysis: [
    new PlacementSkillAnalysisModel({
      skill: new TitleInterface({ id: 2, title: 'Application' }),
      precentage: 10,
    }),
  ],
  quesions: [strongQuestion, weakQuestion],
  questionAnswerAnalysis: [
    new QuestionAnswerAnalysisModel({
      question: new TitleInterface({ id: 1, title: 'Strong question' }),
      questionAnswerDuration: 35,
    }),
  ],
});

describe('PlacementAnalysisTabs', () => {
  it('renders question analysis by default', () => {
    const wrapper = mount(PlacementAnalysisTabs, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Strong question');
    expect(wrapper.text()).toContain('Weak question');
    expect(wrapper.get('[data-tab="questions"]').classes()).toContain(
      'placement-analysis-tabs__tab--active',
    );
  });

  it('switches to curriculum and filters it using the enum values', async () => {
    const wrapper = mount(PlacementAnalysisTabs, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    await wrapper.get('[data-tab="curriculum"]').trigger('click');
    expect(wrapper.text()).toContain('Strong Topic');
    expect(wrapper.text()).toContain('Weak Topic');

    await wrapper.get('[data-filter="weak"]').trigger('click');
    expect(wrapper.text()).not.toContain('Strong Topic');
    expect(wrapper.text()).toContain('Weak Topic');
  });

  it('switches to questions and displays question data and duration', async () => {
    const wrapper = mount(PlacementAnalysisTabs, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    await wrapper.get('[data-tab="questions"]').trigger('click');
    expect(wrapper.text()).toContain('Strong question');
    expect(wrapper.text()).toContain('Weak question');
    expect(wrapper.text()).toContain('35 s');

    await wrapper.get('.question-analysis-card__toggle').trigger('click');
    expect(wrapper.text()).toContain('Strong question details');
  });
});
