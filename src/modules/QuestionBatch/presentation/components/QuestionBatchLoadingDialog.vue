<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { useI18n } from 'vue-i18n';

  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{ cancel: [] }>();
  const { t } = useI18n();
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :close-on-escape="false"
    :dismissable-mask="false"
    :show-header="false"
    :pt="{
      root: 'question-batch-loading-dialog',
      content: 'question-batch-loading-dialog__content',
    }"
  >
    <div class="question-batch-loading" role="status" aria-live="polite">
      <div class="question-batch-loading__brand" aria-hidden="true">
        <span>✦</span><strong>AI</strong>
      </div>
      <h2>{{ t('question_batch.generating') }}</h2>
      <p>{{ t('question_batch.generating_description') }}</p>
      <div class="question-batch-loading__progress" aria-hidden="true"><span></span></div>
      <button type="button" @click="emit('cancel')">
        {{ t('question_batch.cancel_generation') }}
      </button>
    </div>
  </Dialog>
</template>
