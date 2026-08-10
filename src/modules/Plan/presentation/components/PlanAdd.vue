<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PlanController from '../controllers/plan.controller';
  import PlanForm from './PlanForm.vue';
  import type AddPlanParams from '../../core/params/add.plan.params';

  const controller = PlanController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddPlanParams | null>(null);
  const loading = ref(false);
  const savePlan = async () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No plan parameters to save');
        return;
      }

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
  const saveDraft = () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No plan parameters to save');
        return;
      }
      localStorage.setItem('plan-draft', JSON.stringify(params.value));
      router.push({ name: 'Plans' });
    } catch (error) {
      console.error('Error saving plan draft:', error);
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="plan-add-page">
    <PlanForm :form-key="formKey" :loading="loading" @update-data="updateData" />

    <div class="actions">
      <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="savePlan">
        <span v-if="loading" class="loader"></span>
        <span v-else>
          {{ $t('save_plan') }}
        </span>
      </button>
      <button type="button" class="btn btn-draft" :disabled="loading" @click="saveDraft">
        {{ $t('save_as_draft') }}
      </button>
      <router-link to="/plans" class="btn btn-cancel">
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

  @keyframes l7 {
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

  .btn-draft {
    background-color: var(--PrimaryColor-alpha-10);
    color: var(--PrimaryColor);
    border: 1px solid var(--PrimaryColor-alpha-10);
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
