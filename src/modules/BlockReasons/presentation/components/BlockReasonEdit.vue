<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import BlockReasonController from '../controllers/blockReason.controller';
  import BlockReasonForm from './BlockReasonForm.vue';
  import type EditBlockReasonsParams from '../../core/params/edit.blockReason.params';
  import ShowBlockReasonsParams from '../../core/params/show.blockReason.params';

  const controller = BlockReasonController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const params = ref<EditBlockReasonsParams | null>(null);
  const loading = ref(false);

  const updateData = (updatedParams: EditBlockReasonsParams) => {
    params.value = updatedParams;
  };

  const saveBlockReason = async () => {
    if (!params.value) {
      console.error('No block reason parameters to update');
      return;
    }

    loading.value = true;
    try {
      const result = await controller.update(params.value);
      if (result?.data || !result?.hasError) {
        await router.push({ name: 'Block Reasons' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error updating block reason:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await controller.fetchOne(
      new ShowBlockReasonsParams({
        blockReasonId: Number(route.params.id),
      }),
    );
  });
</script>

<template>
  <div class="block-reason-edit-page">
    <BlockReasonForm
      :block-reason="controller.itemData.value!"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
    />

    <div class="actions" :class="{ disabled: loading }">
      <button
        class="btn btn-primary w-full"
        type="button"
        :disabled="loading"
        @click="saveBlockReason"
      >
        <span v-if="loading" class="loader"></span>
        <span v-else>{{ $t('update_block_reason') }}</span>
      </button>
      <router-link to="/block-reasons" class="btn btn-cancel">
        {{ $t('cancel') }}
      </router-link>
    </div>

    <!-- <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div> -->
  </div>
</template>

<style scoped lang="scss">
  .loader {
    width: 35px;
    height: 35px;
    border: 8px solid;
    border-color: var(--Black) transparent;
    border-radius: var(--radius-full);
    animation: loading-spin 1s infinite;
  }

  @keyframes loading-spin {
    to {
      transform: rotate(0.5turn);
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xs-size);
    margin-top: var(--xl-size-base);

    &.disabled {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  .error-toast {
    margin-top: var(--xl-size-base);
    padding: var(--xs-size) var(--xl-size-base);
    color: var(--error-dark);
    background: var(--error-light);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-md);
  }
</style>
