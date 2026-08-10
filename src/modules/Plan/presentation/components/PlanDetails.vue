<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PlanController from '../controllers/plan.controller';
  import { ShowPlanParams } from '../../core/params/plan.params';
  const route = useRoute();
  const router = useRouter();
  const controller = PlanController.getInstance();
  onMounted(() => controller.fetchOne(new ShowPlanParams(Number(route.params.id))));
</script>

<template>
  <section v-if="controller.itemData.value" class="details-card">
    <header>
      <h2>{{ controller.itemData.value.title }}</h2>
      <button class="btn" @click="router.push(`/plans/edit/${route.params.id}`)">
        {{ $t('edit') }}
      </button>
    </header>
    <dl>
      <dt>{{ $t('price') }}</dt>
      <dd>{{ controller.itemData.value.price }}</dd>
      <dt>{{ $t('status') }}</dt>
      <dd>{{ $t(`plan_status_${controller.itemData.value.status}`) }}</dd>
      <dt>{{ $t('subscribers') }}</dt>
      <dd>{{ controller.itemData.value.subscribers }}</dd>
      <dt>{{ $t('trial_days') }}</dt>
      <dd>{{ controller.itemData.value.trialDays }}</dd>
    </dl>
    <h3>{{ $t('pricing') }}</h3>
    <ul>
      <li v-for="(price, index) in controller.itemData.value.pricing" :key="index">
        {{ price.price }} — {{ price.duration }} / {{ price.duration_type }}
      </li>
    </ul>
    <h3>{{ $t('plan_features') }}</h3>
    <ul>
      <li v-for="feature in controller.itemData.value.features" :key="feature.feature_id">
        {{ feature.feature_title ?? feature.feature_id }}
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
  .details-card {
    padding: var(--xl-size-1);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  header {
    display: flex;
    justify-content: space-between;
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
