<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
  import { isDataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import PlanController from '../controllers/plan.controller';
  import PlanForm from './PlanForm.vue';
  import EditPlanParams from '../../core/params/edit.plan.params';
  import type AddPlanParams from '../../core/params/add.plan.params';
  import ShowPlanParams from '../../core/params/show.plan.params';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
  import DraftPlanDialog from '../subCopmnents/DraftPlanDialog.vue';
  import PlanDeleteWarningDialog from '../subCopmnents/PlanDeleteWarningDialog.vue';
  import UnsavedPlanChangesDialog from '../subCopmnents/UnsavedPlanChangesDialog.vue';

  const controller = PlanController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const plansQuery = () =>
    Object.fromEntries(Object.entries(route.query).filter(([key]) => key !== 'section'));
  const returnToPlanIndex = () => router.push({ name: 'Plans', query: plansQuery() });
  const params = ref<EditPlanParams | null>(null);
  const planFormRef = ref<{ validate?: () => Promise<boolean> } | null>(null);
  const loading = ref(false);
  const publishReady = ref(false);
  const draftDialogVisible = ref(false);
  const warningDialogVisible = ref(false);
  const warningActionType = ref<'delete' | 'deactivate' | 'archive' | 'draft'>('draft');
  const hasChanges = ref(false);
  const initialParamsSnapshot = ref<string | null>(null);
  const isInitialized = ref(false);
  const isPlanLoaded = ref(false);
  const areFeaturesLoaded = ref(false);
  const leaveDialogVisible = ref(false);
  let resolveNavigation: ((allow: boolean) => void) | null = null;
  const isDraft = computed(() => controller.itemData.value?.status === PlanStatusEnum.DRAFT);

  const getParamsSnapshot = (value: EditPlanParams | null) =>
    value ? JSON.stringify(value.toMap()) : null;

  const updateData = (updatedParams: AddPlanParams | EditPlanParams) => {
    if (!(updatedParams instanceof EditPlanParams)) return;

    params.value = updatedParams;
    if (isInitialized.value) {
      hasChanges.value = getParamsSnapshot(updatedParams) !== initialParamsSnapshot.value;
    }
  };

  const initializeChangeTracking = async () => {
    if (isInitialized.value || !isPlanLoaded.value || !areFeaturesLoaded.value) return;

    await nextTick();
    initialParamsSnapshot.value = getParamsSnapshot(params.value);
    hasChanges.value = false;
    isInitialized.value = true;
  };

  const handleFeaturesLoaded = () => {
    areFeaturesLoaded.value = true;
    initializeChangeTracking();
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

    if (!params.value) {
      console.error('No plan parameters to update');
      return;
    }

    loading.value = true;
    try {
      if (isDraft.value) params.value.status = PlanStatusEnum.ACTIVE;
      const result = await controller.update(params.value, undefined, undefined, false);
      if (!result || !isDataSuccess(result)) return;

      hasChanges.value = false;
      await returnToPlanIndex();
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      loading.value = false;
    }
  };

  const saveDraft = () => {
    if ((controller.itemData.value?.subscribers ?? 0) > 0) {
      warningActionType.value = 'draft';
      warningDialogVisible.value = true;
      return;
    }
    draftDialogVisible.value = true;
  };

  const acknowledgeDraft = async () => {
    draftDialogVisible.value = false;
    if (!params.value) {
      console.error('No plan parameters to update');
      return;
    }

    loading.value = true;
    try {
      params.value.status = PlanStatusEnum.DRAFT;
      const result = await controller.update(params.value, undefined, undefined, false);
      if (!result || !isDataSuccess(result)) return;

      hasChanges.value = false;
      await returnToPlanIndex();
    } catch (error) {
      console.error('Error saving plan draft:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    loading.value = true;
    try {
      await controller.fetchOne(new ShowPlanParams(Number(route.params.id), true));
    } finally {
      loading.value = false;
    }
    isPlanLoaded.value = true;
    await initializeChangeTracking();
  });
</script>

<template>
  <div class="plan-edit-page">
    <PlanForm
      ref="planFormRef"
      :plan="controller.itemData.value!"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
      @validity-change="publishReady = $event"
      @features-loaded="handleFeaturesLoaded"
    />

    <div class="actions">
      <template v-if="hasChanges">
        <button
          class="btn btn-primary publish-button"
          :class="{ 'is-not-ready': !publishReady }"
          type="button"
          :aria-disabled="!publishReady"
          :disabled="loading"
          @click="savePlan"
        >
          <span>{{ $t('publish') }}</span>
        </button>
        <button type="button" class="btn btn-draft" :disabled="loading" @click.prevent="saveDraft">
          {{ $t('save_as_draft') }}
        </button>
      </template>
      <button
        type="button"
        class="btn btn-cancel"
        :disabled="loading"
        @click.prevent="returnToPlanIndex"
      >
        {{ $t('cancel') }}
      </button>
    </div>

    <DraftPlanDialog v-model="draftDialogVisible" @acknowledge="acknowledgeDraft" />
    <PlanDeleteWarningDialog v-model="warningDialogVisible" :action-type="warningActionType" />
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

    button {
      width: 50%;
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  .btn-draft,
  .publish-button,
  .btn-cancel {
    width: min(240px, 50%);
    border-radius: var(--radius-full);
  }

  .btn-draft {
    color: var(--PrimaryColor);
    background-color: var(--PrimaryColor-alpha-10);
    border: 1px solid var(--PrimaryColor-alpha-10);
  }

  @media (max-width: 768px) {
    .actions {
      flex-direction: column;
    }

    .btn-draft,
    .publish-button,
    .btn-cancel {
      width: 100%;
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
