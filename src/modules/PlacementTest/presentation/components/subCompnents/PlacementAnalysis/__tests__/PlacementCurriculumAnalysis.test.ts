import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import TitleInterface from '@/base/Data/Models/titleInterface';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import PlacementCurriculumAnalysis from '../PlacementCurriculumAnalysis.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

describe('PlacementCurriculumAnalysis', () => {
  it('renders and filters topics by performance', async () => {
    const placementTest = new ShowPlcaementTestModel({
      quesions: [
        new ShowQuestionsModel({
          id: 1,
          correctStatus: 1,
          subjectTree: new TitleInterface({ id: 1, full_title: 'Unit 1 / Chapter 1' }),
          topics: [new TitleInterface({ id: 11, title: 'Strong Topic' })],
        }),
        new ShowQuestionsModel({
          id: 2,
          correctStatus: 0,
          subjectTree: new TitleInterface({ id: 2, full_title: 'Unit 2 / Chapter 2' }),
          topics: [new TitleInterface({ id: 22, title: 'Weak Topic' })],
        }),
      ],
    });

    const wrapper = mount(PlacementCurriculumAnalysis, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Strong Topic');
    expect(wrapper.text()).toContain('Weak Topic');
    await wrapper.get('[data-filter="weak"]').trigger('click');
    expect(wrapper.text()).not.toContain('Strong Topic');
    expect(wrapper.text()).toContain('Weak Topic');
  });
});
