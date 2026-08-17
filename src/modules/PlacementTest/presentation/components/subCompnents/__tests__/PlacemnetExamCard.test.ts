import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import EducationClassificationBranchModel from '@/shared/GeneralModels/education.classification.branch.model';
import EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
import PlacemnetExamCard from '../PlacemnetExamCard.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      placement_test: {
        id: 'Id',
        exam: 'Placement Exam',
      },
    },
  },
});

describe('PlacemnetExamCard', () => {
  it('renders the exam data from ShowPlcaementTestModel', () => {
    const placementTest = new ShowPlcaementTestModel({
      id: 1,
      createdAt: '09-05-2022',
      EducationClassificationBranch: new EducationClassificationBranchModel({
        id: 2,
        title: 'Arabic',
      }),
      EducationClassificationSubject: new EducationClassificationSubjectModel({
        id: 3,
        title: 'Part Of Subject',
      }),
    });

    const wrapper = mount(PlacemnetExamCard, {
      props: { placementTest },
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain('Id: 1');
    expect(wrapper.text()).toContain('Placement Exam');
    expect(wrapper.text()).toContain('Arabic');
    expect(wrapper.text()).toContain('Part Of Subject');
    expect(wrapper.text()).toContain('09-05-2022');
  });
});
