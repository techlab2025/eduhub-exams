<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import EducationTypeItem from './EducationTypeItem.vue';
  import AddEducationTypeDialog from '@/modules/EducationCalssification/subComponent/EducationTree/AddEducationTypeDialog.vue';
  import AddBranchDialog from '@/modules/EducationCalssification/subComponent/EducationTree/AddBranchDialog.vue';
  import EducationTreeController from '../../controllers/EducationTree/education.configuration.tree.controller';
  import { useRoute } from 'vue-router';
  import FetchTreeConfigurationTreeParams from '@/modules/EducationCalssification/core/params/EducationTree/fetch.tree.configuration.params';

  interface TreeNode {
    id: string;
    name: string;
    level: number;
    children: TreeNode[];
  }

  const educationTypes = ref<TreeNode[]>([]);
  const searchQuery = ref('');
  const showAddTypeDialog = ref(false);
  const showAddBranchDialog = ref(false);
  const selectedType = ref<TreeNode | null>(null);
  const branchDialogLevel = ref(1);
  const branchDialogParent = ref<TreeNode | null>(null);

  let idCounter = 1;
  const genId = () => `node-${idCounter++}`;

  const filteredTypes = computed(() => {
    if (!searchQuery.value.trim()) return educationTypes.value;
    const q = searchQuery.value.toLowerCase();
    const filterNode = (node: TreeNode): TreeNode | null => {
      if (node.name.toLowerCase().includes(q)) return node;
      const filteredChildren = node.children.map(filterNode).filter(Boolean) as TreeNode[];
      if (filteredChildren.length > 0) return { ...node, children: filteredChildren };
      return null;
    };
    return educationTypes.value.map(filterNode).filter(Boolean) as TreeNode[];
  });

  function openAddTypeDialog() {
    showAddTypeDialog.value = true;
  }

  function openAddBranchDialog({ node, level }: { node: TreeNode; level: number }) {
    branchDialogParent.value = node;
    branchDialogLevel.value = level;
    showAddBranchDialog.value = true;
  }

  function handleAddType(name: string) {
    const newNode: TreeNode = { id: genId(), name, level: 0, children: [] };
    educationTypes.value.push(newNode);
    selectedType.value = newNode;
    showAddTypeDialog.value = false;
  }

  function handleAddBranch(name: string) {
    if (!branchDialogParent.value) return;
    const newNode: TreeNode = {
      id: genId(),
      name,
      level: branchDialogLevel.value,
      children: [],
    };
    branchDialogParent.value.children.push(newNode);
    showAddBranchDialog.value = false;
  }

  function selectNode(node: TreeNode) {
    if (node.level === 0) selectedType.value = node;
  }

  const route = useRoute();
  const controller = EducationTreeController.getInstance();
  const FetchEducationTreeParams = new FetchTreeConfigurationTreeParams({
    education_classification_id: Number(route.params.id),
  });
  const state = computed(() => controller.listState);
  onMounted(async () => {
    await controller.fetchList(FetchEducationTreeParams);
    educationTypes.value = state.value.value.data.map((item) => {
      return {
        id: item.id,
        name: item.branches[0]?.branch_title,
        level: item.branches[0],
        children: item.branches.map((branch) => {
          return {
            id: branch.branch_id,
            name: branch.branch_title,
            level: 1,
            children: branch.branches.map((subBranch) => {
              return {
                id: subBranch.branch_id,
                name: subBranch.branch_title,
                level: 2,
                children: [],
              };
            }),
          };
        }),
      };
    });
  });
</script>
<template>
  <div class="education-tree">
    <!-- Left Panel -->
    <div class="left-panel">
      <!-- Search & Filter Bar -->
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
            v-model="searchQuery"
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
      <div v-if="filteredTypes.length === 0 && !searchQuery" class="empty-state">
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
        <button class="btn-primary" @click="openAddTypeDialog">Add Education Type</button>
      </div>

      <!-- Tree List -->
      <div v-else class="tree-list">
        <EducationTypeItem
          v-for="type in filteredTypes"
          :key="type.id"
          :node="type"
          @add-branch="openAddBranchDialog($event)"
          @add-sub="openAddBranchDialog($event)"
          @select="selectNode($event)"
        />
      </div>

      <!-- Bottom Add Button -->
      <div v-if="educationTypes.length > 0" class="bottom-bar">
        <button class="btn-primary btn-full" @click="openAddTypeDialog">
          Add New Education Type
        </button>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="right-panel">
      <template v-if="selectedType">
        <div class="right-header">
          <div class="right-title">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="#4caf50" stroke-width="1.5" />
              <path
                d="M7 7h6M7 10h6M7 13h4"
                stroke="#4caf50"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ selectedType.name }}</span>
          </div>
          <button
            class="btn-outlined"
            @click="openAddBranchDialog({ node: selectedType, level: 1 })"
          >
            <span>+</span> Add Branch
          </button>
        </div>
        <div v-if="selectedType.children.length === 0" class="right-empty">
          <p class="hint-text">No branches yet. Click "+ Add Branch" to get started.</p>
        </div>
      </template>
      <div v-else class="right-placeholder">
        <p>Select an education type to view details</p>
      </div>
    </div>

    <!-- Add Education Type Dialog -->
    <AddEducationTypeDialog v-model:visible="showAddTypeDialog" @confirm="handleAddType" />

    <!-- Add Branch Dialog -->
    <AddBranchDialog
      v-model:visible="showAddBranchDialog"
      :level="branchDialogLevel"
      @confirm="handleAddBranch"
    />
  </div>
</template>
