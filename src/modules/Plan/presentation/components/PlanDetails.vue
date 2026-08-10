<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import PlanController from '../controllers/plan.controller';
  import { ShowPlanParams } from '../../core/params/plan.params';
  import { PLAN_FEATURE_DEFINITIONS } from '../../core/enums/planType.enum';
  const route = useRoute();
  const router = useRouter();
  const controller = PlanController.getInstance();
  const featureDefinition = (featureType: number) =>
    PLAN_FEATURE_DEFINITIONS.find((feature) => feature.type === featureType);
  const subTypeDefinition = (featureType: number, subType: number) =>
    featureDefinition(featureType)?.subTypes.find((feature) => feature.type === subType);
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
    <ul class="feature-list">
      <li v-for="feature in controller.itemData.value.features" :key="feature.feature_type">
        <strong>
          {{
            featureDefinition(feature.feature_type)
              ? $t(featureDefinition(feature.feature_type)!.titleKey)
              : (feature.feature_title ?? feature.feature_type)
          }}
        </strong>
        <ul>
          <li v-for="subType in feature.feature_sub_type" :key="subType.sub_type">
            {{
              subTypeDefinition(feature.feature_type, subType.sub_type)
                ? $t(subTypeDefinition(feature.feature_type, subType.sub_type)!.titleKey)
                : subType.sub_type
            }}
            <span v-if="subType.limit !== undefined">: {{ subType.limit }}</span>
          </li>
        </ul>
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

  .feature-list {
    display: grid;
    gap: var(--xs-size);
  }
</style>
