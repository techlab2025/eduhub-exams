import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import PlacementStudentProfileModel from '../../../../../core/models/placement.student.profile.model';
import PlacementStudentHeader from '../PlacementStudentHeader.vue';

describe('PlacementStudentHeader', () => {
  it('renders profile data', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentHeader, {
      props: { profile: PlacementStudentProfileModel.example },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain(PlacementStudentProfileModel.example.studentCode);
  });
});
