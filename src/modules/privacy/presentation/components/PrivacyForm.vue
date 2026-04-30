<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import PrivacyController from '../controllers/privacy.controller';
  import AddPrivacyParams from '../../core/params/add.privacy.params';

  const emit = defineEmits(['update:data']);

  const data = ref<Record<string, string>>();

  const updateData = () => {
    emit('update:data', data.value);
  };

  // ─── Init ───────────────────────────────
  onMounted(() => {
    updateData();
  });

  const privacyController = PrivacyController.getInstance();
  const SubmitData = () => {
    privacyController.create(
      new AddPrivacyParams({
        privacy: data.value!,
      }),
    );
  };

  const ShowPrivacy = async () => {
    const result = await privacyController.fetchList();

    if (result instanceof DataSuccess) {
      data.value = result.data[0].privacy;
    }
  };

  onMounted(() => {
    ShowPrivacy();
  });

  onUnmounted(() => {
    data.value = {};
  });
</script>

<template>
  <div class="faq-container">
    <!-- Header -->
    <div class="faq-header">
      <h3>Privacy</h3>
      <p>Add questions and answers dynamically</p>
    </div>

    <!-- List -->
    <div class="faq-list">
      <!-- Question -->
      <div class="field">
        <MultiLangInput
          :field-key="`privacy`"
          :label="`privacy`"
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
