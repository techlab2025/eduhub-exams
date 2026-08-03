import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import PlacementQuestionsAnalysis from '../PlacementQuestionsAnalysis.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

describe('PlacementQuestionsAnalysis', () => {
  it('renders regular and article questions', () => {
    const childQuestion = new ShowQuestionsModel({ id: 3, questionTitle: 'Nested question' });
    const placementTest = new ShowPlcaementTestModel({
      quesions: [
        new ShowQuestionsModel({ id: 1, questionTitle: 'Regular question' }),
        new ShowQuestionsModel({
          id: 2,
          questionTitle: 'Tourism Article',
          question_description: 'Article description',
          number_of_questions: 1,
          questions: [childQuestion],
        }),
      ],
    });

    const wrapper = mount(PlacementQuestionsAnalysis, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Regular question');
    expect(wrapper.text()).toContain('Article Question');
    expect(wrapper.text()).toContain('Tourism Article');
    expect(wrapper.text()).toContain('Nested question');
  });
});
