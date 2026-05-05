<script setup lang="ts">
  import { ref, inject, watch, computed } from 'vue';
  import type { Ref, ComputedRef } from 'vue';
  import type EducationStageModel from '@/modules/EducationClassification/core/models/EducationStage/education.stages.model';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import { useI18n } from 'vue-i18n';
  import RenameClassificationDialog from '@/modules/EducationClassification/subComponent/RenameClassificationDialog.vue';
  import ToggleSwitch from 'primevue/toggleswitch';

  export interface StageNode {
    stage: EducationStageModel;
    children: StageNode[];
    isLoaded: boolean;
    isLoading: boolean;
    depth: number;
  }

  const props = defineProps<{
    node: StageNode;
    selectedStageId: number | null;
  }>();

  const emit = defineEmits<{
    (e: 'fetch-children', parentId: number, callback: (children: StageNode[]) => void): void;
    (e: 'add-child', stageId: number, level: number): void;
    (e: 'select', node: StageNode): void;
  }>();

  const maxDepth = inject<ComputedRef<number>>(
    'maxDepth',
    computed(() => Infinity),
  );
  const refreshParentId = inject<Ref<number | null>>('refreshParentId', ref(null));

  const canAddChild = computed(() => props.node.depth + 1 < maxDepth.value);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const hasFetched = ref(false);
  const children = ref<StageNode[]>([]);

  watch(refreshParentId, async (id) => {
    if (id !== props.node.stage.stage_id) return;
    isLoading.value = true;
    await new Promise<void>((resolve) => {
      emit('fetch-children', props.node.stage.stage_id, (fetched) => {
        children.value = fetched;
        hasFetched.value = true;
        isLoading.value = false;
        resolve();
      });
    });
    isOpen.value = true;
  });

  async function handleRowClick() {
    emit('select', props.node);
    await handleToggle();
  }

  async function handleToggle() {
    if (hasFetched.value && children.value.length === 0) return;

    if (!hasFetched.value) {
      isLoading.value = true;
      await new Promise<void>((resolve) => {
        emit('fetch-children', props.node.stage.stage_id, (fetched) => {
          children.value = fetched;
          hasFetched.value = true;
          isLoading.value = false;
          resolve();
        });
      });
    }

    if (children.value.length > 0) {
      isOpen.value = !isOpen.value;
    }
  }

  function handleAddChild() {
    emit('add-child', props.node.stage.stage_id, props.node.depth + 2);
  }

  function onChildFetch(parentId: number, callback: (children: StageNode[]) => void) {
    emit('fetch-children', parentId, callback);
  }

  function onChildAdd(stageId: number, level: number) {
    emit('add-child', stageId, level);
  }

  function onChildSelect(node: StageNode) {
    emit('select', node);
  }

  function isArabic(text: string) {
    return /[؀-ۿ]/.test(text);
  }

  const ShoweEditDialog = ref(false);
  const { t } = useI18n();

  function deleteEducationClassification(id: number) {
    console.warn('Delete not implemented for id:', id);
  }
  function toggleStatus(id: number) {
    console.warn('Toggle status not implemented for id:', id);
  }

  const actionList = (id: number, deleteFn: (id: number) => void) => [
    {
      text: t('rename'),
      icon: EditIcon,
      action: () => {
        ShoweEditDialog.value = true;
      },
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => deleteFn(id),
    },
    {
      text: t('unactive'),
      icon: ToggleSwitch,
      action: () => {
        toggleStatus(id);
      },
    },
  ];
</script>

<template>
  <div class="tree-node-wrapper">
    <div
      class="node-row"
      :class="{ 'is-selected': selectedStageId === node.stage.stage_id }"
      :style="{ paddingLeft: `${node.depth * 16 + 14}px` }"
      @click="handleRowClick"
    >
      <button
        v-if="!hasFetched || children.length > 0"
        class="toggle-btn"
        @click.stop="handleToggle"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          width="14"
          height="14"
          :style="{
            transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          }"
        >
          <path
            d="M5 7l5 5 5-5"
            stroke="#6b7280"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span v-else class="toggle-spacer" />

      <svg
        v-if="node.depth + 1 != maxDepth"
        viewBox="0 0 20 20"
        fill="none"
        width="16"
        height="16"
        class="node-icon"
      >
        <path
          d="M3 7a2 2 0 012-2h3.5l1.5 1.5H15a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
          stroke="#4caf50"
          stroke-width="1.3"
          fill="none"
        />
      </svg>
      <svg v-else viewBox="0 0 20 20" fill="none" width="16" height="16" class="node-icon">
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
        <path d="M7 8h6M7 11h6M7 14h4" stroke="#4caf50" stroke-width="1.1" stroke-linecap="round" />
      </svg>

      <span v-if="node.depth > 0" class="level-label">{{ $t('branch') }} {{ node.depth }}</span>

      <span class="node-name" :class="{ 'rtl-text': isArabic(node.stage.stage_title) }">
        {{ node.stage.stage_title }}
      </span>

      <span class="spacer" />

      <button v-if="canAddChild" class="icon-btn" title="Add child" @click.stop="handleAddChild">
        <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
          <circle cx="10" cy="10" r="8" stroke="#4caf50" stroke-width="1.4" />
          <path d="M10 7v6M7 10h6" stroke="#4caf50" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <button class="icon-btn" @click.stop>
        <DropList
          :action-list="actionList(node.stage.stage_id, deleteEducationClassification)"
          :delete-dialog-title="$t('are_you_sure_you_want_to_remove_this_education_classification')"
          :delete-dialog-message="
            $t(
              'Deleting_this_classification_will_remove_all_related_data_including_any_configurations_and_tree_structures_This_action_is_irreversible_and_the_classification_must_be_created_again_if_needed',
            )
          "
        />
        <RenameClassificationDialog v-model:visable="ShoweEditDialog" />
      </button>
    </div>

    <transition name="slide-down">
      <div v-if="isOpen && children.length > 0" class="children-wrapper">
        <StageTreeNode
          v-for="child in children"
          :key="child.stage.stage_id"
          :node="child"
          :selected-stage-id="selectedStageId"
          @fetch-children="onChildFetch"
          @add-child="onChildAdd"
          @select="onChildSelect"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .tree-node-wrapper {
    display: flex;
    flex-direction: column;
  }

  .node-row {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-radius: 8px;
    margin-bottom: 2px;
  }

  .node-row:hover {
    background-color: var(--gray-50-std);
  }

  .node-row.is-selected {
    background-color: var(--light-green-bg);
  }

  .toggle-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
  }

  .toggle-spacer {
    width: 22px;
    height: 22px;
  }

  .node-icon {
    margin-right: 8px;
    flex-shrink: 0;
  }

  .level-label {
    font-size: 10px;
    color: var(--gray-500-std);
    background: var(--gray-100-std);
    padding: 1px 4px;
    border-radius: 4px;
    margin-right: 8px;
    white-space: nowrap;
  }

  .node-name {
    font-size: 14px;
    color: var(--gray-800-std);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rtl-text {
    direction: rtl;
  }

  .spacer {
    flex-grow: 1;
  }

  .icon-btn {
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-400-std);
    border-radius: 50%;
    transition: background-color 0.2s;
    margin-left: 4px;
  }

  .icon-btn:hover {
    background-color: var(--gray-100-std);
    color: var(--success-green-std);
  }

  .children-wrapper {
    overflow: hidden;
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
  }

  .slide-down-enter-from,
  .slide-down-leave-to {
    max-height: 0;
    opacity: 0;
  }
</style>
