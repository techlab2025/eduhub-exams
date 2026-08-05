import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlacementStudentProfile from '../PlacementStudentProfile.vue';

const fetchStudentProfile = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { studentId: '7' } }),
}));

vi.mock('../../controllers/placement.test.controller', () => ({
  default: {
    getInstance: () => ({
      studentProfileState: { value: {} },
      fetchStudentProfile,
    }),
  },
}));

describe('PlacementStudentProfile', () => {
  beforeEach(() => {
    fetchStudentProfile.mockClear();
  });

  it('loads the student profile using the route student id', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });
    const wrapper = shallowMount(PlacementStudentProfile, { global: { plugins: [i18n] } });

    expect(wrapper.exists()).toBe(true);
    expect(fetchStudentProfile).toHaveBeenCalledOnce();
    expect(fetchStudentProfile.mock.calls[0][0].toMap()).toEqual({ student_id: 7 });
  });
});
