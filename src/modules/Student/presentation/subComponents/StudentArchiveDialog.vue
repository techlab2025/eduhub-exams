<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import ArchiveImage from '@/assets/images/question/ArchiveIcon.gif';

  withDefaults(
    defineProps<{
      loading?: boolean;
      hasActiveSubscription?: boolean;
    }>(),
    { loading: false, hasActiveSubscription: false },
  );

  const emit = defineEmits<{
    confirm: [];
  }>();
  const visible = defineModel<boolean>({ default: false });
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :style="{ width: 'min(37.25rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <article class="student-confirm-dialog student-archive-dialog">
        <div class="student-confirm-image" aria-hidden="true">
          <img :src="ArchiveImage" alt="" />
        </div>

        <div class="student-confirm-copy">
          <h2>{{ $t('archive_student_dialog_title') }}</h2>
          <p v-if="hasActiveSubscription" class="student-active-subscription-warning" role="status">
            {{ $t('student_active_subscription_warning') }}
          </p>
          <p>{{ $t('archive_student_dialog_message') }}</p>
        </div>

        <div class="student-confirm-actions">
          <button
            type="button"
            class="confirm-button archive-button"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ $t('archive_student_dialog_confirm') }}
          </button>
          <button type="button" class="cancel-button" :disabled="loading" @click="visible = false">
            {{ $t('cancel') }}
          </button>
        </div>
      </article>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .student-confirm-dialog {
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
    background: var(--BgWhite);
    border-radius: 30px;
  }

  .student-confirm-image {
    width: 160px;
    height: 132px;
    overflow: hidden;

    img {
      width: 160px;
      height: 160px;
      display: block;
      object-fit: cover;
    }
  }

  .student-confirm-copy {
    width: 100%;
    display: grid;
    justify-items: center;
    gap: 10px;

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
      max-width: 434px;
      color: var(--gray-5);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .student-confirm-actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;

    button {
      height: 56px;
      padding: 0 16px;
      border: 0;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 600;

      &:disabled {
        cursor: wait;
        opacity: 0.65;
      }
    }
  }

  .student-confirm-copy .student-active-subscription-warning {
    width: 100%;
    max-width: none;
    padding: 10px 14px;
    color: var(--warning-dark);
    background: var(--warning-light);
    border: 1px solid var(--warning);
    border-radius: var(--radius-md);
    font-size: 14px;
  }

  .archive-button {
    color: var(--BgWhite);
    background: var(--primary-green);
  }

  .cancel-button {
    color: var(--standard-black);
    background: var(--background-color-soft-light);
  }

  @media (max-width: 520px) {
    .student-confirm-actions {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
</style>
