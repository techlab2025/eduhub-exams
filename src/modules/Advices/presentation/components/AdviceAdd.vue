<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type AddAdviceParams from '../../core/params/add.advice.params';
  import AdviceController from '../controllers/advice.controller';
  import AdviceForm from './AdviceForm.vue';

  const controller = AdviceController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const params = ref<AddAdviceParams | null>(null);
  const loading = ref(false);

  const updateData = (updatedParams: AddAdviceParams) => {
    params.value = updatedParams;
  };

  const saveAdvice = async () => {
    if (!params.value) {
      console.error('No advice parameters to save');
      return;
    }

    loading.value = true;
    try {
      const result = await controller.create(params.value);
      if (result?.data || !result?.hasError) {
        await router.push({ name: 'Advices' });
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
      <router-link to="/advices" class="btn btn-cancel">{{ $t('cancel') }}</router-link>
    </div>
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
