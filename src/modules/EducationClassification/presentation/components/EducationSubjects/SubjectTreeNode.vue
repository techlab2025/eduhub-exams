<script setup lang="ts">
  import { ref, inject, computed } from 'vue';
  import type { ComputedRef } from 'vue';
  import type EducationSubjectModel from '@/modules/EducationClassification/core/models/EducationSubject/education.subject.model';

  export interface SubjectNode {
    subject: EducationSubjectModel;
    children: SubjectNode[];
    isLoaded: boolean;
    isLoading: boolean;
    depth: number;
  }

  const props = defineProps<{
    node: SubjectNode;
    selectedSubjectId: number | null;
  }>();

  const onExpand = inject<(node: SubjectNode) => Promise<void>>('subjectOnExpand')!;
  const onSelect = inject<(node: SubjectNode) => void>('subjectOnSelect')!;
  const onAddChild = inject<(subjectId: number, level: number) => void>('subjectOnAddChild')!;
  const maxDepth = inject<ComputedRef<number>>(
    'subjectMaxDepth',
    computed(() => Infinity),
  );

  const canAddChild = computed(() => props.node.depth + 1 < maxDepth.value);
  const isOpen = ref(false);

  async function handleRowClick() {
    onSelect(props.node);
    await handleToggle();
  }

  async function handleToggle() {
    if (!isOpen.value && !props.node.isLoaded && props.node.subject.has_children) {
      await onExpand(props.node);
    }
    isOpen.value = !isOpen.value;
  }

  function handleAddChild() {
    onAddChild(props.node.subject.subject_id, props.node.depth + 2);
  }

  function isArabic(text: string) {
    return /[؀-ۿ]/.test(text);
  }
</script>

<template>
  <div class="tree-node-wrapper">
    <div
      class="node-row"
      :class="{ 'is-selected': selectedSubjectId === node.subject.subject_id }"
      :style="{ paddingLeft: `${node.depth * 16 + 14}px` }"
      @click="handleRowClick"
    >
      <button
        v-if="node.subject.has_children || node.children.length > 0"
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
            stroke="#4caf50"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span v-else class="toggle-spacer" />

      <svg
        v-if="node.depth + 1 !== maxDepth"
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

      <span v-if="node.depth > 0" class="level-label">Level {{ node.depth }}</span>

      <span class="node-name" :class="{ 'rtl-text': isArabic(node.subject.subject_title) }">
        {{ node.subject.subject_title }}
      </span>

      <span class="spacer" />

      <button v-if="canAddChild" class="icon-btn" title="Add child" @click.stop="handleAddChild">
        <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
          <circle cx="10" cy="10" r="8" stroke="#4caf50" stroke-width="1.4" />
          <path d="M10 7v6M7 10h6" stroke="#4caf50" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <button class="icon-btn" @click.stop>
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <circle cx="10" cy="5" r="1.2" />
          <circle cx="10" cy="10" r="1.2" />
          <circle cx="10" cy="15" r="1.2" />
        </svg>
      </button>
    </div>

    <transition name="slide-down">
      <div v-if="isOpen && node.children.length > 0" class="children-wrapper">
        <SubjectTreeNode
          v-for="child in node.children"
          :key="child.subject.subject_id"
          :node="child"
          :selected-subject-id="selectedSubjectId"
        />
      </div>
    </transition>
  </div>
</template>
