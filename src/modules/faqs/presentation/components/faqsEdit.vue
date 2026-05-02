<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FaqsController from '../controllers/faqs.controller';
import EditFaqsParams from '../../core/params/edit.faqs.params';
import FaqsDetailsParams from '../../core/params/faqs.details.params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
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
  if (state instanceof DataSuccess && Array.isArray(state.data)) {
    currentFaq.value = (state.data as FaqsModel[]).find((f) => f.id === faqId);
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

<style scoped lang="scss">
@use '../../../../styles/variables' as *;
@use '../../../../styles/mixins/flex' as *;

.faqs-edit-page {
  @include flex-column(nowrap, flex-start, flex-start);
  gap: 20px;
  font-family: 'Medium';

  .faqs-header {
    @include flex-column(nowrap, flex-start, flex-start);
    gap: 4px;

    .faqs-title {
      color: #111827;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .faqs-description {
      color: #5d5d5d;
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }
  }

  .form-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 12px;

    .btn-save {
      padding: 14px;
      background-color: #4faf7c;
      color: #fff;
      border: none;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover { background-color: #3d9a6a; }
    }

    .btn-cancel {
      padding: 14px;
      background-color: #fff0f3;
      color: #ef4444;
      border: 1.5px solid #fecaca;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover { background-color: #fee2e2; }
    }
  }

  .error-toast {
    padding: 12px 16px;
    background-color: var(--error-light);
    color: var(--error-dark);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    width: 100%;
  }
}
</style>
