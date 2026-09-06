<script setup lang="ts">
  import { onBeforeUnmount, ref } from 'vue';
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
  import type AddAdviceParams from '../../core/params/add.advice.params';
  import AdviceController from '../controllers/advice.controller';
  import AdviceForm from './AdviceForm.vue';
  import AdviceUnsavedChangesDialog from './AdviceUnsavedChangesDialog.vue';

  const controller = AdviceController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const params = ref<AddAdviceParams | null>(null);
  const loading = ref(false);
  const hasChanges = ref(false);
  const isChangeTrackingInitialized = ref(false);
  const initialParamsSnapshot = ref<string | null>(null);
  const leaveDialogVisible = ref(false);
  let resolveNavigation: ((allow: boolean) => void) | null = null;

  const getParamsSnapshot = (value: AddAdviceParams) => JSON.stringify(value.toMap());

  const updateData = (updatedParams: AddAdviceParams) => {
    params.value = updatedParams;
    const snapshot = getParamsSnapshot(updatedParams);

    if (!isChangeTrackingInitialized.value) {
      initialParamsSnapshot.value = snapshot;
      isChangeTrackingInitialized.value = true;
      hasChanges.value = false;
      return;
    }

    hasChanges.value = snapshot !== initialParamsSnapshot.value;
  };

  const goToAdviceList = () => router.push({ name: 'Advices' });

  const requestCancel = () => {
    if (loading.value) return;
    leaveDialogVisible.value = true;
  };

  const continueEditing = () => {
    leaveDialogVisible.value = false;
    const resolve = resolveNavigation;
    resolveNavigation = null;
    resolve?.(false);
  };

  const discardChanges = async () => {
    leaveDialogVisible.value = false;
    hasChanges.value = false;
    const resolve = resolveNavigation;
    resolveNavigation = null;

    if (resolve) {
      resolve(true);
      return;
    }

    await goToAdviceList();
  };

  onBeforeRouteLeave(() => {
    if (!hasChanges.value) return true;
    if (loading.value) return false;

    leaveDialogVisible.value = true;
    return new Promise<boolean>((resolve) => {
      resolveNavigation = resolve;
    });
  });

  onBeforeUnmount(() => resolveNavigation?.(false));

  const saveAdvice = async () => {
    if (!params.value) {
      console.error('No advice parameters to save');
      return;
    }

    loading.value = true;
    try {
      const result = await controller.create(params.value);
      if (result?.data || !result?.hasError) {
        hasChanges.value = false;
        await goToAdviceList();
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error saving advice:', error);
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="advice-add-page">
    <AdviceForm :form-key="formKey" :loading="loading" @update-data="updateData" />
    <div class="actions">
      <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="saveAdvice">
        <span v-if="loading" class="loader"></span>
        <span v-else>{{ $t('save_advice') }}</span>
      </button>
      <button class="btn btn-cancel" type="button" :disabled="loading" @click="requestCancel">
        {{ $t('cancel') }}
      </button>
    </div>

    <AdviceUnsavedChangesDialog
      v-model="leaveDialogVisible"
      @continue="continueEditing"
      @discard="discardChanges"
    />
  </div>
</template>

<style scoped lang="scss">
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xs-size);
    margin-top: var(--xl-size-base);
  }

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
</style>
