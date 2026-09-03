<script setup lang="ts">
  import { computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import IconWarning from '@/shared/icons/IconWarning.vue';
  import deleteImage from '@/assets/images/question/CancelQuestion.gif';
  import activateImage from '@/assets/images/question/Approve.gif';
  import deactivateImage from '@/assets/images/question/ArchiveIcon.gif';
  import successImage from '@/assets/images/question/Saved.gif';
  import duplicateImage from '@/assets/images/PLan/PlanDeleteWarning.gif';

  type NotificationPlanDialogVariant =
    | 'delete'
    | 'activate'
    | 'deactivate'
    | 'success'
    | 'duplicate';

  const props = withDefaults(
    defineProps<{
      variant: NotificationPlanDialogVariant;
      loading?: boolean;
    }>(),
    { loading: false },
  );
  const visible = defineModel<boolean>({ default: false });
  const emit = defineEmits<{ confirm: []; cancel: [] }>();

  const dialogConfig = computed(() => {
    const configs = {
      delete: {
        image: deleteImage,
        title: 'notification_plan.dialogs.delete.title',
        message: 'notification_plan.dialogs.delete.message',
        confirm: 'notification_plan.dialogs.delete.confirm',
      },
      activate: {
        image: activateImage,
        title: 'notification_plan.dialogs.activate.title',
        message: 'notification_plan.dialogs.activate.message',
        confirm: 'notification_plan.dialogs.confirm',
      },
      deactivate: {
        image: deactivateImage,
        title: 'notification_plan.dialogs.deactivate.title',
        message: 'notification_plan.dialogs.deactivate.message',
        confirm: 'notification_plan.dialogs.confirm',
      },
      success: {
        image: successImage,
        title: 'notification_plan.dialogs.success.title',
        message: 'notification_plan.dialogs.success.message',
        confirm: 'notification_plan.dialogs.success.confirm',
      },
      duplicate: {
        image: duplicateImage,
        title: 'notification_plan.dialogs.duplicate.title',
        message: 'notification_plan.dialogs.duplicate.message',
        confirm: 'notification_plan.dialogs.duplicate.confirm',
      },
    } as const;

    return configs[props.variant];
  });

  const close = () => {
    if (props.loading) return;
    visible.value = false;
    emit('cancel');
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
      root: `notification-plan-dialog-host notification-plan-dialog-host--${variant}`,
      mask: 'notification-plan-dialog-mask',
    }"
  >
    <template #container>
      <article
        class="notification-plan-dialog"
        :class="`notification-plan-dialog--${variant}`"
        role="document"
      >
        <img class="notification-plan-dialog__image" :src="dialogConfig.image" alt="" />
        <h2>{{ $t(dialogConfig.title) }}</h2>
        <p v-if="variant !== 'delete'">{{ $t(dialogConfig.message) }}</p>

        <aside v-if="variant === 'delete'" class="notification-plan-dialog__warning">
          <IconWarning aria-hidden="true" />
          <span>{{ $t('notification_plan.dialogs.delete.warning') }}</span>
        </aside>

        <footer class="notification-plan-dialog__actions">
          <button
            type="button"
            class="btn notification-plan-dialog__confirm"
            :class="{ 'is-danger': variant === 'delete', 'is-outline': variant === 'duplicate' }"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ $t(dialogConfig.confirm) }}
          </button>
          <button
            v-if="variant !== 'success'"
            type="button"
            class="btn notification-plan-dialog__cancel"
            :disabled="loading"
            @click="close"
          >
            {{ $t('notification_plan.dialogs.cancel') }}
          </button>
        </footer>
      </article>
    </template>
  </Dialog>
</template>
