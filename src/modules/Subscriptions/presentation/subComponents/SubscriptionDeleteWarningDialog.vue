<script setup lang="ts">
  import Dialog from 'primevue/dialog';
  import SubscriptionDeleteWarning from '@/assets/images/PLan/PlanDeleteWarning.gif';

  const visible = defineModel<boolean>({ default: false });
</script>

<template>
  <Dialog v-model:visible="visible" modal :style="{ width: 'min(37.25rem, calc(100vw - 2rem))' }">
    <template #container>
      <div class="subscription-delete-warning-dialog">
        <div class="warning-image" aria-hidden="true">
          <img :src="SubscriptionDeleteWarning" alt="" />
        </div>
        <div class="warning-copy">
          <h3>{{ $t('subscription_delete_blocked_title') }}</h3>
          <p>{{ $t('subscription_delete_blocked_message') }}</p>
        </div>
        <button type="button" @click="visible = false">
          {{ $t('subscription_delete_blocked_close') }}
        </button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .subscription-delete-warning-dialog {
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    text-align: center;
    background: var(--BgWhite);
    border-radius: 30px;
  }

  .warning-image {
    width: 200px;
    height: 158px;
    position: relative;
    overflow: hidden;
    flex: 0 0 158px;

    img {
      width: 200px;
      height: 200px;
      position: absolute;
      top: -13px;
      left: 0;
      display: block;
      object-fit: cover;
    }
  }

  .warning-copy {
    width: 100%;
    display: grid;
    justify-items: center;
    gap: 10px;
  }

  h3,
  p {
    margin: 0;
    font-family: var(--font-family);
  }

  h3 {
    max-width: 448px;
    color: var(--standard-black);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    color: var(--title-header-color);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
  }

  button {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    color: var(--standard-black);
    background: var(--gray-100-std);
    border: 0;
    border-radius: var(--radius-full);
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .subscription-delete-warning-dialog {
      padding: 20px;
      gap: 24px;
    }

    .warning-image {
      width: 160px;
      height: 126px;
      flex-basis: 126px;

      img {
        width: 160px;
        height: 160px;
        top: -10px;
      }
    }

    h3 {
      font-size: 18px;
    }
  }
</style>
