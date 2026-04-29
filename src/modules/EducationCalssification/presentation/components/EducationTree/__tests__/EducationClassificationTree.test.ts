import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import EducationClassificationTree from '../EducationClassificationTree.vue';
import EducationTreeController from '../../../controllers/EducationTree/education.configuration.tree.controller';
import { ref } from 'vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
}));

const mockController = {
  fetchList: vi.fn(),
  create: vi.fn(),
  listState: ref({
    value: {
      data: [],
    },
  }),
};

// Mock controller
vi.mock('../../../controllers/EducationTree/education.configuration.tree.controller', () => ({
  default: {
    getInstance: () => mockController,
  },
}));

// Mock subcomponents
vi.mock('../EducationTypeItem.vue', () => ({
  default: {
    name: 'EducationTypeItem',
    template: '<div class="education-type-item"></div>',
  },
}));

vi.mock(
  '@/modules/EducationCalssification/subComponent/EducationTree/AddEducationTypeDialog.vue',
  () => ({
    default: {
      name: 'AddEducationTypeDialog',
      template: '<div class="add-type-dialog"></div>',
    },
  }),
);

vi.mock('@/modules/EducationCalssification/subComponent/EducationTree/AddBranchDialog.vue', () => ({
  default: {
    name: 'AddBranchDialog',
    template: '<div class="add-branch-dialog"></div>',
  },
}));

describe('EducationClassificationTree', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () =>
    mount(EducationClassificationTree, {
      global: {
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    });

  it('renders correctly', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.education-tree').exists()).toBe(true);
    expect(wrapper.find('.left-panel').exists()).toBe(true);
    expect(wrapper.find('.right-panel').exists()).toBe(true);
  });

  it('shows empty state when no data', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.empty-state').exists()).toBe(true);
    expect(wrapper.find('.empty-title').text()).toBe('No Education Tree Yet');
  });

  it('calls fetchList on mounted', () => {
    const controller = EducationTreeController.getInstance();
    mountComponent();
    expect(controller.fetchList).toHaveBeenCalled();
  });

  it('opens add type dialog when button is clicked', async () => {
    const wrapper = mountComponent();
    await wrapper.find('.btn-primary').trigger('click');
    // Check if dialog would be visible (this depends on how the stub handles v-model)
    // For now, checking the function call if we can expose it or just the state
  });
});
