<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import DraftDialogIcon from '@/assets/images/PLan/DraftDialogIcon.gif';

  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{ acknowledge: [] }>();
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :close-on-escape="true"
    :dismissable-mask="true"
    :style="{ width: 'min(21.75rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <div class="draft-plan-dialog" role="status" aria-live="polite">
        <img :src="DraftDialogIcon" alt="" aria-hidden="true" />
        <div class="draft-dialog-copy">
          <h2>{{ $t('draft_added_title') }}</h2>
          <p>{{ $t('draft_added_message') }}</p>
        </div>
        <button type="button" class="btn btn-primary" @click="emit('acknowledge')">
          {{ $t('draft_added_acknowledge') }}
        </button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .draft-plan-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 24px;
    border-radius: 30px;
    background: var(--standard-white);
    text-align: center;

    img {
      width: 170px;
      height: 136px;
      object-fit: contain;
    }

    .btn {
      width: min(244px, 100%);
      height: 46px;
      margin: 0;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 600;
    }
  }

  .draft-dialog-copy {
    display: grid;
    gap: 10px;

    h2,
    p {
      margin: 0;
      font-family: 'Demi';
    }

    h2 {
      color: var(--standard-black);
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
    }

    p {
      color: var(--title-header-color);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
    }
  }
</style>
