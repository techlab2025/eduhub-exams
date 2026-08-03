import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import { PlacementTotalRateEnum } from '@/modules/PlacementTest/core/constant/placment.total.rate.enum';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import ResultAnalysisModel from '@/modules/PlacementTest/core/models/subModels/result.analysis.mode';
import PlacementResultAnalysisCard from '../PlacementResultAnalysisCard.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      placement_test: {
        response_performance: 'Analysis Of Response Performance',
        excellent: 'Excellent',
        good: 'Good',
        result: 'Result',
        result_percentage: 'Result: {percentage}%',
        correct: 'Correct',
        wrong: 'Wrong',
        skipped: 'Skipped',
        question_short: 'Q',
      },
    },
  },
});

describe('PlacementResultAnalysisCard', () => {
  it('renders the result analysis values and calculated total', () => {
    const placementTest = new ShowPlcaementTestModel({
      resultAnalysis: new ResultAnalysisModel({
        correct: 85,
        wrong: 10,
        Skipped: 5,
        totalRate: PlacementTotalRateEnum.excellent,
        precentage: 85,
      }),
    });

    const wrapper = mount(PlacementResultAnalysisCard, {
      props: { placementTest },
      global: {
        plugins: [i18n],
        stubs: { AnalysisIcon: true },
      },
    });

    expect(wrapper.text()).toContain('Analysis Of Response Performance');
    expect(wrapper.text()).toContain('Excellent');
    expect(wrapper.text()).toContain('85%');
    expect(wrapper.text()).toContain('85 / 100');
    expect(wrapper.text()).toContain('85 Q');
    expect(wrapper.text()).toContain('10 Q');
    expect(wrapper.text()).toContain('5 Q');
  });
});
