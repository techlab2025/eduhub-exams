<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import SupportContactsController from '../controllers/support.controller';
  import type AddSupportContactsParams from '../../core/params/add.support.params';
  import SupportForm from './SupportForm.vue';

  const controller = SupportContactsController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const sectionParams = ref<AddSupportContactsParams | null>(null);

  const saveSupport = async () => {
    if (!sectionParams.value) return;
    await controller.create(sectionParams.value, undefined);
  };

  const updateData = (params: AddSupportContactsParams) => {
    sectionParams.value = params;
  };
</script>

<template>
  <div class="support-add-page">
    <SupportForm :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <button class="btn btn-primary w-full" type="submit" @click="saveSupport">
        {{ $t('save') }}
      </button>
    </div>

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
