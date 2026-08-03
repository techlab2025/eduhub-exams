import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import en from '@/locales/en.json';
import TitleInterface from '@/base/Data/Models/titleInterface';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import PlacementSkillAnalysisModel from '@/modules/PlacementTest/core/models/subModels/placment.skill.analysis.model';
import PlacementSkillsAnalysis from '../PlacementSkillsAnalysis.vue';

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

describe('PlacementSkillsAnalysis', () => {
  it('renders progress, important skills, and development skills', () => {
    const skill = new PlacementSkillAnalysisModel({
      skill: new TitleInterface({ id: 1, title: 'Understanding' }),
      precentage: 90,
    });
    const placementTest = new ShowPlcaementTestModel({
      SkillsAnalysis: [skill],
      MostImportantSkillsAnalysis: [skill],
      NeedDevelopSkillsAnalysis: [skill],
    });

    const wrapper = mount(PlacementSkillsAnalysis, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Skills Analysis');
    expect(wrapper.text()).toContain('Understanding');
    expect(wrapper.text()).toContain('90%');
  });
});
