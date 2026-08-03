import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import TimeAnalysisModel from '@/modules/PlacementTest/core/models/subModels/time.analysis.model';
import PlacementTimeAnalysisCard from '../PlacementTimeAnalysisCard.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      placement_test: {
        real_time_analysis: 'Real-Time Analysis',
        start_time: 'Start Time',
        end_time: 'End Time',
        exam_time: 'Exam Time',
        actual_duration: 'Actual Duration',
        time_passed: 'Time Passed',
        minutes_value: '{value} Min',
        am: 'AM',
        pm: 'PM',
      },
    },
  },
});

describe('PlacementTimeAnalysisCard', () => {
  it('renders time values and derives the planned exam duration', () => {
    const placementTest = new ShowPlcaementTestModel({
      timeAnalysis: new TimeAnalysisModel({
        startTime: '2026-08-03T09:00:00',
        endTime: '2026-08-03T10:32:00',
        actualDuration: '92',
        timePassed: '2',
      }),
    });

    const wrapper = mount(PlacementTimeAnalysisCard, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Real-Time Analysis');
    expect(wrapper.text()).toContain('09:00 AM');
    expect(wrapper.text()).toContain('10:32 AM');
    expect(wrapper.text()).toContain('90 Min');
    expect(wrapper.text()).toContain('92 Min');
    expect(wrapper.text()).toContain('2 Min');
  });
});
