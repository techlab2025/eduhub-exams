<script setup lang="ts">
  import Dialog from 'primevue/dialog';

  defineProps<{ loading?: boolean }>();
  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{ confirm: [] }>();
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="!loading"
    :style="{ width: 'min(32rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <div class="plan-status-dialog">
        <h3>{{ $t('confirm_archive_plan_title') }}</h3>
        <p>{{ $t('confirm_archive_plan_message') }}</p>
        <div class="dialog-actions">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ $t('archive') }}
          </button>
          <button type="button" class="btn btn-cancel" :disabled="loading" @click="visible = false">
            {{ $t('cancel') }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .plan-status-dialog {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-2);
    text-align: center;
    background: var(--BgWhite);
    border-radius: var(--radius-lg);

    h3,
    p {
      margin: 0;
      font-family: 'Demi' !important;
    }

    h3 {
      color: #121212;
      font-size: 20px;
      font-weight: 600;
    }
    p {
      color: #5d5d5d;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .dialog-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--xs-size);
  }
  button {
    width: 100% !important;
  }
</style>
