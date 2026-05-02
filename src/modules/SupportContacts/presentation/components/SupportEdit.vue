<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import SupportContactsController from '../controllers/support.controller';
  import type AddSupportContactsParams from '../../core/params/add.support.params';
  import type SupportContactsModel from '../../core/models/support.contatcts.model';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import SupportForm from './SupportForm.vue';

  const controller = SupportContactsController.getInstance();
  const route = useRoute();
  const router = useRouter();

  const countryCode = computed(() => (route.params?.country_code as string) || '');
  const formKey = route.fullPath;

  const initialSections = ref<SupportContactsModel[]>([]);
  const formParams = ref<AddSupportContactsParams | null>(null);
  const isLoaded = ref(false);

  const saveSupport = async () => {
    if (!formParams.value) return;
    await controller.create(formParams.value, undefined);
  };

  const cancel = () => {
    router.push(`/${countryCode.value}/support`);
  };

  const updateData = (params: AddSupportContactsParams) => {
    formParams.value = params;
  };

  onMounted(async () => {
    await controller.fetchList();
    const state = controller.listState.value;
    if (state instanceof DataSuccess && Array.isArray(state.data)) {
      initialSections.value = state.data as SupportContactsModel[];
    }
    isLoaded.value = true;
  });
</script>

<template>
  <div class="support-edit-page">
    <SupportForm
      v-if="isLoaded"
      :form-key="formKey"
      :initial-sections="initialSections"
      @update-data="updateData"
    />

    <div v-if="isLoaded" class="edit-actions">
      <button class="btn btn-primary" type="button" @click="saveSupport">
        {{ $t('save_change') }}
      </button>
      <button class="btn-cancel" type="button" @click="cancel">
        {{ $t('cancel') }}
      </button>
    </div>

    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .support-edit-page {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .edit-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    width: 100%;

    .btn-primary {
      width: 80%;
    }

    .btn-cancel {
      padding: 14px;
      background-color: var(--danger-light-alt);
      color: var(--danger);
      border: 1.5px solid #fecaca;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      width: 20%;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--danger-light);
      }
    }
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
