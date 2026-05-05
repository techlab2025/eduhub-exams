<script setup lang="ts">
  import EducationTypeIcon from '@/shared/icons/EducationTypeIcon.vue';
  import { ref, computed, watch, nextTick } from 'vue';
  import Dialog from 'primevue/dialog';

  const props = defineProps<{ visible: boolean }>();
  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
    (e: 'confirm', name: string): void;
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
    emit('confirm', name);
    inputValue.value = '';
  }
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :style="{ width: '35rem' }"
    :pt="{
      root: 'add-education-type-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <template #header>
      <div class="dialog-icon">
        <EducationTypeIcon />
      </div>
      <div>
        <h3 class="dialog-title">{{ $t('add_education_type') }}</h3>
        <p class="dialog-subtitle">{{ $t('enter_the_name_of_the_education_type_you_want_to_add') }}</p>
      </div>
    </template>

    <label class="field-label" for="edu-type-input">{{ $t('education_type') }}</label>
    <input
      id="edu-type-input"
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="$t('enter_education_type')"
      class="field-input"
      @keydown.enter="handleConfirm"
      @keydown.esc="dialogVisible = false"
    />

    <div class="dialog-footer">
      <button class="btn btn-primary" :disabled="!inputValue.trim()" @click="handleConfirm">
        {{ $t('add') }}
      </button>
      <button class="btn btn-secondary" @click="dialogVisible = false">{{ $t('cancel') }}</button>
    </div>
  </Dialog>
</template>
