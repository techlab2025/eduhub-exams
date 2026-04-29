<script setup lang="ts">
  import NewBranchIcon from '@/shared/icons/NewBranchIcon.vue';
  import { ref, computed, watch, nextTick } from 'vue';
  import Dialog from 'primevue/dialog';

  const props = defineProps<{
    visible: boolean;
    level: number;
    branchId?: number;
    branchName?: string;
  }>();

  const displayName = computed(() => props.branchName ?? `Branch ${props.level}`);

  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
    (e: 'confirm', data: { name: string; level: number; branchId?: number }): void;
  }>();

  const inputValue = ref('');
  const inputRef = ref<HTMLInputElement | null>(null);

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  });

  watch(dialogVisible, async (val) => {
    if (val) {
      inputValue.value = '';
      await nextTick();
      inputRef.value?.focus();
    }
  });

  function handleConfirm() {
    const name = inputValue.value.trim();
    if (!name) return;
    emit('confirm', {
      name: name,
      level: props.level,
      branchId: props.branchId,
    });
    inputValue.value = '';
  }
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :style="{ width: '30rem' }"
    :pt="{
      root: 'add-branch-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <template #header>
      <div class="dialog-icon">
        <NewBranchIcon />
      </div>
      <div class="dialog-header-text">
        <h3 class="dialog-title">Add A New {{ displayName }}</h3>
        <p class="dialog-subtitle">Enter Your Preferred {{ displayName }} Name Within The Tree</p>
      </div>
    </template>

    <label class="field-label" :for="`branch-input-${level}`">{{ displayName }} Name</label>
    <input
      :id="`branch-input-${level}`"
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="`Enter ${displayName} Name`"
      class="field-input"
      @keydown.enter="handleConfirm"
      @keydown.esc="dialogVisible = false"
    />

    <div class="dialog-footer">
      <button class="btn btn-primary" :disabled="!inputValue.trim()" @click="handleConfirm">
        Add
      </button>
      <button class="btn btn-secondary" @click="dialogVisible = false">Cancel</button>
    </div>
  </Dialog>
</template>
