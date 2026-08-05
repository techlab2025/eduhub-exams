import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import StudentExamAnalysisModel from '../../../../../core/models/subModels/studentProfile/student.exam.analysis.model';
import StudentExamPerformanceModel from '../../../../../core/models/subModels/studentProfile/student.exam.performance.model';
import PlacementStudentExamPerformance from '../PlacementStudentExamPerformance.vue';

describe('PlacementStudentExamPerformance', () => {
  it('uses the backend tone on exam bars', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentExamPerformance, {
      props: {
        performance: StudentExamPerformanceModel.examples,
        analysis: StudentExamAnalysisModel.example,
      },
      global: { plugins: [i18n] },
    });

    expect(wrapper.find('.bar-chart__bar--success').exists()).toBe(true);
  });
});
