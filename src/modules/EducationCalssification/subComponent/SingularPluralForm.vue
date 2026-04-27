<script setup lang="ts">
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import { reactive, watch } from 'vue';

  const props = defineProps<{
    numberOfBranches: number;
    label: string;
  }>();

  const emit = defineEmits<{
    (e: 'update', value: Branch[]): void;
  }>();

  type Branch = {
    singular: Record<string, string>;
    plural: Record<string, string>;
  };

  const branches = reactive<Branch[]>(
    Array.from({ length: props.numberOfBranches }, () => ({
      singular: {},
      plural: {},
    })),
  );

  watch(
    () => props.numberOfBranches,
    (newVal) => {
      branches.length = 0;

      for (let i = 0; i < newVal; i++) {
        branches.push({
          singular: { en: '', ar: '' },
          plural: { en: '', ar: '' },
        });
      }
    },
  );
  const SaveData = () => {
    emit('update', branches);
  };
</script>

<template>
  <div class="branches">
    <div v-for="(branch, index) in branches" :key="index" class="branch-row">
      <!-- Singular -->
      <div class="input-group">
        <MultiLangInput
          :field-key="`title_Singular`"
          :label="`${label} ${index + 1} (Singular)`"
          :languages="['en', 'ar']"
          :model-value="branch.singular"
          @update:model-value="branch.singular = $event"
        />
      </div>

      <!-- Plural -->
      <div class="input-group">
        <MultiLangInput
          :field-key="`title_Plural`"
          :label="`${label} ${index + 1} (Plural)`"
          :languages="['en', 'ar']"
          :model-value="branch.plural"
          @update:model-value="branch.plural = $event"
        />
      </div>
    </div>
    <button class="save-btn" @click="SaveData" v-if="numberOfBranches">
      {{ $t('save') }}
    </button>
  </div>
</template>

<style scoped>
  .save-btn {
    width: 100%;
  }
  .branches {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .branch-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lang-switch {
    font-size: 12px;
    color: gray;
  }

  input {
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ddd;
  }
</style>
