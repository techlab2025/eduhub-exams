<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import CancelQuestion from '@/assets/images/question/CancelQuestion.gif';

  const visable = ref();
  defineEmits(['cancel' , "not-cancel"]);
</script>

<template>
  <button @click="visable = true" class="btn btn-cancel">
    {{ $t('cancel') }}
  </button>
  <Dialog
    v-model:visible="visable"
    modal
    :style="{ width: '35rem' }"
    :pt="{
      root: 'review-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <img :src="CancelQuestion" alt="" />
      <h2>Are you sure you want to remove this  question ?</h2>
      <p>This will permanently remove the question.</p>
      <div class="btns">
        <button class="btn btn-cancel" @click="$emit('cancel')">Yes, delete it</button>
        <button class="btn btn-secondary" @click="visable = false">cancel</button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
  .btn-primary {
    width: 60%;
  }
  .error-message-inputs {
    color: red;
    font-family: 'medium';
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .document-type-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background-color: var(--color-light-gray);
  }

  .item-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .item-small-title {
    font-size: 0.7rem;
    color: var(--bread-crumb-color-span);
  }

  .item-main-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: black;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .field-input {
    background-color: var(--bg-main);
    border-radius: 30px;
    margin: 0 !important;

    ::placeholder {
      color: var(--bread-crumb-color-span);
    }
  }

  .dialog-inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 15px;

    .field-group {
      &:first-child {
        width: 60%;
      }

      &:last-child {
        width: 40%;
      }
    }
  }

  .dialog-footer {
    display: flex;
    gap: 0.5rem;
  }
</style>
