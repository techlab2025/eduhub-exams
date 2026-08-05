import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import StudentPerformanceSnapshotModel from '../../../../../core/models/subModels/studentProfile/student.performance.snapshot.model';
import PlacementStudentSnapshot from '../PlacementStudentSnapshot.vue';

describe('PlacementStudentSnapshot', () => {
  it('renders snapshot data', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentSnapshot, {
      props: { snapshot: StudentPerformanceSnapshotModel.example },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain(StudentPerformanceSnapshotModel.example.currentPlan);
  });
});
