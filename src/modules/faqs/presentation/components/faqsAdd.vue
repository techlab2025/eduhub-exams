<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import FaqsController from '../controllers/faqs.controller';
  import AddFaqsParams from '../../core/params/add.faqs.params';
  import FaqsForm from './faqsForm.vue';

  const controller = FaqsController.getInstance();
  const router = useRouter();
  const route = useRoute();
  const countryCode = (route.params?.country_code as string) || '';

  const formParams = ref<AddFaqsParams | null>(null);
  const loading = ref(false);

  const save = async () => {
    if (!formParams.value) return;
    loading.value = true;
    try {
      await controller.create(formParams.value);
    } finally {
      loading.value = false;
    }
  };

  const cancel = () => {
    router.push(`/${countryCode}/faqs`);
  };

  const updateData = (params: AddFaqsParams) => {
    formParams.value = params;
  };
</script>

<template>
  <div class="faqs-add-page">
    <div class="faqs-header">
      <h2 class="faqs-title">{{ $t('faqs') }}</h2>
      <p class="faqs-description">{{ $t('faqs_description') }}</p>
    </div>

    <FaqsForm :loading="loading" @update-data="updateData" />

    <div class="form-actions" :class="{ disabled: loading }">
      <button class="btn btn-primary" type="button" @click="save">{{ $t('save') }}</button>
      <button class="btn btn-cancel" type="button" @click="cancel">{{ $t('cancel') }}</button>
    </div>

    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .form-actions {
    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.7;
    }
  }
</style>
