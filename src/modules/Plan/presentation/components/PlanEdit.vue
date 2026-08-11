<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PlanController from '../controllers/plan.controller';
  import PlanForm from './PlanForm.vue';
  import EditPlanParams from '../../core/params/edit.plan.params';
  import type AddPlanParams from '../../core/params/add.plan.params';
  import ShowPlanParams from '../../core/params/show.plan.params';

  const controller = PlanController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const params = ref<EditPlanParams | null>(null);
  const planFormRef = ref<{ validate?: () => Promise<boolean> } | null>(null);
  const loading = ref(false);

  const updateData = (updatedParams: AddPlanParams | EditPlanParams) => {
    if (updatedParams instanceof EditPlanParams) params.value = updatedParams;
  };

  const savePlan = async () => {
    const isValid = await planFormRef.value?.validate?.();
    if (isValid === false) return;

    if (!params.value) {
      console.error('No plan parameters to update');
      return;
    }

    loading.value = true;
    try {
      const result = await controller.update(params.value, undefined, false);
      if (result?.data || !result?.hasError) {
        await router.push({ name: 'Plans' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error updating plan:', error);
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
    />

    <div class="actions" :class="{ disabled: loading }">
      <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="savePlan">
        <span v-if="loading" class="loader"></span>
        <span v-else>{{ $t('update_plan') }}</span>
      </button>
      <router-link to="/plans" class="btn btn-cancel">{{ $t('cancel') }}</router-link>
    </div>
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
