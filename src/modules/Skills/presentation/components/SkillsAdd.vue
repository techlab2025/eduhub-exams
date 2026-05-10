<script setup lang="ts">
  import { ref } from 'vue';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import { useRoute } from 'vue-router';
  import type AddSkillsParams from '../../core/params/add.skills.params';
  import SkillsForm from './SkillsForm.vue';
  import SkillsController from '../controllers/skills.controller';

  const controller = SkillsController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddSkillsParams | null>(null);

  /**
   * Save new employee
   */
  const saveEmployee = async () => {
    try {
      console.log(params.value, 'params');

      if (!params.value) {
        console.error('No employee parameters to save');
        return;
      }

      await controller.create(params.value, undefined);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const updateData = (updatedParams: AddSkillsParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="employee-add-page">
    <SkillsForm :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <AppButton
        title="Save Employee"
        size="sm"
        icon="right"
        type="submit"
        class="save-emp"
        @click="saveEmployee"
      >
        Save Skill
        <template #icon>
          <IconAccept />
        </template>
      </AppButton>
      <!-- <button class="btn btn-draft">{{ $t(`Save As draft`) }}</button> -->
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
