<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import PlanDeleteWarning from '@/assets/images/PLan/PlanDeleteWarning.gif';

  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{
    confirm: [];
    cancel: [];
  }>();

  const confirmLeave = () => {
    visible.value = false;
    emit('confirm');
  };

  const cancelLeave = () => {
    visible.value = false;
    emit('cancel');
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :close-on-escape="false"
    :dismissable-mask="false"
    :style="{ width: 'min(32rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <div class="unsaved-plan-dialog">
        <img :src="PlanDeleteWarning" width="180" alt="" aria-hidden="true" />
        <div class="dialog-copy">
          <h2>{{ $t('unsaved_plan_dialog.title') }}</h2>
          <p>{{ $t('unsaved_plan_dialog.description') }}</p>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn btn-cancel" @click="cancelLeave">
            {{ $t('unsaved_plan_dialog.cancel') }}
          </button>
          <button type="button" class="btn btn-primary" @click="confirmLeave">
            {{ $t('unsaved_plan_dialog.confirm') }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .unsaved-plan-dialog {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-2);
    text-align: center;
    background: var(--BgWhite);
    border-radius: var(--radius-lg);

    img {
      margin-inline: auto;
    }
  }

  .dialog-copy {
    display: grid;
    gap: var(--xs-size);

    h2,
    p {
      margin: 0;
      font-family: var(--font-family);
    }

    h2 {
      color: var(--Black);
      font-size: 20px;
      font-weight: 600;
    }

    p {
      color: var(--SecondText);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .dialog-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--xs-size);

    button {
      width: 100%;
    }
  }
</style>
