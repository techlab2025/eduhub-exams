<script setup lang="ts">
  import { ref, watch } from 'vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import FaqsDetailsParams from '../../core/params/faqs.details.params';
  import type FaqsModel from '../../core/models/faqs.model';
  import FaqDetailsIcon from '@/shared/icons/faqs/FaqDetailsIcon.vue';

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
        <FaqDetailsIcon />
        <span class="form-title">{{ $t('faq_details') }}</span>
      </div>
      <button type="button" class="reset-btn" @click="reset">{{ $t('reset') }}</button>
    </div>

    <div class="faq-form-fields">
      <div class="field-group">
        <MultiLangInput
          field-key="question"
          :label="$t('question')"
          :languages="['en', 'ar']"
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
