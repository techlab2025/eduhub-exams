import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import StudentPlanMarkerModel from '../../../../../core/models/subModels/studentProfile/student.plan.marker.model';
import StudentSkillProgressModel from '../../../../../core/models/subModels/studentProfile/student.skill.progress.model';
import PlacementStudentSkillProgress from '../PlacementStudentSkillProgress.vue';

describe('PlacementStudentSkillProgress', () => {
  it('renders the supplied skill progress points', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentSkillProgress, {
      props: {
        selectedSkill: 'Reading Skill',
        progress: StudentSkillProgressModel.examples,
        markers: StudentPlanMarkerModel.examples,
      },
      global: { plugins: [i18n] },
    });

    expect(wrapper.findAll('.line-chart__points circle')).toHaveLength(
      StudentSkillProgressModel.examples.length,
    );
  });
});
