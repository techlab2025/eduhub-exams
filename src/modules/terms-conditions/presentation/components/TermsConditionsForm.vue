<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import TermsConditionsController from '../controllers/terms-conditions.controller';
  import AddTermsConditionsParams from '../../core/params/add.terms-conditions.params';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import TermsPen from '@/shared/icons/TermsPen.vue';

  const emit = defineEmits(['update:data']);

  const data = ref<Record<string, string>>();

  const updateData = () => {
    emit('update:data', data.value);
  };

  // ─── Init ───────────────────────────────
  onMounted(() => {
    updateData();
  });

  const titleData = ref({
    ar: '',
    en: '',
    fr: '',
  });
  const descriptionData = ref({
    ar: '',
    en: '',
    fr: '',
  });

  const termsConditionsController = TermsConditionsController.getInstance();
  const SubmitData = () => {
    termsConditionsController.create(
      new AddTermsConditionsParams({
        translations: new TranslationParams({
          title: { ar: titleData.value, en: titleData.value, fr: titleData.value },
          description: {
            ar: descriptionData.value,
            en: descriptionData.value,
            fr: descriptionData.value,
          },
        }),
      }),
    );
  };

  const ShowTermsConditions = async () => {
    const result = await termsConditionsController.fetchList();

    if (result instanceof DataSuccess) {
      titleData.value = result.data[0].terms_conditions.title;
      descriptionData.value = result.data[0].terms_conditions.description;
    }
  };

  onMounted(() => {
    ShowTermsConditions();
  });

  onUnmounted(() => {
    data.value = {};
  });
</script>

<template>
  <div class="faq-container">
    <!-- Header -->
    <div class="faq-header">
      <h3>{{ $t(`terms & conditions`) }}</h3>
      <p>{{ $t(`Add or update the terms and conditions of your platform`) }}</p>
    </div>

    <div class="faq-details">
      <p><TermsPen /> {{ $t(`terms & conditions details`) }}</p>
      <h6>{{ $t(`reset`) }}</h6>
    </div>

    <!-- List -->
    <div class="faq-list">
      <!-- Question -->
      <MultiLangInput
        :field-key="`title`"
        :label="` title`"
        :languages="['en', 'ar', 'fr']"
        :model-value="titleData"
        @update:model-value="titleData = $event"
      />
    </div>
    <!-- Description -->
    <div class="faq-list">
      <MultiLangInput
        :field-key="` Description`"
        :label="$t(` Description`)"
        :languages="['en', 'ar']"
        :model-value="descriptionData"
        :type="`description`"
        @update:model-value="descriptionData = $event"
      />
    </div>

    <!-- Add Button -->
    <div class="btn-container">
      <button class="btn btn-primary" @click="SubmitData">{{ $t(`Save`) }}</button>
      <button class="btn btn-cancel">{{ $t(`cancel`) }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .faq-container {
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: 16px;
    padding: 20px;

    .faq-details {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 20px;

      p {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
        font-family: 'medium';
        color: var(--table-header-color);
      }

      h6 {
        font-size: 16px;
        font-weight: 600;
        font-family: 'medium';
        color: var(--danger-color);
        cursor: pointer;
        border-bottom: 3px solid var(--danger-color);
      }
    }

    .btn-container {
      margin-top: 1rem;

      .btn-cancel {
        background-color: var(--background-btn-outline-color);
        color: var(--danger-color);
        border: 1px solid rgba(245, 194, 192, 1);
        border-radius: 50px;
        width: 20%;

        @media (max-width: 768px) {
          width: 50%;
        }
      }

      .btn-primary {
        width: 80%;

        @media (max-width: 768px) {
          width: 50%;
        }
      }
    }

    .faq-list {
      margin: 1rem 0;
    }
  }
</style>
