<script setup lang="ts">
  import EducationTypeIcon from '@/assets/images/EducationType.png';
  import { ref, computed, watch, nextTick } from 'vue';
  import Dialog from 'primevue/dialog';
  import MultiLangInput from '@/shared/MultiLangInput.vue';

  const props = withDefaults(
    defineProps<{
      visible: boolean;
      stageName?: string;
    }>(),
    {
      stageName: '',
    },
  );
  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
    (e: 'confirm', name: Record<string, string>): void;
  }>();

  const inputValue = ref<Record<string, string>>({});
  const inputRef = ref<HTMLInputElement | null>(null);

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  });

  watch(dialogVisible, async (val) => {
    if (val) {
      inputValue.value = {};
      await nextTick();
      inputRef.value?.focus();
    }
  });

  const isInputEmpty = computed(() => {
    return (
      !inputValue.value || Object.values(inputValue.value).every((val) => !val || val.trim() === '')
    );
  });

  function handleConfirm() {
    if (isInputEmpty.value) return;
    emit('confirm', inputValue.value);
    inputValue.value = {};
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
        <!-- <EducationTypeIcon /> -->
        <img :src="EducationTypeIcon" alt="EducationTypeIcon" width="300" />
      </div>
      <div>
        <h3 class="dialog-title">
          {{ $t('add_named_level', { name: stageName || $t('stage') }) }}
        </h3>
        <p class="dialog-subtitle">
          {{ $t('enter_named_level', { name: stageName || $t('stage') }) }}
        </p>
      </div>
    </template>

    <!-- <label class="field-label" for="edu-type-input">{{ $t('education_type') }}</label>
    <input
      id="edu-type-input"
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="$t('enter_education_type')"
      class="field-input"
      @keydown.enter="handleConfirm"
      @keydown.esc="dialogVisible = false"
    /> -->
    <MultiLangInput
      ref="inputRef"
      :field-key="`title`"
      :label="$t('named_level', { name: stageName || $t('stage') })"
      :languages="['en', 'ar']"
      :model-value="inputValue"
      :placeholder="$t('enter_named_level', { name: stageName || $t('stage') })"
      :type="`title`"
      @update:model-value="inputValue = $event"
      @keydown.enter="handleConfirm"
      @keydown.esc="dialogVisible = false"
    />

    <div class="dialog-footer">
      <button class="btn btn-primary" :disabled="isInputEmpty" @click="handleConfirm">
        {{ $t('add') }}
      </button>
      <button class="btn btn-secondary" @click="dialogVisible = false">{{ $t('cancel') }}</button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
  :global(.p-dialog.add-education-type-dialog .multi-lang-input .field-input) {
    background: var(--standard-white) !important;
    border-color: var(--gray-200-std) !important;
    color: var(--standard-black) !important;
  }

  :global(.p-dialog.add-education-type-dialog .multi-lang-input .field-input:focus) {
    background: var(--standard-white) !important;
    border-color: var(--success-green-std) !important;
  }
</style>
