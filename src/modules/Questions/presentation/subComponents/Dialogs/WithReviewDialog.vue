<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import Saved from '@/assets/images/question/Saved.gif';
  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  type SaveStatusEnum = (typeof SaveStatusEnum)[keyof typeof SaveStatusEnum];

  const visable = ref();
  defineEmits(['with-review', 'without-review']);
  const { saveStatus } = defineProps<{
    saveStatus: SaveStatusEnum;
  }>();
</script>

<template>
  <button @click="visable = true" class="btn btn-primary">
    {{ saveStatus == SaveStatusEnum.Save ? $t('save') : $t(`Save & New`) }}
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
      <img :src="Saved" alt="" />
      <h2>Would you like to confirm saving the question or send it for review?</h2>
      <p>
        You can submit the question for review by artificial intelligence or a specialist, or
        proceed without review.
      </p>
      <div class="btns">
        <button class="btn btn-primary" @click="$emit('without-review')">
          save without review
        </button>
        <button class="btn btn-secondary" @click="$emit('with-review')">save with review</button>
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
