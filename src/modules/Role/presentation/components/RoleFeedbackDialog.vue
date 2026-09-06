<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import warningImage from '@/assets/images/PLan/PlanDeleteWarning.gif';

  type RoleFeedbackDialogVariant =
    | 'delete-confirm'
    | 'delete-error'
    | 'title-required'
    | 'duplicate-title'
    | 'permissions-required'
    | 'save-error';

  const props = withDefaults(
    defineProps<{
      variant: RoleFeedbackDialogVariant;
      message?: string;
      count?: number;
      loading?: boolean;
    }>(),
    {
      message: '',
      count: 1,
      loading: false,
    },
  );

  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{ confirm: [] }>();
  const { t } = useI18n();

  const dialogConfig = computed(() => {
    const configs = {
      'delete-confirm': {
        title: props.count > 1 ? 'role.dialogs.delete_many.title' : 'role.dialogs.delete.title',
        message:
          props.count > 1 ? 'role.dialogs.delete_many.message' : 'role.dialogs.delete.message',
        confirm: 'role.dialogs.delete.confirm',
      },
      'delete-error': {
        title: 'role.dialogs.delete_error.title',
        message: 'role.dialogs.delete_error.message',
      },
      'title-required': {
        title: 'role.dialogs.title_required.title',
        message: 'role.dialogs.title_required.message',
      },
      'duplicate-title': {
        title: 'role.dialogs.duplicate_title.title',
        message: 'role.dialogs.duplicate_title.message',
      },
      'permissions-required': {
        title: 'role.dialogs.permissions_required.title',
        message: 'role.dialogs.permissions_required.message',
      },
      'save-error': {
        title: 'role.dialogs.save_error.title',
        message: 'role.dialogs.save_error.message',
      },
    } as const;

    return configs[props.variant];
  });

  const displayMessage = computed(() =>
    props.message.trim() ? props.message : t(dialogConfig.value.message, { count: props.count }),
  );
  const canConfirm = computed(() => props.variant === 'delete-confirm');
  const confirmLabel = computed(() =>
    'confirm' in dialogConfig.value ? t(dialogConfig.value.confirm) : '',
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
      root: 'role-feedback-dialog-host',
      mask: 'role-feedback-dialog-mask',
    }"
  >
    <template #container>
      <section
        class="role-feedback-dialog"
        :aria-busy="loading"
        :aria-live="canConfirm ? 'polite' : 'assertive'"
      >
        <div class="role-feedback-dialog__illustration" aria-hidden="true">
          <img :src="warningImage" alt="" />
        </div>

        <div class="role-feedback-dialog__copy">
          <h2>{{ t(dialogConfig.title) }}</h2>
          <p>{{ displayMessage }}</p>
        </div>

        <footer class="role-feedback-dialog__actions">
          <button
            v-if="canConfirm"
            type="button"
            class="role-feedback-dialog__confirm"
            :disabled="loading"
            data-testid="role-dialog-confirm"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
          <button
            type="button"
            class="role-feedback-dialog__cancel"
            :disabled="loading"
            data-testid="role-dialog-cancel"
            @click="close"
          >
            {{ t('role.dialogs.cancel') }}
          </button>
        </footer>
      </section>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  :global(.role-feedback-dialog-host) {
    width: min(32rem, calc(100vw - 2rem));
    overflow: hidden;
    border-radius: 22px;
  }

  :global(.role-feedback-dialog-mask) {
    background: var(--black-alpha-40);
  }

  .role-feedback-dialog {
    display: grid;
    justify-items: center;
    gap: 22px;
    width: 100%;
    padding: 28px 18px 16px;
    border-radius: 22px;
    background: var(--BgWhite);
    text-align: center;
  }

  .role-feedback-dialog__illustration {
    display: grid;
    place-items: center;
    width: 116px;
    height: 96px;
    overflow: hidden;

    img {
      display: block;
      width: 132px;
      height: 132px;
      object-fit: contain;
    }
  }

  .role-feedback-dialog__copy {
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
      font-weight: 600;
      line-height: 1.25;
    }

    p {
      color: var(--title-header-color);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .role-feedback-dialog__actions {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .role-feedback-dialog__confirm,
  .role-feedback-dialog__cancel {
    flex: 1;
    min-height: 48px;
    padding-inline: 16px;
    border: 0;
    border-radius: var(--radius-full);
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      cursor: wait;
      opacity: 0.65;
    }
  }

  .role-feedback-dialog__confirm {
    color: var(--BgWhite);
    background: var(--danger-color);
  }

  .role-feedback-dialog__cancel {
    color: var(--standard-black);
    background: var(--gray-100-std);
  }

  @media (max-width: 480px) {
    .role-feedback-dialog {
      gap: 18px;
      padding: 24px 14px 14px;
    }

    .role-feedback-dialog__copy h2 {
      font-size: 18px;
    }
  }
</style>
