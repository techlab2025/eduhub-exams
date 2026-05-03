<script setup lang="ts">
  import { ref, provide, onMounted, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import SubjectTreeNode from './SubjectTreeNode.vue';
  import type { SubjectNode } from './SubjectTreeNode.vue';
  import AddEducationTypeDialog from '@/modules/EducationClassification/subComponent/EducationTree/AddEducationTypeDialog.vue';
  import AddBranchDialog from '@/modules/EducationClassification/subComponent/EducationTree/AddBranchDialog.vue';
  import EducationSubjectController from '../../controllers/educationSubject/education.subject.controller';
  import EducationSubjectItemController from '../../controllers/educationSubject/education.subject.item.controller';
  import FetchSubjectParams from '@/modules/EducationClassification/core/params/EducationSubjects/fetch.subject.params';
  import AddSubjectItemParams from '@/modules/EducationClassification/core/params/EducationSubjects/add.subject.item.params';
  import type EducationSubjectModel from '@/modules/EducationClassification/core/models/EducationSubject/education.subject.model';
  import type EducationSubjectConfigurationModel from '@/modules/EducationClassification/core/models/EducationConfiguration/education.subject.configuration.model';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

  const props = defineProps<{
    stageId: number;
    stageName: string;
  }>();

  const { locale } = useI18n();
  const configController = EducationSubjectController.getInstance();
  const itemController = EducationSubjectItemController.getInstance();

  const subjectConfig = ref<EducationSubjectConfigurationModel | null>(null);
  const rootNodes = ref<SubjectNode[]>([]);
  const selectedNode = ref<SubjectNode | null>(null);
  const showAddTypeDialog = ref(false);
  const showAddBranchDialog = ref(false);
  const branchDialogLevel = ref(1);
  const branchDialogParentId = ref<number | undefined>(undefined);
  const branchDialogName = ref('');

  const subjectMaxDepth = computed(() => subjectConfig.value?.numberOfBranches ?? Infinity);

  function getSubjectBranchName(depth: number): string {
    const branches = subjectConfig.value?.branches ?? [];
    const branch = branches.find((b) => b.levelNumber === depth + 1);
    if (!branch) return `Level ${depth + 1}`;
    const lang = locale.value === 'ar' ? 'ar' : 'en';
    return (
      branch.translation.SingularTitle[lang] ??
      branch.translation.SingularTitle['en'] ??
      `Level ${depth + 1}`
    );
  }

  function getSubjectRootName(): string {
    const lang = locale.value === 'ar' ? 'ar' : 'en';
    const config = subjectConfig.value;
    if (!config) return 'Subject';
    return (
      config.translation.SingularTitle[lang] ?? config.translation.SingularTitle['en'] ?? 'Subject'
    );
  }

  function makeNode(subject: EducationSubjectModel, depth: number): SubjectNode {
    return { subject, children: [], isLoaded: false, isLoading: false, depth };
  }

  function findNode(nodes: SubjectNode[], id: number): SubjectNode | null {
    for (const n of nodes) {
      if (n.subject.subject_id === id) return n;
      const found = findNode(n.children, id);
      if (found) return found;
    }
    return null;
  }

  async function fetchRoot() {
    rootNodes.value = [];
    selectedNode.value = null;
    const params = new FetchSubjectParams({ stage_id: props.stageId });
    const result = await itemController.fetchList(params);
    if (result instanceof DataSuccess) {
      rootNodes.value = (result.data ?? []).map((s: EducationSubjectModel) => makeNode(s, 0));
    }
  }

  async function expandNode(node: SubjectNode) {
    if (node.isLoading) return;
    node.isLoading = true;
    const params = new FetchSubjectParams({
      stage_id: props.stageId,
      parent_id: node.subject.subject_id,
    });
    const result = await itemController.fetchList(params);
    if (result instanceof DataSuccess) {
      node.children = (result.data ?? []).map((s: EducationSubjectModel) =>
        makeNode(s, node.depth + 1),
      );
      node.isLoaded = true;
    }
    node.isLoading = false;
  }

  function selectNode(node: SubjectNode) {
    selectedNode.value = node;
  }

  function openAddChildDialog(subjectId: number, level: number) {
    branchDialogParentId.value = subjectId;
    branchDialogLevel.value = level;
    branchDialogName.value = getSubjectBranchName(level - 1);
    showAddBranchDialog.value = true;
  }

  async function handleAddRoot(name: string) {
    const params = new AddSubjectItemParams({ title: name, stage_id: props.stageId });
    await itemController.create(params);
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
    const params = new AddSubjectItemParams({
      title: name,
      stage_id: props.stageId,
      parent_id: branchId,
    });
    await itemController.create(params);
    showAddBranchDialog.value = false;
    const parentNode = findNode(rootNodes.value, branchId);
    if (parentNode) {
      parentNode.isLoaded = false;
      await expandNode(parentNode);
    }
  }

  provide('subjectOnExpand', expandNode);
  provide('subjectOnSelect', selectNode);
  provide('subjectOnAddChild', openAddChildDialog);
  provide('subjectMaxDepth', subjectMaxDepth);

  watch(
    () => props.stageId,
    async () => {
      await fetchRoot();
    },
  );

  onMounted(async () => {
    const configResult = await configController.fetchList();
    if (configResult instanceof DataSuccess && configResult.data) {
      subjectConfig.value = configResult.data;
    }
    await fetchRoot();
  });
</script>

<template>
  <div class="subjects-panel">
    <div class="subjects-panel-header">
      <div class="subjects-panel-title">
        <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="#4caf50" stroke-width="1.5" />
          <path
            d="M7 7h6M7 10h6M7 13h4"
            stroke="#4caf50"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
        <span>{{ stageName }} </span>
      </div>
    </div>

    <!-- Subject Tree Left + Right split -->
    <div class="subjects-body">
      <!-- Left: subject tree list -->
      <div class="subjects-left">
        <div v-if="rootNodes.length === 0" class="empty-state">
          <div class="empty-illustration">
            <svg viewBox="0 0 80 80" fill="none" width="64" height="64">
              <rect x="10" y="30" width="60" height="40" rx="4" fill="#4caf50" />
              <rect x="20" y="20" width="40" height="10" rx="2" fill="#4caf50" />
              <circle cx="40" cy="15" r="8" fill="#4caf50" />
              <path
                d="M30 50h20M30 58h14"
                stroke="#4caf50"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <p class="empty-title">No {{ getSubjectRootName() }}s Yet</p>
          <p class="empty-desc">
            Start adding {{ getSubjectRootName().toLowerCase() }}s for this stage.
          </p>
          <button class="btn btn-primary" @click="showAddTypeDialog = true">
            Add {{ getSubjectRootName() }}
          </button>
        </div>

        <div v-else class="subject-tree-list">
          <SubjectTreeNode
            v-for="node in rootNodes"
            :key="node.subject.subject_id"
            :node="node"
            :selected-subject-id="selectedNode?.subject.subject_id ?? null"
          />
        </div>

        <div v-if="rootNodes.length > 0" class="subjects-bottom-bar">
          <button class="btn btn-primary btn-full" @click="showAddTypeDialog = true">
            Add New {{ getSubjectRootName() }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <AddEducationTypeDialog
    :header="`Add New ${getSubjectRootName()}`"
    v-if="showAddTypeDialog"
    v-model:visible="showAddTypeDialog"
    @confirm="handleAddRoot"
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
  .subjects-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0;
  }

  .subjects-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px 10px;
    border-bottom: 1px solid #e5e7eb;
    background: #f8faff;
    border-radius: 8px 8px 0 0;
  }

  .subjects-panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: black;
  }

  .subjects-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .subjects-left {
    width: 100%;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 12px 0 0;
  }

  .subject-tree-list {
    flex: 1;
    overflow-y: auto;
  }

  .subjects-bottom-bar {
    padding: 10px 12px;
    border-top: 1px solid #e5e7eb;
    margin-top: auto;
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

  .hint-text {
    color: #9ca3af;
    font-size: 13px;
    text-align: center;
    padding: 24px 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    gap: 8px;
    text-align: center;
  }

  .empty-illustration {
    margin-bottom: 4px;
  }

  .empty-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  .empty-desc {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }
</style>
