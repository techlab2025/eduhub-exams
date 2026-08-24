<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type EditAdviceParams from '../../core/params/edit.advice.params';
  import ShowAdviceParams from '../../core/params/show.advice.params';
  import AdviceController from '../controllers/advice.controller';
  import AdviceForm from './AdviceForm.vue';

  const controller = AdviceController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const params = ref<EditAdviceParams | null>(null);
  const loading = ref(false);

  const updateData = (updatedParams: EditAdviceParams) => {
    params.value = updatedParams;
  };

  const saveAdvice = async () => {
    if (!params.value) {
      console.error('No advice parameters to update');
      return;
    }

    loading.value = true;
    try {
      const result = await controller.update(params.value);
      if (result?.data || !result?.hasError) {
        await router.push({ name: 'Advices' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error updating advice:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await controller.fetchOne(new ShowAdviceParams({ adviceId: Number(route.params.id) }));
  });
</script>

<template>
  <div class="advice-edit-page">
    <AdviceForm
      :advice="controller.itemData.value!"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
    />
    <div class="actions" :class="{ disabled: loading }">
      <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="saveAdvice">
        <span v-if="loading" class="loader"></span>
        <span v-else>{{ $t('update_advice') }}</span>
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

    &.disabled {
      pointer-events: none;
      opacity: 0.7;
    }
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
