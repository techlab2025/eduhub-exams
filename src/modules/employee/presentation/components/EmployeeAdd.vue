<script setup lang="ts">
  import { ref } from 'vue';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import { useRoute } from 'vue-router';
  import EmployeeController from '../controllers/employee.controller';
  import EmployeeForm from './EmployeeForm.vue';
  import type AddEmployeeParams from '../../core/params/add.employee.params';

  const controller = EmployeeController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddEmployeeParams | null>(null);

  /**
   * Save new employee
   */
  const saveEmployee = async () => {
    try {
      if (!params.value) {
        console.error('No employee parameters to save');
        return;
      }

      await controller.create(params.value, undefined, formKey);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const updateData = (updatedParams: AddEmployeeParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="employee-add-page">
    <EmployeeForm :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <AppButton title="Save Employee" size="sm" icon="right" type="submit" @click="saveEmployee">
        Save Employee
        <template #icon>
          <IconAccept />
        </template>
      </AppButton>
    </div>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .employee-add-page {
    padding: 24px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }

  .error-toast {
    margin-top: 20px;
    padding: 12px 16px;
    background-color: var(--error-light);
    color: var(--error-dark);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
  }
</style>
