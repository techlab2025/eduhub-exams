<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import AboutController from '../controllers/about.controller';
  import type AddAboutParams from '../../core/params/add.about.params';
  import AboutForm from './AboutForm.vue';

  const controller = AboutController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddAboutParams | null>(null);

  /**
   * Save new employee
   */
  const saveAbout = async () => {
    try {
      if (!params.value) {
        console.error('No employee parameters to save');
        return;
      }

      await controller.create(params.value, undefined);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const updateData = (updatedParams: AddAboutParams) => {
    params.value = updatedParams;
  }; 
</script>

<template>
  <div class="employee-add-page">
    <AboutForm :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <!-- <AppButton title="Save Employee" size="sm" icon="right" type="submit" @click="saveEmployee">
        Save Employee
        <template #icon>
          <IconAccept />
        </template>
</AppButton> -->
      <button class="btn btn-primary w-full" type="submit" @click="saveAbout">Save document</button>
    </div>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
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
