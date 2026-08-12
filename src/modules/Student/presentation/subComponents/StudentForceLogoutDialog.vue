<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import BlockImage from '@/assets/images/Student/BlockImage.gif';

  withDefaults(
    defineProps<{
      loading?: boolean;
    }>(),
    { loading: false },
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
    :style="{ width: 'min(32.0625rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <article class="student-force-logout-dialog">
        <div class="student-force-logout-image" aria-hidden="true">
          <img :src="BlockImage" alt="" />
        </div>

        <div class="student-force-logout-copy">
          <h2>{{ $t('force_logout_dialog_title') }}</h2>
          <p>{{ $t('force_logout_dialog_message') }}</p>
        </div>

        <div class="student-force-logout-actions">
          <button
            type="button"
            class="force-logout-button"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ $t('force_logout_dialog_confirm') }}
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
  .student-force-logout-dialog {
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

  .student-force-logout-image {
    width: 141px;
    height: 120px;
    overflow: hidden;

    img {
      width: 141px;
      height: 141px;
      display: block;
      object-fit: cover;
    }
  }

  .student-force-logout-copy {
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
      color: var(--gray-5);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .student-force-logout-actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    button {
      height: 56px;
      padding: 0 16px;
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

  .force-logout-button {
    color: var(--BgWhite);
    background: var(--danger-alt);
    border: 1px solid var(--danger-alt);
  }

  .cancel-button {
    color: var(--standard-black);
    background: var(--background-color-soft-light);
    border: 1px solid var(--input-border-color);
  }

  @media (max-width: 520px) {
    .student-force-logout-actions {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
</style>
