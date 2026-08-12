<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import PlanDeleteWarning from '@/assets/images/PLan/PlanDeleteWarning.gif';

  const visible = defineModel<boolean>({ default: false });
</script>

<template>
  <Dialog v-model:visible="visible" modal :style="{ width: 'min(32rem, calc(100vw - 2rem))' }">
    <template #container>
      <div class="plan-delete-warning-dialog">
        <img :src="PlanDeleteWarning" width="180" alt="" aria-hidden="true" />
        <h3>{{ $t('plan_delete_blocked_title') }}</h3>
        <p>{{ $t('plan_delete_blocked_message') }}</p>
        <button type="button" class="btn btn-primary" @click="visible = false">
          {{ $t('close') }}
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
