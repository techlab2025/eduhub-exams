<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import TermsConditionsController from '../controllers/terms-conditions.controller';
  import AddTermsConditionsParams from '../../core/params/add.terms-conditions.params';

  const emit = defineEmits(['update:data']);

  const data = ref<Record<string, string>>();

  const updateData = () => {
    emit('update:data', data.value);
  };

  // ─── Init ───────────────────────────────
  onMounted(() => {
    updateData();
  });

  const termsConditionsController = TermsConditionsController.getInstance();
  const SubmitData = () => {
    termsConditionsController.create(
      new AddTermsConditionsParams({
        terms_conditions: data.value!,
      }),
    );
  };

  const ShowTermsConditions = async () => {
    const result = await termsConditionsController.fetchList();

    if (result instanceof DataSuccess) {
      data.value = result.data[0].terms_conditions;
    }
  };

  onMounted(() => {
    ShowTermsConditions();
  });

  onUnmounted(() => {
    data.value = {};
  });
</script>

<template>
  <div class="faq-container">
    <!-- Header -->
    <div class="faq-header">
      <h3>TermsConditions</h3>
      <p>Add questions and answers dynamically</p>
    </div>

    <!-- List -->
    <div class="faq-list">
      <!-- Question -->
      <div class="field">
        <MultiLangInput
          :field-key="`terms_conditions`"
          :label="`terms_conditions`"
          :languages="['en', 'ar', 'fr']"
          :model-value="data"
          @update:model-value="data = $event"
        />
      </div>
    </div>

    <!-- Add Button -->
    <div class="btn-container">
      <button class="add-btn" @click="SubmitData">Save</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .faq-container {
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: 16px;
    padding: 20px;
  }
</style>
