<script setup lang="ts">
  import { ref, watch } from 'vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import FaqsDetailsParams from '../../core/params/faqs.details.params';
  import type FaqsModel from '../../core/models/faqs.model';

  const props = defineProps<{
    faq?: FaqsModel;
  }>();

  const emit = defineEmits<{
    (e: 'updateData', value: FaqsDetailsParams): void;
  }>();

  const question = ref<Record<string, string>>({});
  const answer = ref<Record<string, string>>({});

  watch(
    () => props.faq,
    (faq) => {
      if (faq) {
        question.value = { ...faq.question };
        answer.value = { ...faq.answer };
        emitData();
      }
    },
    { immediate: true },
  );

  const emitData = () => {
    emit('updateData', new FaqsDetailsParams({ question: question.value, answer: answer.value }));
  };

  const reset = () => {
    question.value = {};
    answer.value = {};
    emitData();
  };
</script>

<template>
  <div class="faq-form-card">
    <div class="faq-form-header">
      <div class="form-header-left">
        <span class="form-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="var(--PrimaryColor)" />
            <path
              d="M12 7C10.34 7 9 8.34 9 10H11C11 9.45 11.45 9 12 9C12.55 9 13 9.45 13 10C13 12 10 11.75 10 14H12C12 12.75 15 12.5 15 10C15 8.34 13.66 7 12 7ZM11 15V17H13V15H11Z"
              fill="var(--StandardWhite)"
            />
          </svg>
        </span>
        <span class="form-title">{{ $t('faq_details') }}</span>
      </div>
      <button type="button" class="reset-btn" @click="reset">{{ $t('reset') }}</button>
    </div>

    <div class="faq-form-divider" />

    <div class="faq-form-fields">
      <div class="field-group">
        <MultiLangInput
          field-key="question"
          :label="$t('question')"
          :languages="['en', 'ar']"
          :model-value="question"
          :type="`title`"
          :placeholder="$t('enter_question')"
          @update:model-value="
            question = $event;
            emitData();
          "
        />
      </div>

      <div class="field-group">
        <MultiLangInput
          field-key="answer"
          :label="$t('answer')"
          :languages="['en', 'ar']"
          :model-value="answer"
          :type="`description`"
          :placeholder="$t('enter_answer')"
          @update:model-value="
            answer = $event;
            emitData();
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
