<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import DeleteIcon from '@/shared/icons/DeleteDialogIcons/DeleteIcon.vue';
  import warningImage from '@/assets/images/PLan/PlanDeleteWarning.gif';

  type AdviceCategoryDialogVariant = 'delete-confirm' | 'delete-error';

  const props = withDefaults(
    defineProps<{
      variant: AdviceCategoryDialogVariant;
      message?: string;
      loading?: boolean;
    }>(),
    {
      message: '',
      loading: false,
    },
  );

  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{ confirm: [] }>();
  const { t } = useI18n();

  const isDeleteConfirmation = computed(() => props.variant === 'delete-confirm');
  const title = computed(() =>
    t(
      isDeleteConfirmation.value
        ? 'advice_category_page.dialogs.delete.title'
        : 'advice_category_page.dialogs.delete_error.title',
    ),
  );
  const description = computed(() =>
    props.message.trim()
      ? props.message
      : t(
          isDeleteConfirmation.value
            ? 'advice_category_page.dialogs.delete.description'
            : 'advice_category_page.dialogs.delete_error.description',
        ),
  );

  const close = () => {
    if (!props.loading) visible.value = false;
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :dismissable-mask="!loading"
    :close-on-escape="!loading"
    :pt="{
      root: 'advice-category-feedback-dialog-host',
      mask: 'advice-category-feedback-dialog-mask',
    }"
  >
    <template #container>
      <section
        class="advice-category-feedback-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="advice-category-feedback-title"
        aria-describedby="advice-category-feedback-description"
        :aria-busy="loading"
      >
        <div class="advice-category-feedback-dialog__illustration" aria-hidden="true">
          <DeleteIcon v-if="isDeleteConfirmation" />
          <img v-else :src="warningImage" alt="" />
        </div>

        <div class="advice-category-feedback-dialog__copy">
          <h2 id="advice-category-feedback-title">{{ title }}</h2>
          <p id="advice-category-feedback-description">{{ description }}</p>
        </div>

        <footer class="advice-category-feedback-dialog__actions">
          <button
            v-if="isDeleteConfirmation"
            type="button"
            class="advice-category-feedback-dialog__confirm"
            :disabled="loading"
            data-testid="advice-category-delete-confirm"
            @click="emit('confirm')"
          >
            {{ t('advice_category_page.dialogs.delete.confirm') }}
          </button>
          <button
            type="button"
            class="advice-category-feedback-dialog__cancel"
            :disabled="loading"
            data-testid="advice-category-dialog-cancel"
            @click="close"
          >
            {{ t('cancel') }}
          </button>
        </footer>
      </section>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  :global(.advice-category-feedback-dialog-host) {
    width: min(40rem, calc(100vw - 2rem));
    overflow: hidden;
    border-radius: 24px;
  }

  :global(.advice-category-feedback-dialog-mask) {
    background: var(--black-alpha-40);
  }

  .advice-category-feedback-dialog {
    display: grid;
    justify-items: center;
    gap: 20px;
    width: 100%;
    padding: 28px 20px 20px;
    border-radius: 24px;
    background: var(--BgWhite);
    text-align: center;
  }

  .advice-category-feedback-dialog__illustration {
    display: grid;
    place-items: center;
    width: 150px;
    height: 110px;
    overflow: hidden;

    :deep(svg),
    img {
      display: block;
      width: 150px;
      height: 110px;
      object-fit: contain;
    }

    img {
      transform: scale(1.25);
    }
  }

  .advice-category-feedback-dialog__copy {
    display: grid;
    gap: 8px;
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
      line-height: 1.25;
    }

    p {
      color: var(--title-header-color);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .advice-category-feedback-dialog__actions {
    display: flex;
    gap: 12px;
    width: 100%;
  }

  .advice-category-feedback-dialog__confirm,
  .advice-category-feedback-dialog__cancel {
    flex: 1;
    min-height: 48px;
    padding-inline: 16px;
    border: 1px solid transparent;
    border-radius: var(--radius-full);
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      cursor: wait;
      opacity: 0.65;
    }

    &:focus-visible {
      outline: 2px solid var(--PrimaryColor);
      outline-offset: 2px;
    }
  }

  .advice-category-feedback-dialog__confirm {
    border-color: var(--danger-color);
    color: var(--BgWhite);
    background: var(--danger-color);
  }

  .advice-category-feedback-dialog__cancel {
    border-color: var(--gray-100-std);
    color: var(--standard-black);
    background: var(--gray-100-std);
  }

  @media (max-width: 480px) {
    .advice-category-feedback-dialog__actions {
      flex-direction: column;
    }
  }
</style>
