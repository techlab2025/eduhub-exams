<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import Cancel from '@/assets/images/question/Cancel.gif';

  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{
    discard: [];
    stay: [];
  }>();

  const discardChanges = () => {
    visible.value = false;
    emit('discard');
  };

  const stayOnPage = () => {
    visible.value = false;
    emit('stay');
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :dismissable-mask="false"
    :pt="{
      root: 'review-dialog question-action-dialog cancel-question-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <img class="dialog-illustration" :src="Cancel" alt="" />
      <div class="dialog-message">
        <h2>{{ $t('unsaved_question_dialog.title') }}</h2>
        <p>{{ $t('unsaved_question_dialog.description') }}</p>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-cancel confirm-btn" @click="discardChanges">
          {{ $t('unsaved_question_dialog.discard') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="stayOnPage">
          {{ $t('unsaved_question_dialog.stay') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
