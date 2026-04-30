<script setup lang="ts">
  import { ref, provide, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import StageTreeNode from './StageTreeNode.vue';
  import type { StageNode } from './StageTreeNode.vue';
  import AddEducationTypeDialog from '@/modules/EducationClassification/subComponent/EducationTree/AddEducationTypeDialog.vue';
  import AddBranchDialog from '@/modules/EducationClassification/subComponent/EducationTree/AddBranchDialog.vue';
  import SubjectsPanel from '../EducationSubjects/SubjectsPanel.vue';
  import EducationStageController from '../../controllers/EducationStages/education.stages.controller';
  import EducationConfigurationController from '../../controllers/educationConfiguration/education.configuration.controller';
  import AddEducationStageParams from '@/modules/EducationClassification/core/params/EducationStages/add.education.stage.params';
  import FetchEducationStageParams from '@/modules/EducationClassification/core/params/EducationStages/fetch.education.stage.params';
  import type EducationStageModel from '@/modules/EducationClassification/core/models/EducationStage/education.stages.model';
  import type EducationConfigurationModel from '@/modules/EducationClassification/core/models/EducationConfiguration/education.configuration.model';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

  const route = useRoute();
  const { locale } = useI18n();
  const classificationId = Number(route.params.id);
  const controller = EducationStageController.getInstance();
  const configController = EducationConfigurationController.getInstance();
  const MaxNumberOfBranches = ref();
  const rootNodes = ref<StageNode[]>([]);
  const selectedNode = ref<StageNode | null>(null);
  const showAddTypeDialog = ref(false);
  const showAddBranchDialog = ref(false);
  const branchDialogLevel = ref(1);
  const branchDialogParentId = ref<number | undefined>(undefined);
  const branchDialogName = ref('');
  const educationConfig = ref<EducationConfigurationModel | null>(null);

  const maxDepth = computed(() => educationConfig.value?.numberOfBranches ?? Infinity);

  function getBranchName(parentDepth: number): string {
    const branches = educationConfig.value?.branches ?? [];
    const branch = branches.find((b) => b.levelNumber === parentDepth + 1);
    if (!branch) return `Branch ${parentDepth + 1}`;
    const lang = locale.value === 'ar' ? 'ar' : 'en';
    return (
      branch.translation.SingularTitle[lang] ??
      branch.translation.SingularTitle['en'] ??
      `Branch ${parentDepth + 1}`
    );
  }

  function makeNode(stage: EducationStageModel, depth: number): StageNode {
    return { stage, children: [], isLoaded: false, isLoading: false, depth };
  }

  function findNode(nodes: StageNode[], id: number): StageNode | null {
    for (const n of nodes) {
      if (n.stage.stage_id === id) return n;
      const found = findNode(n.children, id);
      if (found) return found;
    }
    return null;
  }

  async function fetchRoot() {
    const params = new FetchEducationStageParams({ classification_id: classificationId });
    const result = await controller.fetchList(params);
    if (result instanceof DataSuccess) {
      rootNodes.value = (result.data ?? []).map((s: EducationStageModel) => makeNode(s, 0));
    }
  }

  async function expandNode(node: StageNode) {
    if (node.isLoading) return;
    node.isLoading = true;
    const params = new FetchEducationStageParams({
      classification_id: classificationId,
      parent_id: node.stage.stage_id,
    });
    const result = await controller.fetchList(params);
    if (result instanceof DataSuccess) {
      node.children = (result.data ?? []).map((s: EducationStageModel) =>
        makeNode(s, node.depth + 1),
      );
      node.isLoaded = true;
    }
    node.isLoading = false;
  }

  function selectNode(node: StageNode) {
    selectedNode.value = node;
  }

  function openAddChildDialog(stageId: number, level: number) {
    branchDialogParentId.value = stageId;
    branchDialogLevel.value = level;
    branchDialogName.value = getBranchName(level - 1);
    showAddBranchDialog.value = true;
  }

  async function handleAddType(name: string) {
    const params = new AddEducationStageParams({
      title: name,
      classification_id: classificationId,
    });
    await controller.create(params);
    showAddTypeDialog.value = false;
    await fetchRoot();
  }

  async function handleAddBranch({
    name,
    branchId,
  }: {
    name: string;
    level: number;
    branchId?: number;
  }) {
    if (!branchId) return;
    const params = new AddEducationStageParams({
      title: name,
      classification_id: classificationId,
      parent_id: branchId,
    });
    await controller.create(params);
    showAddBranchDialog.value = false;
    const parentNode = findNode(rootNodes.value, branchId);
    if (parentNode) {
      parentNode.isLoaded = false;
      await expandNode(parentNode);
    }
  }

  provide('stageOnExpand', expandNode);
  provide('stageOnSelect', selectNode);
  provide('stageOnAddChild', openAddChildDialog);
  provide('maxDepth', maxDepth);
  onMounted(async () => {
    const configResult = await configController.fetchList();
    MaxNumberOfBranches.value = configResult.data?.numberOfBranches;
    if (configResult instanceof DataSuccess && configResult.data) {
      educationConfig.value = configResult.data;
    }
    if (!selectedNode.value) {
      fetchRoot();
    }
  });
</script>

<template>
  <div class="education-tree">
    <!-- Left Panel -->
    <div class="left-panel">
      <div class="toolbar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5" />
            <path
              d="M13 13l3.5 3.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search About Education Classification,Branch,Sub..."
            class="search-input"
          />
        </div>
        <button class="filter-btn">
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
            <path
              d="M3 5h14M6 10h8M9 15h2"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          Filter
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="rootNodes.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg viewBox="0 0 80 80" fill="none" width="72" height="72">
            <rect x="10" y="30" width="60" height="40" rx="4" fill="#e8f5e9" />
            <rect x="20" y="20" width="40" height="10" rx="2" fill="#c8e6c9" />
            <circle cx="40" cy="15" r="8" fill="#a5d6a7" />
            <path d="M30 50h20M30 58h14" stroke="#4caf50" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <p class="empty-title">No Education Tree Yet</p>
        <p class="empty-desc">
          You Haven't Added Any Education Trees Yet. Start Now To Organize Your Learning Structure
          And Content.
        </p>
        <button class="btn-primary" @click="showAddTypeDialog = true">Add Education Type</button>
      </div>

      <!-- Tree List -->
      <div v-else class="tree-list">
        <StageTreeNode
          v-for="node in rootNodes"
          :key="node.stage.stage_id"
          :node="node"
          :selected-stage-id="selectedNode?.stage.stage_id ?? null"
        />
      </div>

      <div v-if="rootNodes.length > 0" class="bottom-bar">
        <button class="btn btn-primary btn-full" @click="showAddTypeDialog = true">
          <!-- Add New Education Type -->
          Add New {{ getBranchName(0) }}
        </button>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="right-panel">
      <template v-if="selectedNode">
        <!-- Final-depth stage: show subjects panel -->
        <SubjectsPanel
          v-if="selectedNode.depth + 1 === maxDepth"
          :stage-id="selectedNode.stage.stage_id"
          :stage-name="selectedNode.stage.stage_title"
        />

        <!-- Non-final stage: show children list -->
        <template v-else>
          <div class="right-header">
            <div class="right-title">
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                <rect
                  x="3"
                  y="3"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="#4caf50"
                  stroke-width="1.5"
                />
                <path
                  d="M7 7h6M7 10h6M7 13h4"
                  stroke="#4caf50"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
              <span>{{ selectedNode.stage.stage_title }}</span>
            </div>
            <button
              v-if="selectedNode.depth < maxDepth"
              class="btn-add-branch"
              @click="openAddChildDialog(selectedNode.stage.stage_id, selectedNode.depth + 2)"
            >
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                <circle cx="10" cy="10" r="8" stroke="#4caf50" stroke-width="1.4" />
                <path
                  d="M10 7v6M7 10h6"
                  stroke="#4caf50"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <!-- Children list -->
          <div v-if="selectedNode.children.length > 0" class="right-children">
            <div
              v-for="child in selectedNode.children"
              :key="child.stage.stage_id"
              class="right-child-row"
            >
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16" class="child-icon">
                <rect
                  x="4"
                  y="3"
                  width="12"
                  height="14"
                  rx="2"
                  stroke="#4caf50"
                  stroke-width="1.3"
                  fill="none"
                />
                <path
                  d="M7 8h6M7 11h6M7 14h4"
                  stroke="#4caf50"
                  stroke-width="1.1"
                  stroke-linecap="round"
                />
              </svg>
              <span class="child-name">{{ child.stage.stage_title }}</span>
              <span class="level-label">Branch {{ child.depth }}</span>
              <span class="spacer" />
              <button
                v-if="child.depth < maxDepth"
                class="icon-btn"
                @click="openAddChildDialog(child.stage.stage_id, child.depth + 3)"
              >
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                  <circle cx="10" cy="10" r="8" stroke="#4caf50" stroke-width="1.4" />
                  <path
                    d="M10 7v6M7 10h6"
                    stroke="#4caf50"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
              <button class="icon-btn">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <circle cx="10" cy="5" r="1.2" />
                  <circle cx="10" cy="10" r="1.2" />
                  <circle cx="10" cy="15" r="1.2" />
                </svg>
              </button>
            </div>
          </div>

          <div v-else class="right-empty">
            <p class="hint-text">No branches yet. Click "+ Add Branch" to get started.</p>
          </div>
        </template>
      </template>

      <div v-else class="right-placeholder">
        <p>Select a stage from the tree to view details</p>
      </div>
    </div>
  </div>

  <AddEducationTypeDialog
    :header="`Add New ${getBranchName(0)}`"
    v-if="showAddTypeDialog"
    v-model:visible="showAddTypeDialog"
    @confirm="handleAddType"
  />

  <AddBranchDialog
    v-if="showAddBranchDialog"
    v-model:visible="showAddBranchDialog"
    :level="branchDialogLevel"
    :branch-id="branchDialogParentId"
    :branch-name="branchDialogName"
    @confirm="handleAddBranch"
  />
</template>

<style scoped>
  .btn-add-branch {
    display: flex;
    align-items: center;
    gap: 6px;
    background: white;
    color: #4caf50;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-add-branch:hover {
    background: #f1f8f1;
  }

  .right-children {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .right-child-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 14px;
  }

  .child-icon {
    flex-shrink: 0;
  }

  .child-name {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    direction: rtl;
  }

  .level-label {
    font-size: 10px;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
    border-radius: 4px;
    padding: 1px 5px;
    white-space: nowrap;
  }

  .spacer {
    flex: 1;
  }

  .icon-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 3px;
    display: flex;
    align-items: center;
    color: #9ca3af;
    border-radius: 4px;
    transition: background 0.15s;
    flex-shrink: 0;
  }

  .icon-btn:hover {
    background: #e5e7eb;
    color: #374151;
  }
</style>
