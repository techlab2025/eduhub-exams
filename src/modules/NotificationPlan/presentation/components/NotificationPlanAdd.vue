<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import { ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
  import NotificationPlanController from '../controllers/notification.plan.controller';
  import NotificationPlanForm from './NotificationPlanForm.vue';
  import NotificationPlanDialog from './NotificationPlanDialog.vue';
  import type AddNotificationPlanParams from '../../core/params/add.notification.plan.params';

  const router = useRouter();
  const { t } = useI18n();
  const controller = NotificationPlanController.getInstance();
  const formRef = ref<InstanceType<typeof NotificationPlanForm>>();
  const params = ref<AddNotificationPlanParams>();
  const loading = ref(false);
  const successDialogVisible = ref(false);
  const duplicateDialogVisible = ref(false);

  const isDuplicateError = (message: string, errorType?: number) =>
    errorType === ErrorType.conflict || /already|exist|duplicate/i.test(message);

  const save = async () => {
    if (!params.value || !formRef.value?.validate()) {
      dialogManager.toastWarning(t('notification_plan.form.complete_required'));
      return;
    }
    loading.value = true;
    try {
      const result = await controller.create(params.value);
      if (!result) return;
      if (result.hasError) {
        if (isDuplicateError(result.error?.displayMessage ?? '', result.error?.type)) {
          duplicateDialogVisible.value = true;
        }
        return;
      }
      successDialogVisible.value = true;
    } finally {
      loading.value = false;
    }
  };

  const goToIndex = async () => {
    successDialogVisible.value = false;
    duplicateDialogVisible.value = false;
    await router.push({ name: 'Notification Plans' });
  };
</script>

<template>
  <section class="notification-plan-editor">
    <NotificationPlanForm
      ref="formRef"
      :loading="loading"
      @update-data="params = $event as AddNotificationPlanParams"
    />
    <footer class="notification-plan-editor__actions">
      <button class="btn btn-primary" type="button" :disabled="loading" @click="save">
        {{ $t('notification_plan.form.save') }}
      </button>
      <button
        class="btn btn-cancel"
        type="button"
        :disabled="loading"
        @click="router.push({ name: 'Notification Plans' })"
      >
        {{ $t('notification_plan.form.cancel') }}
      </button>
    </footer>
    <NotificationPlanDialog v-model="successDialogVisible" variant="success" @confirm="goToIndex" />
    <NotificationPlanDialog
      v-model="duplicateDialogVisible"
      variant="duplicate"
      @confirm="goToIndex"
    />
  </section>
</template>

<style scoped lang="scss">
  .notification-plan-editor {
    display: grid;
    gap: var(--xl-size-base);
  }

  .notification-plan-editor__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    .btn-primary {
      width: min(100%, 318px);
    }

    .btn-cancel {
      width: min(100%, 164px);
    }

    button {
      min-height: 52px;
      border-radius: var(--radius-full);
    }
  }

  @media (max-width: 560px) {
    .notification-plan-editor__actions {
      flex-direction: column;

      .btn-primary,
      .btn-cancel {
        width: 100%;
      }
    }
  }
</style>
