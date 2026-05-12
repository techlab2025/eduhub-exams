import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SkillsDialog from '../SkillsDialog.vue';

// Mock PrimeVue Dialog
vi.mock('primevue/dialog', () => ({
  default: {
    template: '<div v-if="visible"><slot name="header" /><slot /></div>',
    props: ['visible'],
  },
}));

// Mock controllers
vi.mock('../../presentation/controllers/EducationSkills/education.skills.controller', () => ({
  default: {
    getInstance: () => ({
      create: vi.fn(),
    }),
  },
}));

vi.mock('@/modules/Skills/presentation/controllers/skills.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: [] },
      fetchList: vi.fn(),
    }),
  },
}));

describe('SkillsDialog.vue', () => {
  const defaultProps = {
    visible: true,
    level: 1,
    branchName: 'Test Branch',
    branchId: 123,
  };

  it('renders correctly', () => {
    const wrapper = mount(SkillsDialog, {
      props: defaultProps,
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
        stubs: {
          SubjectSkllsIcon: true,
          UpdatedCustomInputSelect: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
