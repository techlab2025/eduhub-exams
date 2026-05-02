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
      <button class="btn-save" type="button" @click="save">{{ $t('save') }}</button>
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

  .faqs-add-page {
    @include flex-column(nowrap, flex-start, flex-start);

    gap: 20px;
    font-family: 'Medium';

    .faqs-header {
      @include flex-column(nowrap, flex-start, flex-start);

      gap: 4px;

      .faqs-title {
        color: $BgBlack;
        font-size: 24px;
        font-weight: 700;
        margin: 0;
      }

      .faqs-description {
        color: $Gray-5;
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
        background-color: $PrimaryColor;
        color: $StandardWhite;
        border: none;
        border-radius: 50px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: $PrimaryColorHover;
        }
      }

      .btn-cancel {
        padding: 14px;
        background-color: $DangerLightAlt;
        color: $Red;
        border: 1.5px solid $DangerBorderLight;
        border-radius: 50px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: $BgRed;
        }
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
