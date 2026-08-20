<script setup lang="ts">
  import { nextTick, onBeforeUnmount, ref } from 'vue';
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
  import { isDataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import PlanController from '../controllers/plan.controller';
  import PlanForm from './PlanForm.vue';
  import type AddPlanParams from '../../core/params/add.plan.params';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
  import DraftPlanDialog from '../subCopmnents/DraftPlanDialog.vue';
  import UnsavedPlanChangesDialog from '../subCopmnents/UnsavedPlanChangesDialog.vue';

  const controller = PlanController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  const plansQuery = () => ({ ...route.query });

  const params = ref<AddPlanParams | null>(null);
  const planFormRef = ref<{
    validate?: () => Promise<boolean>;
    validateTitle?: () => Promise<boolean>;
  } | null>(null);
  const loading = ref(false);
  const publishReady = ref(false);
  const draftDialogVisible = ref(false);
  const hasChanges = ref(false);
  const initialParamsSnapshot = ref<string | null>(null);
  const isInitialized = ref(false);
  const leaveDialogVisible = ref(false);
  let resolveNavigation: ((allow: boolean) => void) | null = null;

  const getParamsSnapshot = (value: AddPlanParams | null) =>
    value ? JSON.stringify(value.toMap?.() ?? value) : null;

  const initializeChangeTracking = async () => {
    if (isInitialized.value) return;

    await nextTick();
    initialParamsSnapshot.value = getParamsSnapshot(params.value);
    hasChanges.value = false;
    isInitialized.value = true;
  };

  const resolveLeaveRequest = (allowNavigation: boolean) => {
    leaveDialogVisible.value = false;
    const resolve = resolveNavigation;
    resolveNavigation = null;
    resolve?.(allowNavigation);
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
  const savePlan = async () => {
    const isValid = await planFormRef.value?.validate?.();
    if (isValid === false) return;

    loading.value = true;
    try {
      if (!params.value) {
        console.error('No plan parameters to save');
        return;
      }

      params.value.status = PlanStatusEnum.ACTIVE;
      const result = await controller.create(params.value, undefined);
      if (!result || !isDataSuccess(result)) return;

      hasChanges.value = false;
      await router.push({ name: 'Plans', query: plansQuery() });
      await controller.fetchList();
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddPlanParams) => {
    params.value = updatedParams;
    if (isInitialized.value) {
      hasChanges.value = getParamsSnapshot(updatedParams) !== initialParamsSnapshot.value;
    }
  };

  const router = useRouter();
  const saveDraft = async () => {
    const hasValidTitle = await planFormRef.value?.validateTitle?.();
    if (hasValidTitle === false) return;

    // loading.value = true;
    // try {
    //   if (!params.value) {
    //     console.error('No plan parameters to save');
    //     return;
    //   }
    // params.value.status = PlanStatusEnum.DRAFT;
    // const result = await controller.create(params.value, undefined);
    // if (result?.data) {
    // await controller.fetchList();
    draftDialogVisible.value = true;
    // }
    // } catch (error) {
    //   console.error('Error saving plan draft:', error);
    // } finally {
    //   loading.value = false;
    // }
  };
  const acknowledgeDraft = async () => {
    draftDialogVisible.value = false;
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No plan parameters to save');
        return;
      }
      params.value.status = PlanStatusEnum.DRAFT;
      const result = await controller.create(params.value, undefined);
      if (!result || !isDataSuccess(result)) return;

      hasChanges.value = false;
      await controller.fetchList();
      await router.push({ name: 'Plans', query: plansQuery() });
    } catch (error) {
      console.error('Error saving plan draft:', error);
    } finally {
      loading.value = false;
    }
  };
  const cancelDraft = () => {
    router.push({ name: 'Plans', query: plansQuery() });
  };
</script>

<template>
  <div class="plan-add-page">
    <PlanForm
      ref="planFormRef"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
      @validity-change="publishReady = $event"
      @features-loaded="initializeChangeTracking"
    />

    <div class="actions">
      <button
        class="btn btn-primary publish-button"
        :class="{ 'is-not-ready': !publishReady }"
        type="button"
        :aria-disabled="!publishReady"
        :disabled="loading"
        @click="savePlan"
      >
        <span v-if="loading" class="loader"></span>
        <span v-else>
          {{ $t('publish') }}
        </span>
      </button>
      <button type="button" class="btn btn-draft" :disabled="loading" @click.prevent="saveDraft">
        {{ $t('save_as_draft') }}
      </button>
      <button type="button" class="btn btn-cancel" :disabled="loading" @click.prevent="cancelDraft">
        {{ $t('cancel') }}
      </button>
      <!-- <DraftPlanDialog /> -->
    </div>

    <DraftPlanDialog v-model="draftDialogVisible" @acknowledge="acknowledgeDraft" />
    <UnsavedPlanChangesDialog
      v-model="leaveDialogVisible"
      @confirm="resolveLeaveRequest(true)"
      @cancel="resolveLeaveRequest(false)"
    />
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

  @keyframes l7 {
    to {
      transform: rotate(0.5turn);
    }
  }

  .btn-draft,
  .publish-button {
    border-radius: var(--radius-full);
    width: min(240px, 50%);

    // &:disabled {
    //   cursor: not-allowed;
    //   opacity: 0.5;
    // }
  }

  // .publish-button.is-not-ready:not(:disabled) {
  //   opacity: 0.5;
  // }

  .btn-draft {
    border: 1px solid var(--PrimaryColor-alpha-10);
    background-color: var(--PrimaryColor-alpha-10);
    color: var(--PrimaryColor);
  }

  .actions {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    button {
      width: 50%;
    }
  }

  @media (max-width: 768px) {
    .actions {
      flex-direction: column;
    }

    .btn-draft,
    .publish-button {
      width: 100%;
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
