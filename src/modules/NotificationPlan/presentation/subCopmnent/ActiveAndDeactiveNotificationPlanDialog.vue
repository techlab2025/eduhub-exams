<script setup lang="ts">
  import ActiveNotificationPlanIcon from '@/shared/icons/NotificationPLanIcons/ActiveNotificationPlanIcon.vue';
  import DeActiveNotificationPlanIcon from '@/shared/icons/NotificationPLanIcons/DeActiveNotificationPlanIcon.vue';
  import Dialog from 'primevue/dialog';
  import { ref, watch } from 'vue';

  const emit = defineEmits<{
    (e: 'confirm-data'): void;
    (e: 'close'): void;
  }>();
  const { visable, isActivate } = defineProps<{
    visable: boolean;
    isActivate: boolean;
  }>();
  const Visable = ref<boolean>(visable);
  watch(
    () => visable,
    (newVal) => {
      Visable.value = newVal;
    },
  );

  const ConfirmDialog = () => {
    emit('confirm-data');
  };

  const CloseDialog = () => {
    emit('close');
  };
</script>
<template>
  <Dialog
    v-model:visible="Visable"
    modal
    :style="{ width: '24rem' }"
    :pt="{
      root: 'active-deavtive-notification-plan-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
  >
    <ActiveNotificationPlanIcon v-if="isActivate" />
    <DeActiveNotificationPlanIcon v-else />

    <div class="dialog-content">
      <h2>
        {{ $t(isActivate ? `Activate Notification Plan?` : `Deactivate Notification Plan?`) }}
      </h2>
      <p>
        {{
          $t(
            isActivate
              ? `Are you sure you want to activate this notification plan?`
              : `Are you sure you want to deactivate this notification plan?`,
          )
        }}
      </p>
    </div>
    <div class="actions">
      <button class="btn btn-primary" @click="ConfirmDialog">{{ $t('confirm') }}</button>
      <button class="btn btn-secondary" @click="CloseDialog">{{ $t('cancel') }}</button>
    </div>
  </Dialog>
</template>
