<script setup lang="ts">
  import { computed, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import SubscriptionDetailsCloseIcon from '@/assets/icons/Subscription/subscription-details-close.svg';
  import { ShowSubscriptionParams } from '../../core/params/show.subscription.params';
  import type SubscriptionDetailsModel from '../../core/models/subscription.details.model';
  import SubscriptionController from '../controllers/subscription.controller';

  const props = defineProps<{
    subscriptionId: number | null;
  }>();

  defineEmits<{
    showReceipt: [details: SubscriptionDetailsModel];
  }>();
  const visible = defineModel<boolean>({ default: false });
  const controller = SubscriptionController.getInstance();
  const details = controller.itemData;
  const loading = computed(() => controller.isItemLoading());

  watch(
    [visible, () => props.subscriptionId],
    async ([isVisible, subscriptionId]) => {
      if (isVisible && subscriptionId !== null) {
        await controller.fetchOne(new ShowSubscriptionParams(subscriptionId));
      }
    },
    { immediate: true },
  );
</script>

<template>
  <Dialog v-model:visible="visible" modal :style="{ width: 'min(47.25rem, calc(100vw - 2rem))' }">
    <template #container>
      <article class="subscription-details-dialog">
        <header>
          <h2>{{ $t('subscription_details') }}</h2>
          <button type="button" :aria-label="$t('close')" @click="visible = false">
            <img :src="SubscriptionDetailsCloseIcon" alt="" />
          </button>
        </header>

        <div v-if="loading" class="subscription-details-loading" aria-live="polite">
          <span class="loader"></span>
        </div>

        <template v-else-if="details">
          <div class="subscription-details-card">
            <div class="student-details">
              <h3>{{ details.user.name }}</h3>
              <p>{{ details.user.serial }}</p>
              <div v-if="details.educationType.title" class="education-type-badge">
                <span>{{ $t('education_type') }}:</span>
                <strong>{{ details.educationType.title }}</strong>
              </div>
            </div>

            <div class="plan-details">
              <div class="plan-heading">
                <h3>{{ details.plan.title }}</h3>
                <span class="details-status" :class="`details-status-${details.plan.status}`">
                  {{ $t(`subscription_status_${details.plan.status}`) }}
                </span>
              </div>

              <dl>
                <div>
                  <dt>{{ $t('total_paid') }}</dt>
                  <dd>{{ details.plan.totalPaid }}</dd>
                </div>
                <div>
                  <dt>{{ $t('payment_method') }}</dt>
                  <dd>{{ details.plan.paymentMethod || `--` }}</dd>
                </div>
                <div>
                  <dt>{{ $t('subscribe_date') }}</dt>
                  <dd>{{ details.plan.subscribeDate }}</dd>
                </div>
                <div>
                  <dt>{{ $t('expire_date') }}</dt>
                  <dd>{{ details.plan.expireDate }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- <button type="button" class="show-receipt-button" @click="emit('showReceipt', details)">
            {{ $t('show_receipt') }}
          </button> -->
        </template>
      </article>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .subscription-details-dialog {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
    background: var(--BgWhite);
    border: 1px solid var(--input-border-color);
    border-radius: 20px;

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      h2 {
        margin: 0;
        color: var(--title-card-color);
        font-family: var(--font-family);
        font-size: 20px;
        font-weight: 600;
        line-height: 1;
      }

      button,
      img {
        width: 32px;
        height: 32px;
      }

      button {
        padding: 0;
        background: transparent;
        border: 0;
        cursor: pointer;
      }

      img {
        display: block;
      }
    }
  }

  .subscription-details-loading {
    min-height: 270px;
    display: grid;
    place-items: center;
  }

  .subscription-details-card {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--background-color-soft-light);
    border-radius: 20px;
  }

  .student-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    h3,
    p {
      margin: 0;
      font-family: var(--font-family);
      line-height: 1;
    }

    h3 {
      color: var(--Gray-6);
      font-size: 20px;
      font-weight: 600;
    }

    p {
      color: var(--gray-text);
      font-size: 16px;
      font-weight: 500;
    }
  }

  .education-type-badge {
    max-width: 100%;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    background: var(--BgWhite);
    border-radius: 8px;
    font-family: var(--font-family);
    font-size: 14px;
    white-space: nowrap;

    span {
      color: var(--primary-green);
      font-weight: 500;
    }

    strong {
      overflow: hidden;
      color: var(--standard-black);
      font-weight: 500;
      text-overflow: ellipsis;
    }
  }

  .plan-details {
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--BgWhite);
    border: 1px solid var(--background-color-soft-light);
    border-radius: 10px;
  }

  .plan-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-family: 'Demi';

    h3 {
      margin: 0;
      color: var(--standard-black);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.12px;
    }
  }

  .details-status {
    min-width: 92px;
    min-height: 30px;
    padding: 4px 14px;
    display: grid;
    place-items: center;
    border-radius: var(--radius-full);
    font-size: 16px;
    font-weight: 600;
  }

  .details-status-0 {
    color: var(--in-active-color);
    background: var(--warning-light);
    border: 1px solid var(--in-active-color);
  }

  .details-status-1 {
    color: var(--primary-green);
    background: var(--success-green-lighter-std);
    border: 1px solid var(--PrimaryColor-alpha-30);
  }

  .details-status-2 {
    color: var(--danger-alt);
    background: var(--danger-light);
    border: 1px solid var(--danger-alt);
  }

  .details-status-3 {
    color: var(--in-active-color);
    background: var(--warning-light);
    border: 1px solid var(--in-active-color);
  }

  dl {
    margin: 0;
    padding-top: 12px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-top: 1px solid var(--input-border-color);

    > div {
      min-width: 0;
      padding-inline: 16px;
      display: grid;
      gap: 8px;

      &:first-child {
        padding-inline-start: 0;
      }

      &:last-child {
        padding-inline-end: 0;
      }

      &:not(:first-child) {
        border-inline-start: 1px solid var(--input-border-color);
      }
    }

    dt,
    dd {
      min-width: 0;
      margin: 0;
      overflow: hidden;
      font-family: var(--font-family);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    dt {
      color: var(--gray-text);
      font-size: 14px;
      font-weight: 600;
    }

    dd {
      color: var(--Gray-6);
      font-size: 16px;
      font-weight: 500;
    }
  }

  .show-receipt-button {
    width: 100%;
    height: 56px;
    padding: 16px;
    color: var(--primary-green);
    background: var(--BgWhite);
    border: 1px solid var(--primary-green);
    border-radius: 20px;
    font-family: var(--font-family);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 650px) {
    dl {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px 0;

      > div:nth-child(3) {
        padding-inline-start: 0;
        border-inline-start: 0;
      }
    }
  }

  @media (max-width: 420px) {
    dl {
      grid-template-columns: 1fr;

      > div {
        padding-inline: 0;
        border-inline-start: 0 !important;
      }
    }
  }
</style>
