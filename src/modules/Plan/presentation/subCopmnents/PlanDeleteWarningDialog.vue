<script setup lang="ts">
  import { computed } from 'vue';
  import Dialog from 'primevue/dialog';
  import PlanDeleteWarning from '@/assets/images/PLan/PlanDeleteWarning.gif';

  const props = withDefaults(
    defineProps<{
      actionType?: 'delete' | 'deactivate' | 'archive' | 'draft';
    }>(),
    {
      actionType: 'delete',
    },
  );

  const visible = defineModel<boolean>({ default: false });

  const titleKey = computed(() => {
    switch (props.actionType) {
      case 'deactivate':
        return 'plan_deactivate_blocked_title';
      case 'archive':
        return 'plan_archive_blocked_title';
      case 'draft':
        return 'plan_draft_blocked_title';
      case 'delete':
      default:
        return 'plan_delete_blocked_title';
    }
  });

  const messageKey = computed(() => {
    switch (props.actionType) {
      case 'deactivate':
        return 'plan_deactivate_blocked_message';
      case 'archive':
        return 'plan_archive_blocked_message';
      case 'draft':
        return 'plan_draft_blocked_message';
      case 'delete':
      default:
        return 'plan_delete_blocked_message';
    }
  });
</script>

<template>
  <Dialog v-model:visible="visible" modal :style="{ width: 'min(32rem, calc(100vw - 2rem))' }">
    <template #container>
      <div class="plan-delete-warning-dialog">
        <img :src="PlanDeleteWarning" width="180" alt="" aria-hidden="true" />
        <h3>{{ $t(titleKey) }}</h3>
        <p>{{ $t(messageKey) }}</p>
        <button type="button" class="btn btn-primary" @click="visible = false">
          {{ $t('cancel') }}
        </button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .plan-delete-warning-dialog {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-2);
    text-align: center;
    background: var(--BgWhite);
    border-radius: var(--radius-lg);

    img {
      margin-inline: auto;
    }

    h3,
    p {
      margin: 0;
      font-family: var(--font-family);
    }

    h3 {
      color: var(--Black);
      font-size: 20px;
      font-weight: 600;
    }

    p {
      color: var(--SecondText);
      font-size: 16px;
      font-weight: 500;
    }

    button {
      width: 100%;
    }
  }
</style>
