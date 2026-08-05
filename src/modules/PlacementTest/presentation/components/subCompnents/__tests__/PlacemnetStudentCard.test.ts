import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StudentModel from '@/shared/GeneralModels/student.model';
import EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
import PlacemnetStudentCard from '../PlacemnetStudentCard.vue';

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a><slot /></a>',
};

describe('PlacemnetStudentCard', () => {
  it('links the profile icon using the student id', () => {
    const wrapper = shallowMount(PlacemnetStudentCard, {
      props: {
        student: new StudentModel({ id: 7, name: 'Ahmed', image: '' }),
        subjects: new EducationClassificationSubjectModel({
          id: 1,
          title: 'Math',
          fullTitle: 'Primary -> Math',
        }),
      },
      global: {
        stubs: { RouterLink: RouterLinkStub },
        mocks: { $t: (key: string) => key },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
      name: 'Placement Test Student Profile',
      params: { studentId: 7 },
    });
  });
});
