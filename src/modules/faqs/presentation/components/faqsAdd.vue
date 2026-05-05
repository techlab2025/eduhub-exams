<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import FaqsController from '../controllers/faqs.controller';
  import AddFaqsParams from '../../core/params/add.faqs.params';
  import type FaqsDetailsParams from '../../core/params/faqs.details.params';
  import FaqsForm from './faqsForm.vue';

  const controller = FaqsController.getInstance();
  const router = useRouter();
  const route = useRoute();
  const countryCode = (route.params?.country_code as string) || '';

  const formParams = ref<FaqsDetailsParams | null>(null);

  const save = async () => {
    if (!formParams.value) return;
    await controller.create(new AddFaqsParams({ faqs: [formParams.value] }), undefined);
  };

  const cancel = () => {
    router.push(`/${countryCode}/faqs`);
  };

  const updateData = (params: FaqsDetailsParams) => {
    formParams.value = params;
  };
</script>

<template>
  <div class="faqs-add-page">
    <div class="faqs-header">
      <h2 class="faqs-title">{{ $t('faqs') }}</h2>
      <p class="faqs-description">{{ $t('faqs_description') }}</p>
    </div>

    <FaqsForm @update-data="updateData" />

    <div class="form-actions">
      <button class="btn btn-primary" type="button" @click="save">{{ $t('save') }}</button>
      <button class="btn btn-cancel" type="button" @click="cancel">{{ $t('cancel') }}</button>
    </div>

    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>
