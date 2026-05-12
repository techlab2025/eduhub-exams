import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SubjectsPanel from '../SubjectsPanel.vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type EducationSubjectModel from '@/modules/EducationClassification/core/models/EducationSubject/education.subject.model';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ locale: { value: 'en' } }),
}));

const mockConfigController = {
  fetchList: vi.fn(),
};

const mockItemController = {
  fetchList: vi.fn(),
  create: vi.fn(),
};

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationSubject/education.subject.controller',
  () => ({ default: { getInstance: () => mockConfigController } }),
);

vi.mock(
  '@/modules/EducationClassification/presentation/controllers/educationSubject/education.subject.item.controller',
  () => ({ default: { getInstance: () => mockItemController } }),
);

vi.mock('../SubjectTreeNode.vue', () => ({
  default: {
    name: 'SubjectTreeNode',
    template: '<div class="subject-tree-node"></div>',
    props: ['node', 'selectedSubjectId', 'maxDepth', 'parentId'],
  },
}));

vi.mock('@/modules/EducationClassification/subComponent/EducationTree/AddBranchDialog.vue', () => ({
  default: {
    name: 'AddBranchDialog',
    template: '<div class="add-branch-dialog"></div>',
  },
}));

vi.mock(
  '@/modules/EducationClassification/subComponent/EducationTree/AddEducationSubjectDialog.vue',
  () => ({
    default: {
      name: 'AddEducationSubjectDialog',
      template: '<div class="add-subject-dialog"></div>',
      props: ['visible'],
    },
  }),
);

describe('SubjectsPanel', () => {
  const defaultProps = { stageId: 5, stageName: 'Grade 5' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfigController.fetchList.mockResolvedValue(
      new DataSuccess({
        data: [{ numberOfBranches: 2, branches: [] }],
      }),
    );
    mockItemController.fetchList.mockResolvedValue(
      new DataSuccess<EducationSubjectModel[]>({ data: [] }),
    );
    mockItemController.create.mockResolvedValue(new DataSuccess({ data: null }));
  });

  const mountComponent = (props = defaultProps) =>
    mount(SubjectsPanel, {
      props,
      global: {
        stubs: { 'router-link': true },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

  it('renders the subjects panel', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    expect(wrapper.find('.subjects-panel').exists()).toBe(true);
  });

  it('displays the stage name in the panel header', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    expect(wrapper.text()).toContain('Grade 5');
  });

  it('calls itemController.fetchList on mounted', async () => {
    mountComponent();
    await flushPromises();
    expect(mockItemController.fetchList).toHaveBeenCalled();
  });

  it('calls configController.fetchList on mounted', async () => {
    mountComponent();
    await flushPromises();
    expect(mockConfigController.fetchList).toHaveBeenCalled();
  });

  it('opens AddEducationSubjectDialog when the add icon in header is clicked', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const addBtn = wrapper.find('button[title="Add Subject"]');
    expect(addBtn.exists()).toBe(true);
    await addBtn.trigger('click');
    expect(wrapper.find('.add-subject-dialog').exists()).toBe(true);
  });

  it('closes AddEducationSubjectDialog on update:visible false emit', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    await wrapper.find('button[title="Add Subject"]').trigger('click');
    expect(wrapper.find('.add-subject-dialog').exists()).toBe(true);

    const dialog = wrapper.getComponent({ name: 'AddEducationSubjectDialog' });
    await dialog.vm.$emit('update:visible', false);
    expect(wrapper.find('.add-subject-dialog').exists()).toBe(false);
  });

  it('re-fetches subjects when stageId prop changes', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const callsBefore = mockItemController.fetchList.mock.calls.length;

    await wrapper.setProps({ stageId: 10, stageName: 'Grade 10' });
    await flushPromises();

    expect(mockItemController.fetchList.mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it('shows Add New button in bottom bar when subjects exist', async () => {
    const mockSubject = {
      subject_id: 1,
      subject_title: 'Math',
      has_children: false,
    } as unknown as EducationSubjectModel;

    mockItemController.fetchList.mockResolvedValue(
      new DataSuccess<EducationSubjectModel[]>({ data: [mockSubject] }),
    );

    const wrapper = mountComponent();
    await flushPromises();
    expect(wrapper.find('.subjects-bottom-bar').exists()).toBe(true);
    expect(wrapper.find('.btn-full').exists()).toBe(true);
  });
});
