<script setup lang="ts">
  import { ref } from 'vue';
  import { EmailController, type EmailParams } from '@/modules/employee-email';

  import EmailForm from './EmailForm.vue';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import { useRoute } from 'vue-router';
  // Controller instance
  const controller = EmailController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  // Form state
  const params = ref<EmailParams | null>(null);
  /**
   * Save (create or update) email
   */
  const saveEmail = async () => {
    try {
      if (!params.value) {
        return;
      }

      const paramsToSave = params.value;

      // if (paramsToSave.employeeId) {
      //   await controller.update(paramsToSave, undefined, formKey);
      // } else {
      await controller.create(paramsToSave, undefined, formKey);
      // router.push({ name: "Employee Emails" });
      // }

      // // Refresh list and reset form
      // if (controller.isItemSuccess()) {
      //   await controller.fetchList();
      //   params.value = null; // Reset form
      // }
    } catch (error) {
      // Handle error silently - let the controller handle error state
    }
  };

  const updateData = (updatedParams: EmailParams) => {
    params.value = updatedParams;
    // saveEmail();
  };
</script>

<template>
  <div class="email-crud-example">
    <EmailForm :form-key="formKey" :email="controller.itemData.value!" @update-data="updateData" />

    <AppButton title="Save Email" size="sm" icon="right" type="submit" @click="saveEmail">
      Save Email

      <template #icon>
        <IconAccept />
      </template>
    </AppButton>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped>
  :deep(.input-file) {
    border: 1px solid #d9dbe9 !important;
    padding: 11px;
    border-radius: 20px !important;
    cursor: pointer;
  }

  .email-crud-example {
    padding: 20px;
    /* max-width: 800px; */
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
    border: 1px solid #ddd;
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
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: var(--gray-100);
  }

  .email-form input,
  .email-form select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-actions {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 8px 16px;
    background-color: var(--PrimaryColor);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--PrimaryColor-dark);
  }

  .error {
    margin-top: 20px;
    padding: 10px;
    background-color: var(--danger-light);
    color: var(--danger-dark);
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }
</style>
