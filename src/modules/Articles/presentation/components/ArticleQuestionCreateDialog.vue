<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import QuestionsAdd from '@/modules/Questions/presentation/components/questionsAdd.vue';

  defineProps<{
    articleId: number;
    subjectId?: number;
    sequenceId?: number;
  }>();
  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{ saved: [] }>();

  const handleSaved = () => {
    visible.value = false;
    emit('saved');
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    class="article-question-create-dialog"
    :style="{ width: 'min(1180px, 96vw)' }"
    :content-style="{ maxHeight: '82vh', overflowY: 'auto' }"
  >
    <template #header>
      <div class="question-dialog-header">
        <div class="question-dialog-icon" aria-hidden="true">+</div>
        <div class="question-dialog-heading">
          <span class="question-dialog-eyebrow">{{ $t('question_management_step') }}</span>
          <h2>{{ $t('article_questions_dialog_title') }}</h2>
          <p>{{ $t('article_questions_dialog_description') }}</p>
        </div>
        <div class="article-context-badge">
          <span>{{ $t('article') }}</span>
          <strong>#{{ articleId }}</strong>
        </div>
      </div>
    </template>

    <div class="question-dialog-body">
      <div class="question-dialog-tip">
        <span aria-hidden="true">+</span>
        <span>{{ $t('article_questions_dialog_tip') }}</span>
      </div>

      <QuestionsAdd
        v-if="visible"
        class="dialog-question-form"
        embedded
        :article-id="articleId"
        :subject-id="subjectId"
        :sequence-id="sequenceId"
        @saved="handleSaved"
        @close="visible = false"
      />
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
  :global(.article-question-create-dialog) {
    overflow: hidden;
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 8px;
    background: var(--gray-50);
    box-shadow: var(--shadow-xl);
  }

  :global(.article-question-create-dialog .p-dialog-header) {
    padding: 24px 28px;
    border-bottom: 1px solid var(--PrimaryColor-alpha-10);
    background: var(--BgWhite);
  }

  :global(.article-question-create-dialog .p-dialog-content) {
    padding: 0;
    background: var(--gray-50);
  }

  .question-dialog-header {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
  }

  .question-dialog-icon {
    width: 58px;
    height: 58px;
    border-radius: 8px;
    background: var(--primary-green);
    color: var(--BgWhite);
    display: grid;
    place-items: center;
    font-size: 30px;
    box-shadow: var(--shadow-md);
  }

  .question-dialog-heading {
    min-width: 0;

    h2,
    p {
      margin: 0;
    }

    h2 {
      margin-block: 2px 4px;
      color: var(--title-header-color);
      font-size: 22px;
    }

    p {
      color: var(--SecondText);
      font-size: 14px;
    }
  }

  .question-dialog-eyebrow {
    color: var(--primary-green);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .article-context-badge,
  .question-dialog-tip {
    border: 1px solid var(--PrimaryColor-alpha-10);
    background: var(--BgWhite);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .article-context-badge {
    padding: 8px 14px;
    border-radius: 8px;
    color: var(--primary-green);
  }

  .question-dialog-body {
    padding: 18px 22px 22px;
  }

  .question-dialog-tip {
    margin-bottom: 14px;
    padding: 10px 14px;
    border-radius: 8px;
    color: var(--SecondText);
    font-size: 14px;
  }

  :deep(.dialog-question-form) {
    overflow: hidden;
    border-radius: 8px;
    background: var(--BgWhite);
    box-shadow: var(--shadow-sm);
    padding: 12px;

    > .questions-details-form-card {
      margin: 0;
      border: 0;
      box-shadow: none;

      > .form-header {
        display: none;
      }
    }

    > .actions {
      position: sticky;
      z-index: 3;
      bottom: 0;
      margin: 0;
      padding: 16px 20px;
      border-top: 1px solid var(--input-border-color);
      background: var(--BgWhite);
      box-shadow: 0 -8px 20px var(--PrimaryColor-alpha-10);
    }
  }

  @media (max-width: 640px) {
    .question-dialog-header {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .article-context-badge {
      display: none;
    }

    .question-dialog-body {
      padding: 12px;
    }
  }
</style>
