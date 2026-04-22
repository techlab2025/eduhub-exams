<script setup lang="ts">
import { ref } from 'vue'
export interface TreeNode {
  id: number | string;
  label: string;
  children?: TreeNode[];
}
const props = defineProps<{
  node: TreeNode
}>()

const isOpen = ref(false)

const hasChildren = props.node.children && props.node.children.length > 0

const toggle = () => {
  if (hasChildren) isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="tree-item">
    <div class="tree-label" @click="toggle">
      <span v-if="hasChildren">
        {{ isOpen ? '📂' : '📁' }}
      </span>
      <span v-else>📄</span>

      {{ node.label }}
    </div>

    <div v-if="hasChildren && isOpen" class="tree-children">
      <TreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-item {
  padding-left: 10px;
}

.tree-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tree-children {
  margin-left: 15px;
  border-left: 1px dashed #ccc;
  padding-left: 10px;
}
</style>