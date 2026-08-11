<script setup lang="ts">
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import Saved from '@/assets/images/question/Saved.gif';

  defineProps<{ disabled?: boolean }>();
  const emit = defineEmits<{ confirm: [] }>();
  const visible = ref(false);

  const confirmSave = () => {
    visible.value = false;
    emit('confirm');
  };
</script>

<template>
  <button
    type="button"
    class="btn btn-primary embedded-save"
    :disabled="disabled"
    @click="visible = true"
  >
    {{ $t('save') }}
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :pt="{
      root: 'review-dialog question-action-dialog save-review-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <img class="dialog-illustration" :src="Saved" alt="" />
      <div class="dialog-message">
        <h2>{{ $t('save_question_confirmation.title') }}</h2>
        <p>{{ $t('save_question_confirmation.description') }}</p>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-secondary" @click="visible = false">
          {{ $t('cancel') }}
        </button>
        <button type="button" class="btn btn-primary confirm-save" @click="confirmSave">
          {{ $t('save') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
