<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { ShowSubscriptionParams } from '../../core/params/show.subscription.params';
  import SubscriptionController from '../controllers/subscription.controller';
  const route = useRoute();
  const controller = SubscriptionController.getInstance();
  onMounted(() => controller.fetchOne(new ShowSubscriptionParams(Number(route.params.id))));
</script>

<template>
  <section v-if="controller.itemData.value" class="details-card">
    <h2>{{ $t('subscription_details') }}</h2>
    <dl>
      <dt>{{ $t('student') }}</dt>
      <dd>{{ controller.itemData.value.student.name }}</dd>
      <dt>{{ $t('serial') }}</dt>
      <dd>{{ controller.itemData.value.student.serial }}</dd>
      <dt>{{ $t('education_type') }}</dt>
      <dd>{{ controller.itemData.value.educationType?.title }}</dd>
      <dt>{{ $t('plan') }}</dt>
      <dd>{{ controller.itemData.value.plan.title }}</dd>
      <dt>{{ $t('total_paid') }}</dt>
      <dd>{{ controller.itemData.value.totalPrice }}</dd>
      <dt>{{ $t('payment_method') }}</dt>
      <dd>{{ controller.itemData.value.plan.payment_method }}</dd>
      <dt>{{ $t('subscription_date') }}</dt>
      <dd>{{ controller.itemData.value.subscriptionDate }}</dd>
      <dt>{{ $t('expire_date') }}</dt>
      <dd>{{ controller.itemData.value.expireDate }}</dd>
    </dl>
  </section>
</template>
<style scoped lang="scss">
  .details-card {
    padding: var(--xl-size-1);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--xs-size) var(--xl-size-1);
  }

  dt {
    font-weight: 700;
  }
</style>
