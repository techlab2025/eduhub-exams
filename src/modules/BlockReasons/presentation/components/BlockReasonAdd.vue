<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import BlockReasonController from '../controllers/blockReason.controller';
  import type AddBlockReasonsParams from '../../core/params/add.blockReason.params';
  import BlockReasonForm from './BlockReasonForm.vue';

  const controller = BlockReasonController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddBlockReasonsParams | null>(null);
  const loading = ref(false);
  const saveBlockReason = async () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No block reason parameters to save');
        return;
      }

      const result = await controller.create(params.value, undefined);
      if (result?.data) {
        await router.push({ name: 'Block Reasons' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error saving block reason:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddBlockReasonsParams) => {
    params.value = updatedParams;
  };

  const router = useRouter();
</script>

<template>
  <div class="block-reason-add-page">
    <BlockReasonForm :form-key="formKey" :loading="loading" @update-data="updateData" />

    <div class="actions">
      <button
        class="btn btn-primary w-full"
        type="button"
        :disabled="loading"
        @click="saveBlockReason"
      >
        <span v-if="loading" class="loader"></span>
        <span v-else>
          {{ $t('save_block_reason') }}
        </span>
      </button>
      <router-link to="/block-reasons" class="btn btn-cancel">
        {{ $t(`cancel`) }}
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .loader {
    width: 35px;
    height: 35px;
    border-radius: var(--radius-full);
    border: 8px solid;
    border-color: var(--Black) transparent;
    animation: l1 1s infinite;
  }

  @keyframes l1 {
    to {
      transform: rotate(0.5turn);
    }
  }

  .btn-cancel {
    background-color: var(--background-btn-outline-color);
    color: var(--danger-color);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-full);
    width: 20%;

    @media (max-width: 768px) {
      width: 50%;
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
