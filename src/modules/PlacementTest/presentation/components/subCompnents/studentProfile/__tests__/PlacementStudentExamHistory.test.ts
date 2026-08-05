import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import StudentExamHistoryModel from '../../../../../core/models/subModels/studentProfile/student.exam.history.model';
import PlacementStudentExamHistory from '../PlacementStudentExamHistory.vue';

describe('PlacementStudentExamHistory', () => {
  it('renders every history item returned by the backend', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentExamHistory, {
      props: { history: StudentExamHistoryModel.examples },
      global: { plugins: [i18n] },
    });

    expect(wrapper.findAll('.student-profile__history-list article')).toHaveLength(
      StudentExamHistoryModel.examples.length,
    );
  });
});
