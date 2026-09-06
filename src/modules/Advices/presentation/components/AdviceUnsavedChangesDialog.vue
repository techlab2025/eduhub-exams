<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import discardChangesImage from '@/assets/images/Advices/AdviceDiscardChanges.gif';

  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{
    continue: [];
    discard: [];
  }>();

  const continueEditing = () => {
    visible.value = false;
    emit('continue');
  };

  const discardChanges = () => {
    visible.value = false;
    emit('discard');
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :close-on-escape="false"
    :dismissable-mask="false"
    :pt="{
      root: 'advice-unsaved-dialog-host',
      mask: 'advice-unsaved-dialog-mask',
    }"
  >
    <template #container>
      <section
        class="advice-unsaved-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="advice-unsaved-dialog-title"
        aria-describedby="advice-unsaved-dialog-description"
      >
        <div class="advice-unsaved-dialog__illustration" aria-hidden="true">
          <img :src="discardChangesImage" alt="" />
        </div>

        <div class="advice-unsaved-dialog__copy">
          <h2 id="advice-unsaved-dialog-title">{{ $t('advice_unsaved_dialog.title') }}</h2>
          <p id="advice-unsaved-dialog-description">
            {{ $t('advice_unsaved_dialog.description') }}
          </p>
        </div>

        <footer class="advice-unsaved-dialog__actions">
          <button
            type="button"
            class="advice-unsaved-dialog__continue"
            data-testid="continue-editing"
            @click="continueEditing"
          >
            {{ $t('advice_unsaved_dialog.continue_editing') }}
          </button>
          <button
            type="button"
            class="advice-unsaved-dialog__discard"
            data-testid="discard-changes"
            @click="discardChanges"
          >
            {{ $t('advice_unsaved_dialog.discard_changes') }}
          </button>
        </footer>
      </section>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  :global(.advice-unsaved-dialog-host) {
    width: min(38.5rem, calc(100vw - 2rem));
    overflow: hidden;
    border-radius: 30px;
  }

  :global(.advice-unsaved-dialog-mask) {
    background: var(--black-alpha-40);
  }

  .advice-unsaved-dialog {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    padding: 24px;
    border-radius: 30px;
    background: var(--BgWhite);
    text-align: center;
  }

  .advice-unsaved-dialog__illustration {
    position: relative;
    width: 200px;
    height: 129px;
    flex: none;
    overflow: hidden;

    img {
      position: absolute;
      top: -32px;
      inset-inline-start: 0;
      display: block;
      width: 200px;
      height: 200px;
      object-fit: contain;
    }
  }

  .advice-unsaved-dialog__copy {
    display: grid;
    gap: 10px;
    width: 100%;

    h2,
    p {
      margin: 0;
      font-family: var(--font-family);
    }

    h2 {
      color: var(--standard-black);
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
    }

    p {
      color: var(--SecondText);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .advice-unsaved-dialog__actions {
    display: flex;
    gap: 16px;
    width: 100%;
  }

  .advice-unsaved-dialog__continue,
  .advice-unsaved-dialog__discard {
    flex: 1;
    min-width: 0;
    min-height: 56px;
    padding-inline: 16px;
    border-radius: var(--radius-full);
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--PrimaryColor);
      outline-offset: 2px;
    }
  }

  .advice-unsaved-dialog__continue {
    border: 1px solid var(--PrimaryColor);
    color: var(--BgWhite);
    background: var(--PrimaryColor);
  }

  .advice-unsaved-dialog__discard {
    border: 1px solid var(--gray-200);
    color: var(--standard-black);
    background: var(--gray-100);
  }

  @media (max-width: 520px) {
    .advice-unsaved-dialog {
      gap: 20px;
      padding: 20px;
    }

    .advice-unsaved-dialog__actions {
      flex-direction: column;
    }
  }
</style>
