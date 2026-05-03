<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import EducationClassificationController from '../controllers/educationClassification.controller';
  import type AddEducationClassificationParams from '../../core/params/add.educationClassification.params';
  import EducationClassificationForm from './EducationClassificationForm.vue';
  // Controller instance
  const controller = EducationClassificationController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  // Form state
  const params = ref<AddEducationClassificationParams | null>(null);
  /**
   * Save (create or update) email
   */
  const saveEducationClassification = async () => {
    try {
      if (!params.value) {
        console.error('No email parameters to save');
        return;
      }

      const paramsToSave = params.value;

      await controller.create(paramsToSave, undefined, formKey);
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const updateData = (updatedParams: AddEducationClassificationParams) => {
    params.value = updatedParams;
    // saveEmail();
  };
</script>

<template>
  <EducationClassificationForm
    :form-key="formKey"
    :country="controller.itemData.value || undefined"
    @update-data="updateData"
    @save-education-classification="saveEducationClassification"
  />
</template>

<style scoped>
  :deep(.input-file) {
    border: 1px solid var(--gray-200-std) !important;
    padding: 11px;
    border-radius: 20px !important;
    cursor: pointer;
  }

  /* .email-crud-example {
    padding: 20px;
    margin: 0 auto;
  }

  .email-list {
    margin-bottom: 30px;
  }

  .email-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid var(--gray-300);
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .email-type {
    color: var(--gray-600);
    font-size: 0.9em;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .email-form {
    padding: 20px;
    border: 1px solid var(--border-weak);
    border-radius: 4px;
    background-color: var(--bg-section);
  }

  .email-form input,
  .email-form select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid var(--border-weak);
    border-radius: 4px;
  }

  .form-actions {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 8px 16px;
    background-color: var(--PrimaryColor);
    color: var(--StandardWhite);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  button:hover {
    background-color: var(--PrimaryColor-dark);
  }

  .error {
    margin-top: 20px;
    padding: 10px;
    background-color: var(--danger-light);
    color: var(--danger-dark);
    border: 1px solid var(--danger-border);
    border-radius: 4px;
  } */
</style>
