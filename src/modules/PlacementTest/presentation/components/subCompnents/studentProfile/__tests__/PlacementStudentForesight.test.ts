import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import PlacementStudentProfileModel from '../../../../../core/models/placement.student.profile.model';
import PlacementStudentForesight from '../PlacementStudentForesight.vue';

describe('PlacementStudentForesight', () => {
  it('renders the backend foresight message', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentForesight, {
      props: { profile: PlacementStudentProfileModel.example },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain(PlacementStudentProfileModel.example.foresightMessage);
  });
});
