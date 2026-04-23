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
  .btn-container {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    .btn-primary {
      width: 50%;
    }
  }

  .faq-container {
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: 16px;
    padding: 20px;
  }

  /* Header */
  .faq-header {
    margin-bottom: 16px;

    h3 {
      font-size: 1.2rem;
      font-weight: 800;
      margin: 0;
    }

    p {
      font-size: 0.85rem;
      color: var(--gray-400);
    }
  }

  /* List */
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Card */
  .faq-card {
    border: 1px solid var(--border-weak);
    border-radius: 12px;
    padding: 16px;
    background: var(--gray-50);
    transition: 0.25s;

    &:hover {
      border-color: var(--PrimaryColor);
      background: var(--bg-main);
    }
  }

  /* Header inside card */
  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-weight: 700;
  }

  /* Fields */
  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    label {
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    textarea {
      resize: none;
      min-height: 80px;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--border-weak);
      background: white;
      transition: 0.2s;

      &:focus {
        outline: none;
        border-color: var(--PrimaryColor);
        box-shadow: 0 0 0 2px var(--PrimaryColor-light);
      }
    }
  }

  /* Buttons */
  .add-btn {
    margin-top: 16px;
    width: 50%;
    padding: 10px;
    border-radius: 10px;
    background: var(--PrimaryColor);
    color: white;
    font-weight: 700;
    cursor: pointer;
  }

  .delete-btn {
    background: transparent;
    border: none;
    color: red;
    cursor: pointer;
  }
</style>
