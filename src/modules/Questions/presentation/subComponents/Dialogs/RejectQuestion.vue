<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import RejectReason from '@/assets/images/question/Reject_Resone.png';
  import RejectIcon from '@/shared/icons/Question/RejectIcon.vue';

  const visable = ref();
  const emit = defineEmits(['reject']);

  const note = ref<string>();

  const SaveNote = () => {
    if (!note.value) {
      return;
    }
    emit('reject', note.value);
    visable.value = false;
  };
</script>

<template>
  <button type="button" class="btn btn-cancel reject-question-trigger" @click="visable = true">
    <RejectIcon />
    {{ $t('reject_question_dialog.trigger') }}
  </button>
  <Dialog
    v-model:visible="visable"
    modal
    :closable="false"
    :pt="{
      root: ' reject-question-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <div class="dialog-heading">
        <img class="dialog-illustration" :src="RejectReason" alt="" />
        <div class="dialog-heading-text">
          <h2 class="dialog-title">{{ $t('reject_question_dialog.title') }}</h2>
          <p class="dialog-subtitle">{{ $t('reject_question_dialog.subtitle') }}</p>
        </div>
      </div>
      <div class="input-wrapper">
        <label class="visually-hidden" for="reason">
          {{ $t('reject_question_dialog.reason') }}
        </label>
        <textarea
          id="reason"
          v-model="note"
          :placeholder="$t('reject_question_dialog.placeholder')"
          rows="7"
        ></textarea>
      </div>
      <div class="btns">
        <button type="button" class="btn btn-primary confirm-btn" @click="SaveNote">
          {{ $t('reject_question_dialog.confirm') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="visable = false">
          {{ $t('reject_question_dialog.cancel') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss">
  .reject-question-trigger {
    align-items: center;
    display: inline-flex;
    gap: 8px;
    justify-content: center;
  }

  .p-dialog.reject-question-dialog {
    border: 1px solid var(--input-border-color);
    border-radius: 24px;
    box-shadow: var(--shadow-xl);
    max-width: calc(100vw - 32px);
    overflow: hidden;
    width: 756px;

    .dialog-header {
      display: none;
    }

    .dialog-body {
      padding: 30px;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 28px;
      width: 100%;
    }

    .dialog-heading {
      align-items: center;
      display: flex;
      gap: 18px;
      width: 100%;
    }

    .dialog-illustration {
      display: block;
      flex: 0 0 auto;
      height: 50px !important;
      object-fit: contain;
      width: 50px !important;
    }

    .dialog-heading-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .dialog-title {
      color: var(--title-card-color);
      font-family: var(--font-family);
      font-size: 24px;
      font-weight: 700;
      line-height: 1.35;
      margin: 0;
      text-align: start;
    }

    .dialog-subtitle {
      color: var(--title-header-color);
      font-family: var(--font-family);
      font-size: 18px;
      line-height: 1.4;
      margin: 0;
      text-align: start;
    }

    .input-wrapper {
      width: 100%;

      .visually-hidden {
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      textarea {
        background-color: var(--bg-main);
        border: 1px solid var(--input-border-color);
        border-radius: 32px;
        color: var(--title-card-color);
        font-family: var(--font-family);
        font-size: 16px;
        min-height: 214px;
        outline: none;
        padding: 20px 36px;
        resize: vertical;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
        width: 100%;

        &::placeholder {
          color: var(--bread-crumb-color-span);
        }

        &:focus {
          border-color: var(--PrimaryColor);
          box-shadow: 0 0 0 3px var(--PrimaryColor-alpha-10);
        }
      }
    }

    .btns {
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(0, 7fr) minmax(160px, 3fr);
      width: 100%;

      .btn {
        border-radius: 999px;
        font-size: 18px;
        font-weight: 600;
        justify-content: center;
        min-height: 56px;
        width: 100% !important;
      }
    }
  }

  @media (max-width: 520px) {
    .p-dialog.reject-question-dialog {
      border-radius: 20px;

      .dialog-header {
        display: none;
      }

      .dialog-body {
        padding: 24px 18px;
      }

      .dialog-content {
        gap: 22px;
      }

      .dialog-heading {
        align-items: flex-start;
        gap: 12px;
      }

      .dialog-illustration {
        height: 54px;
        width: 38px;
      }

      .dialog-title {
        font-size: 19px;
      }

      .dialog-subtitle {
        font-size: 14px;
      }

      .input-wrapper textarea {
        border-radius: 24px;
        min-height: 180px;
        padding: 18px 20px;
      }

      .btns {
        grid-template-columns: 1fr;

        .btn {
          font-size: 16px;
          min-height: 50px;
        }
      }
    }
  }
</style>
