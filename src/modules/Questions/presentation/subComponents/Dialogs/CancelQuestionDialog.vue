<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import Cancel from '@/assets/images/question/Cancel.gif';

  const visable = ref();
  defineEmits(['cancel', 'not-cancel']);
</script>

<template>
  <button type="button" class="btn btn-cancel" @click="visable = true">
    {{ $t('cancel') }}
  </button>
  <Dialog
    v-model:visible="visable"
    modal
    :pt="{
      root: 'review-dialog question-action-dialog cancel-question-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <img class="dialog-illustration" :src="Cancel" alt="" />
      <div class="dialog-message">
        <h2>{{ $t('cancel_question_dialog.title') }}</h2>
        <p>{{ $t('cancel_question_dialog.description') }}</p>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-cancel confirm-btn" @click="$emit('cancel')">
          {{ $t('cancel_question_dialog.confirm') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="visable = false">
          {{ $t('cancel_question_dialog.cancel') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
