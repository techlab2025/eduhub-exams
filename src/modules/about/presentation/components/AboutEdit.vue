<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import type EditAboutParams from '../../core/params/edit.about.params';
  import AboutController from '../controllers/about.controller';
  import ShowAboutParams from '../../core/params/show.about.params';
  import AboutForm from './AboutForm.vue';

  const controller = AboutController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<EditAboutParams | null>(null);

  /**
   * Update employee
   */
  const saveAbout = async () => {
    if (!params.value) {
      console.error('No data to save');
      return;
    }

    console.log(params.value, "params.value")
    await controller.update(params.value, undefined);
  };

  const updateData = (updatedParams: EditAboutParams) => {
    params.value = updatedParams;
  };

  onMounted(async () => {
    await controller.fetchOne(new ShowAboutParams(1));
  });
</script>

<template>
  <div class="employee-edit-page">
    <AboutForm
      :about="controller.itemState.value.data!"
      :form-key="formKey"
      @update-data="updateData"
    />

    <div class="actions">
      <!-- <AppButton title="Update Employee" size="sm" icon="right" type="submit" @click="saveAbout">
        Update Employee
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
  // .employee-edit-page {
  //   padding: 24px;
  //   max-width: 1000px;
  //   margin: 0 auto;
  // }

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
