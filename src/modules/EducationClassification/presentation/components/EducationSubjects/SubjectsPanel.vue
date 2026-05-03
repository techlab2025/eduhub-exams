<script setup lang="ts">
  import { ref, provide, onMounted, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import SubjectTreeNode from './SubjectTreeNode.vue';
  import type { SubjectNode } from './SubjectTreeNode.vue';
  import AddBranchDialog from '@/modules/EducationClassification/subComponent/EducationTree/AddBranchDialog.vue';
  import EducationSubjectController from '../../controllers/educationSubject/education.subject.controller';
  import EducationSubjectItemController from '../../controllers/educationSubject/education.subject.item.controller';
  import FetchSubjectParams from '@/modules/EducationClassification/core/params/EducationSubjects/fetch.subject.params';
  import AddSubjectItemParams from '@/modules/EducationClassification/core/params/EducationSubjects/add.subject.item.params';
  import type EducationSubjectModel from '@/modules/EducationClassification/core/models/EducationSubject/education.subject.model';
  import type EducationSubjectConfigurationModel from '@/modules/EducationClassification/core/models/EducationConfiguration/education.subject.configuration.model';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import AddEducationSubjectDialog from '@/modules/EducationClassification/subComponent/EducationTree/AddEducationSubjectDialog.vue';

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
        <div class="w-full flex stage-container">
          <span>{{ stageName }} </span>
          <span @click="showAddTypeDialog = true">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <circle cx="10" cy="10" r="8" stroke="#4caf50" stroke-width="1.4" />
              <path d="M10 7v6M7 10h6" stroke="#4caf50" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Subject Tree Left + Right split -->
    <div class="subjects-body">
      <!-- Left: subject tree list -->
      <div class="subjects-left">
        <div class="subject-tree-list">
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

  <AddEducationSubjectDialog
    v-if="showAddTypeDialog"
    v-model:visible="showAddTypeDialog"
    :header="`Add New ${getSubjectRootName()}`"
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
