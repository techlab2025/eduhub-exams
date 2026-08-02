<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import ArchiveIcon from '@/assets/images/question/ArchiveIcon.gif';

  const visable = ref();
  defineEmits(['unarchive']);
</script>

<template>
  <button type="button" class="btn btn-primary" @click="visable = true">
    {{ $t('unarchive') }}
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
      <img class="dialog-illustration" :src="ArchiveIcon" alt="" />
      <div class="dialog-message">
        <h2>{{ $t('unarchive_question_dialog.title') }}</h2>
        <p>{{ $t('unarchive_question_dialog.description') }}</p>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-primary" @click="$emit('unarchive')">
          {{ $t('unarchive_question_dialog.confirm') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="visable = false">
          {{ $t('unarchive_question_dialog.cancel') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
