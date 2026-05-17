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
  const loading = ref(false);
  /**
   * Save new employee
   */
  const saveEmployee = async () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No employee parameters to save');
        return;
      }

      await controller.create(params.value, undefined, formKey);
      await controller.fetchList();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddEmployeeParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="employee-add-page">
    <EmployeeForm
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
      @save-employee="saveEmployee"
    />

    <div class="actions">
      <AppButton
        title="Save Employee"
        size="sm"
        icon="right"
        type="submit"
        class="save-emp"
        :class="{ disabled: loading }"
        @click="saveEmployee"
      >
        Save Employee
        <template #icon>
          <IconAccept />
        </template>
      </AppButton>
      <button class="btn btn-draft">{{ $t(`Save As draft`) }}</button>
      <button class="btn btn-cancel">{{ $t(`cancel`) }}</button>
    </div>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .btn-cancel {
    background-color: var(--background-btn-outline-color);
    color: var(--danger-color);
    border: 1px solid rgba(245, 194, 192, 1);
    border-radius: 50px;
    width: 20%;

    @media (max-width: 768px) {
      width: 50%;
    }
  }

  .btn-draft {
    background-color: var(--PrimaryColor-alpha-10);
    color: var(--PrimaryColor);
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 50px;
    width: 20%;

    @media (max-width: 768px) {
      width: 50%;
    }
  }

  .save-emp {
    width: 60%;
    &.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .actions {
    margin-top: 24px;
    display: flex;
    gap: 10px;
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
