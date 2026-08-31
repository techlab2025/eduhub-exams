<script setup lang="ts">
  import { onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import AiArrow from '@/shared/icons/AiArrow.vue';
  import IconWarning from '@/shared/icons/IconWarning.vue';
  import DocumentIndexProgressController from '../controllers/document.index.progress.controller';

  const { t } = useI18n();
  const controller = DocumentIndexProgressController.getInstance();
  const { cancelConfirmationVisible, generationDialogVisible, hasActiveIndexing } = controller;

  onBeforeUnmount(() => controller.reset());
</script>

<template>
  <aside
    v-if="hasActiveIndexing && !generationDialogVisible"
    class="document-index-floating-progress"
    role="status"
    aria-live="polite"
  >
    <strong>{{ t('document_index.ai_indexing') }}</strong>
    <div
      class="document-index-floating-progress__bar"
      role="progressbar"
      :aria-label="t('document_index.indexing_document')"
    >
      <span aria-hidden="true"></span>
    </div>
    <button type="button" @click="controller.openActiveProgress">
      {{ t('document_index.view_progress') }}
    </button>
  </aside>

  <Dialog
    v-model:visible="generationDialogVisible"
    modal
    :closable="false"
    :close-on-escape="false"
    :dismissable-mask="false"
    :show-header="false"
    :pt="{
      root: 'document-index-generation-dialog',
      content: 'document-index-generation-dialog__content',
    }"
  >
    <section class="document-index-generation" role="status" aria-live="polite">
      <button
        class="document-index-generation__minimize"
        type="button"
        :aria-label="t('document_index.minimize_indexing')"
        @click="controller.minimize"
      >
        <AiArrow />
      </button>
      <div class="document-index-generation__brand" aria-hidden="true">
        <span class="document-index-generation__sparkle">✦</span>
        <strong>AI</strong>
      </div>
      <h2>{{ t('document_index.indexing_analysis') }}</h2>
      <p>{{ t('document_index.indexing_background_description') }}</p>
      <div class="document-index-generation__progress-container">
        <div
          class="document-index-generation__progress"
          role="progressbar"
          :aria-label="t('document_index.indexing_document')"
        >
          <span aria-hidden="true"></span>
        </div>
      </div>
      <button
        class="document-index-generation__cancel"
        type="button"
        @click="controller.requestCancel"
      >
        {{ t('document_index.cancel_indexing') }}
      </button>
    </section>
  </Dialog>

  <Dialog
    v-model:visible="cancelConfirmationVisible"
    modal
    :closable="false"
    :close-on-escape="false"
    :dismissable-mask="false"
    :show-header="false"
    :pt="{
      root: 'document-index-cancel-dialog',
      content: 'document-index-cancel-dialog__content',
    }"
  >
    <section class="document-index-cancel" aria-labelledby="document-index-cancel-title">
      <h2 id="document-index-cancel-title">
        {{ t('document_index.cancel_confirmation_title') }}
      </h2>
      <div class="document-index-cancel__warning">
        <IconWarning aria-hidden="true" />
        <p>{{ t('document_index.cancel_confirmation_description') }}</p>
      </div>
      <footer>
        <button
          class="document-index-cancel__confirm"
          type="button"
          @click="controller.confirmCancel"
        >
          {{ t('document_index.cancel') }}
        </button>
        <button class="document-index-cancel__keep" type="button" @click="controller.keepIndexing">
          {{ t('document_index.keep_indexing') }}
        </button>
      </footer>
    </section>
  </Dialog>
</template>

<style scoped lang="scss">
  @use '../styles/document_index_progress';
</style>
