import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import StageTreeNode from '../StageTreeNode.vue';
import EducationStageModel from '@/modules/EducationClassification/core/models/EducationStage/education.stages.model';
import { computed } from 'vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock components used in StageTreeNode
vi.mock('@/shared/HelpersComponents/DropList.vue', () => ({
  default: {
    name: 'DropList',
    template: '<div class="drop-list-stub"></div>',
    props: ['actionList', 'deleteDialogTitle', 'deleteDialogMessage'],
  },
}));

vi.mock('@/modules/EducationClassification/subComponent/RenameClassificationDialog.vue', () => ({
  default: {
    name: 'RenameClassificationDialog',
    template: '<div class="rename-dialog-stub"></div>',
    props: ['visable'],
  },
}));

const mockNode = {
  stage: EducationStageModel.example,
  children: [],
  isLoaded: false,
  isLoading: false,
  depth: 0,
};

describe('StageTreeNode', () => {
  const onExpand = vi.fn();
  const onSelect = vi.fn();
  const onAddChild = vi.fn();
  const maxDepth = computed(() => 3);

  const mountComponent = (props = {}) =>
    mount(StageTreeNode, {
      props: {
        node: mockNode,
        selectedStageId: null,
        MaxDepth: 3,
        parentId: null,
        ...props,
      },
      global: {
        provide: {
          stageOnExpand: onExpand,
          stageOnSelect: onSelect,
          stageOnAddChild: onAddChild,
          maxDepth: maxDepth,
        },
        stubs: {
          DropList: true,
          RenameClassificationDialog: true,
          StageTreeNode: true, // Stub recursive call to avoid deep rendering in simple tests
        },
        config: {
          globalProperties: {
            $t: (key: string) => key,
          },
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
    onExpand.mockResolvedValue(undefined);
    onSelect.mockResolvedValue(undefined);
  });

  it('renders the stage title', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.node-name').text()).toBe(mockNode.stage.stage_title);
  });

  it('renders the configured singular title for the root stage', () => {
    const wrapper = mountComponent({ levelLabels: { 1: 'New' } });

    expect(wrapper.get('.level-label').text()).toBe('New');
  });

  it('calls onSelect and handleToggle when row is clicked', async () => {
    const wrapper = mountComponent();
    await wrapper.find('.node-row').trigger('click');
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0]).toEqual([mockNode]);
    expect(wrapper.emitted('fetch-children')).toBeTruthy();
  });

  it('toggles expansion state when toggle button is clicked', async () => {
    const wrapper = mountComponent();
    const toggleBtn = wrapper.find('.toggle-btn');

    // Trigger click
    await toggleBtn.trigger('click');

    // Get the callback from the emitted event and call it
    const fetchEvent = wrapper.emitted('fetch-children')![0];
    const callback = fetchEvent[1] as (children: any[]) => void;
    callback([{ ...mockNode, stage: { ...mockNode.stage, stage_id: 999 } }]);

    // Wait for the async handleToggle to continue
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.children-wrapper').exists()).toBe(true);
  });

  it('calls onAddChild with correct arguments when add button is clicked', async () => {
    const wrapper = mountComponent();
    const addBtn = wrapper.find('button.icon-btn[title="Add child"]');
    await addBtn.trigger('click');
    expect(wrapper.emitted('add-child')).toBeTruthy();
    expect(wrapper.emitted('add-child')![0]).toEqual([mockNode.stage.stage_id, mockNode.depth + 2]);
  });

  it('hides add child button when max depth is reached', () => {
    const deepNode = {
      ...mockNode,
      depth: 2, // node.depth + 1 = 3, which is maxDepth
    };
    const wrapper = mountComponent({ node: deepNode });
    expect(wrapper.find('button[title="Add child"]').exists()).toBe(false);
  });

  it('highlights the node when it is selected', () => {
    const wrapper = mountComponent({ selectedStageId: mockNode.stage.stage_id });
    expect(wrapper.find('.node-row').classes()).toContain('is-selected');
  });

  it('identifies Arabic text for RTL styling', () => {
    const arabicNode = {
      ...mockNode,
      stage: new EducationStageModel({
        stage_id: 2,
        stage_title: 'مرحلة اختبار',
        has_children: false,
      }),
    };
    const wrapper = mountComponent({ node: arabicNode });
    expect(wrapper.find('.node-name').classes()).toContain('rtl-text');
  });

  it('renders a different icon for leaf nodes at max depth', () => {
    const leafNodeAtMax = {
      ...mockNode,
      depth: 2,
    };
    const wrapper = mountComponent({ node: leafNodeAtMax });
    expect(wrapper.find('.leaf-folder-icon').exists()).toBe(true);
  });

  it('renders the configured singular title for the node level', () => {
    const wrapper = mountComponent({
      node: { ...mockNode, depth: 1 },
      MaxDepth: 3,
      levelLabels: { 2: 'Newest' },
      parentId: null,
    });

    expect(wrapper.get('.level-label').text()).toBe('Newest');
  });

  it('marks nested rows for curved tree connectors', () => {
    const wrapper = mountComponent({
      node: { ...mockNode, depth: 2 },
      isLast: true,
    });

    expect(wrapper.classes()).toContain('has-parent');
    expect(wrapper.classes()).toContain('is-last');
    expect(wrapper.attributes('style')).toContain('--tree-depth: 2');
    expect(wrapper.get('.node-row').attributes('style')).toContain('padding-inline-start: 46px');
  });
});
