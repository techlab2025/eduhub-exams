<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PlanController from '../controllers/plan.controller';
  import PlanForm from './PlanForm.vue';
  import type AddPlanParams from '../../core/params/add.plan.params';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';

  const controller = PlanController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddPlanParams | null>(null);
  const planFormRef = ref<{ validate?: () => Promise<boolean> } | null>(null);
  const loading = ref(false);
  const publishReady = ref(false);
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
      if (result?.data) {
        router.push({ name: 'Plans' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddPlanParams) => {
    params.value = updatedParams;
  };

  const router = useRouter();
  const saveDraft = async () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No plan parameters to save');
        return;
      }
      params.value.status = PlanStatusEnum.DRAFT;
      const result = await controller.create(params.value, undefined);
      if (result?.data) {
        router.push({ name: 'Plans' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error saving plan draft:', error);
    } finally {
      loading.value = false;
    }
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
      <button type="button" class="btn btn-draft" :disabled="loading" @click="saveDraft">
        {{ $t('save_as_draft') }}
      </button>
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

  @keyframes l7 {
    to {
      transform: rotate(0.5turn);
    }
  }

  .btn-draft,
  .publish-button {
    border-radius: var(--radius-full);
    width: min(240px, 50%);

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .publish-button.is-not-ready:not(:disabled) {
    opacity: 0.5;
  }

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
