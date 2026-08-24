<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import NotificationPlanController from '../controllers/notification.plan.controller';
  import NotificationPlanForm from './NotificationPlanForm.vue';
  import type EditNotificationPlanParams from '../../core/params/edit.notification.plan.params';
  import ShowNotificationPlanParams from '../../core/params/show.notification.plan.params';

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const controller = NotificationPlanController.getInstance();
  const formRef = ref<InstanceType<typeof NotificationPlanForm>>();
  const params = ref<EditNotificationPlanParams>();
  const loading = ref(false);

  const save = async () => {
    if (!params.value || !formRef.value?.validate()) {
      dialogManager.toastWarning(t('notification_plan.form.complete_required'));
      return;
    }
    loading.value = true;
    try {
      const result = await controller.update(params.value);
      if (result && !result.hasError) await router.push({ name: 'Notification Plans' });
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => controller.fetchOne(new ShowNotificationPlanParams(Number(route.params.id))));
</script>

<template>
  <section class="notification-plan-editor">
    <NotificationPlanForm
      ref="formRef"
      :plan="controller.itemData.value!"
      :loading="loading"
      @update-data="params = $event as EditNotificationPlanParams"
    />
    <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="save">
      {{ $t('notification_plan.form.update') }}
    </button>
  </section>
</template>

<style scoped lang="scss">
  .notification-plan-editor {
    display: grid;
    gap: var(--xl-size-base);
  }
</style>
