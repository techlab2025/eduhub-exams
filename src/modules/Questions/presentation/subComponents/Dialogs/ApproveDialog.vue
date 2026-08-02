<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import Approve from '@/assets/images/question/Approve.gif';
  import AgreeIcon from '@/shared/icons/Question/AgreeIcon.vue';

  const visable = ref();
  defineEmits(['approve']);
</script>

<template>
  <button type="button" class="btn btn-primary" @click="visable = true">
    <AgreeIcon />
    {{ $t('approve_question') }}
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
      <img class="dialog-illustration" :src="Approve" alt="" />
      <div class="dialog-message">
        <h2>{{ $t('approve_question_dialog.title') }}</h2>
        <p>{{ $t('approve_question_dialog.description') }}</p>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-primary" @click="$emit('approve')">
          {{ $t('approve_question_dialog.confirm') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="visable = false">
          {{ $t('approve_question_dialog.cancel') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
