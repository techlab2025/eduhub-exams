<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import FaqsController from '../controllers/faqs.controller';
  import EditFaqsParams from '../../core/params/edit.faqs.params';
  import type FaqsDetailsParams from '../../core/params/faqs.details.params';
  import type FaqsModel from '../../core/models/faqs.model';
  import FaqsForm from './faqsForm.vue';

  const controller = FaqsController.getInstance();
  const router = useRouter();
  const route = useRoute();

  const countryCode = (route.params?.country_code as string) || '';
  const faqId = Number(route.params.id);

  const currentFaq = ref<FaqsModel | undefined>(undefined);
  const formParams = ref<FaqsDetailsParams | null>(null);
  const isLoaded = ref(false);

  const saveChange = async () => {
    if (!formParams.value || !currentFaq.value?.id) return;
    await controller.update(
      new EditFaqsParams({
        id: currentFaq.value.id,
        question: formParams.value.question,
        answer: formParams.value.answer,
      }),
      undefined,
    );
    router.push(`/${countryCode}/faqs`);
  };

  const cancel = () => {
    router.push(`/${countryCode}/faqs`);
  };

  const updateData = (params: FaqsDetailsParams) => {
    formParams.value = params;
  };

  onMounted(async () => {
    await controller.fetchList();
    const state = controller.listState.value;
    const data = state?.data;
    if (Array.isArray(data)) {
      currentFaq.value = (data as FaqsModel[]).find((f) => f.id === faqId);
    }
    isLoaded.value = true;
  });
</script>

<template>
  <div class="faqs-edit-page">
    <div class="faqs-header">
      <h2 class="faqs-title">{{ $t('faqs') }}</h2>
      <p class="faqs-description">{{ $t('faqs_description') }}</p>
    </div>

    <FaqsForm v-if="isLoaded" :faq="currentFaq" @update-data="updateData" />

    <div v-if="isLoaded" class="form-actions">
      <button class="btn-save" type="button" @click="saveChange">{{ $t('save_change') }}</button>
      <button class="btn-cancel" type="button" @click="cancel">{{ $t('cancel') }}</button>
    </div>

    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>
