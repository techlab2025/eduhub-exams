<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import { ref } from 'vue';
  import RevisionImage from '@/assets/images/question/Revision.png';
  import EditIcon from '@/shared/icons/Privacy/EditIcon.vue';

  const visable = ref();
  defineEmits(['revision']);

  const note = ref<string>();
</script>

<template>
  <button type="button" class="btn btn-primary" @click="visable = true">
    <EditIcon /> {{ $t('revision_question_dialog.trigger') }}
  </button>
  <Dialog
    v-model:visible="visable"
    modal
    :closable="false"
    :pt="{
      root: 'revision-question-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <div class="dialog-content">
      <div class="dialog-main">
        <div class="dialog-heading">
          <img class="dialog-illustration" :src="RevisionImage" alt="" />
          <div class="dialog-heading-text">
            <h2 class="dialog-title">{{ $t('revision_question_dialog.title') }}</h2>
            <p class="dialog-subtitle">{{ $t('revision_question_dialog.subtitle') }}</p>
          </div>
        </div>
        <div class="input-wrapper">
          <label class="visually-hidden" for="revision-reason">
            {{ $t('revision_question_dialog.reason') }}
          </label>
          <textarea
            id="revision-reason"
            v-model="note"
            :placeholder="$t('revision_question_dialog.placeholder')"
            rows="7"
          ></textarea>
        </div>
      </div>

      <div class="revision-warning">
        <span class="warning-icon" aria-hidden="true">!</span>
        <p>{{ $t('revision_question_dialog.warning') }}</p>
      </div>

      <div class="btns">
        <button type="button" class="btn btn-primary confirm-btn" @click="$emit('revision', note)">
          {{ $t('revision_question_dialog.confirm') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="visable = false">
          {{ $t('revision_question_dialog.cancel') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss">
  .p-dialog.revision-question-dialog {
    border: 1px solid var(--input-border-color);
    border-radius: 32px;
    box-shadow: var(--shadow-xl);
    max-width: calc(100vw - 32px);
    overflow: hidden;
    width: 714px;

    .dialog-header {
      display: none;
    }

    .dialog-body {
      padding: 0;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .dialog-main {
      display: flex;
      flex-direction: column;
      gap: 28px;
      padding: 30px 28px 26px;
    }

    .dialog-heading {
      align-items: center;
      display: flex;
      gap: 16px;
      width: 100%;
    }

    .dialog-illustration {
      display: block;
      flex: 0 0 auto;
      height: 54px;
      object-fit: contain;
      width: 54px;
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
      font-size: 23px;
      font-weight: 700;
      line-height: 1.35;
      margin: 0;
      text-align: start;
    }

    .dialog-subtitle {
      color: var(--title-header-color);
      font-family: var(--font-family);
      font-size: 17px;
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
        min-height: 202px;
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

    .revision-warning {
      align-items: flex-start;
      background-color: var(--warning-light);
      color: var(--btn-gold);
      display: flex;
      gap: 12px;
      padding: 20px 22px;
      width: 100%;

      .warning-icon {
        align-items: center;
        border: 1.5px solid currentColor;
        border-radius: 50%;
        display: inline-flex;
        flex: 0 0 auto;
        font-family: var(--font-family);
        font-size: 12px;
        height: 19px;
        justify-content: center;
        line-height: 1;
        margin-top: 1px;
        width: 19px;
      }

      p {
        color: inherit;
        font-family: var(--font-family);
        font-size: 16px;
        line-height: 1.55;
        margin: 0;
      }
    }

    .btns {
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(0, 7fr) minmax(160px, 3fr);
      padding: 26px 28px;
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
    .p-dialog.revision-question-dialog {
      border-radius: 20px;

      .dialog-header {
        display: none;
      }

      .dialog-main {
        gap: 22px;
        padding: 24px 18px;
      }

      .dialog-heading {
        align-items: flex-start;
        gap: 12px;
      }

      .dialog-illustration {
        height: 46px;
        width: 46px;
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

      .revision-warning {
        padding: 16px 18px;

        p {
          font-size: 14px;
        }
      }

      .btns {
        grid-template-columns: 1fr;
        padding: 20px 18px 24px;

        .btn {
          font-size: 16px;
          min-height: 50px;
        }
      }
    }
  }
</style>
