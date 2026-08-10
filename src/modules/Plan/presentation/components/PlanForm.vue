<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import ToggleSwitch from 'primevue/toggleswitch';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import HighlightBadgeController from '@/modules/HighlightBadge/presentation/controllers/highlightBadge.controller';
  import { IndexHighlightBadgeParams } from '@/modules/HighlightBadge/core/params/highlightBadge.params';
  import PlanController from '../controllers/plan.controller';
  import { DurationTypeEnum, PlanStatusEnum, type PlanPricing } from '../../core/models/plan.model';
  import {
    PLAN_FEATURE_DEFINITIONS,
    type PlanFeatureSubTypeEnum,
    type PlanFeatureTypeEnum,
  } from '../../core/enums/planType.enum';
  import { ShowPlanParams, StorePlanParams, UpdatePlanParams } from '../../core/params/plan.params';

  interface PlanSubFeatureFormItem {
    subType: PlanFeatureSubTypeEnum;
    titleKey: string;
    descriptionKey: string;
    enabled: boolean;
    hasLimit: boolean;
    limit?: number;
  }

  interface PlanFeatureFormItem {
    featureType: PlanFeatureTypeEnum;
    titleKey: string;
    descriptionKey: string;
    enabled: boolean;
    subTypes: PlanSubFeatureFormItem[];
  }

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = PlanController.getInstance();
  const badgeController = HighlightBadgeController.getInstance();
  const id = Number(route.params.id || 0);
  const title = ref<Record<string, string>>({});
  const description = ref<Record<string, string>>({});
  const duration = ref(1);
  const price = ref(0);
  const durationType = ref<TitleInterface<number> | null>(null);
  const status = ref<TitleInterface<number> | null>(null);
  const badges = ref<TitleInterface<number>[]>([]);
  const planFeatures = ref<PlanFeatureFormItem[]>(
    PLAN_FEATURE_DEFINITIONS.map((feature) => ({
      featureType: feature.type,
      titleKey: feature.titleKey,
      descriptionKey: feature.descriptionKey,
      enabled: false,
      subTypes: feature.subTypes.map((subType) => ({
        subType: subType.type,
        titleKey: subType.titleKey,
        descriptionKey: subType.descriptionKey,
        enabled: false,
        hasLimit: subType.defaultLimit !== undefined,
        limit: subType.defaultLimit,
      })),
    })),
  );
  const hasTrial = ref(false);
  const trialDays = ref(0);
  const pricing = ref<PlanPricing[]>([]);
  const loading = ref(false);
  const durationOptions = computed(() => [
    { id: Number(DurationTypeEnum.DAY), title: t('day') },
    { id: Number(DurationTypeEnum.WEEK), title: t('week') },
    { id: Number(DurationTypeEnum.MONTH), title: t('month') },
    { id: Number(DurationTypeEnum.YEAR), title: t('year') },
  ]);
  const statusOptions = computed(() => [
    { id: Number(PlanStatusEnum.ACTIVE), title: t('active') },
    { id: Number(PlanStatusEnum.INACTIVE), title: t('inactive') },
    { id: Number(PlanStatusEnum.ARCHIVED), title: t('archived') },
    { id: Number(PlanStatusEnum.DRAFT), title: t('draft') },
  ]);
  const normalize = (value: unknown, key: string) =>
    Array.isArray(value)
      ? Object.fromEntries(value.map((item) => [String(item.locale), String(item[key] ?? '')]))
      : ((value as Record<string, string>) ?? {});
  const addPricing = () =>
    pricing.value.push({ price: 0, duration: 1, duration_type: DurationTypeEnum.MONTH });
  const save = async () => {
    if (!durationType.value || !status.value) return;
    loading.value = true;
    const payload = {
      translations: new TranslationParams({ title: title.value, description: description.value }),
      duration: duration.value,
      durationType: String(durationType.value.id) as DurationTypeEnum,
      price: price.value,
      status: String(status.value.id) as PlanStatusEnum,
      highlightBadges: badges.value.map((item) => Number(item.id)),
      pricing: pricing.value,
      hasTrial: hasTrial.value,
      trialDays: trialDays.value,
      features: planFeatures.value
        .filter((feature) => feature.enabled)
        .map((feature) => ({
          feature_type: feature.featureType,
          feature_sub_type: feature.subTypes
            .filter((subType) => subType.hasLimit || subType.enabled)
            .map((subType) => ({
              sub_type: subType.subType,
              ...(subType.hasLimit ? { limit: subType.limit ?? 0 } : {}),
            })),
        })),
    };
    const result = id
      ? await controller.update(new UpdatePlanParams(id, payload))
      : await controller.create(new StorePlanParams(payload));
    loading.value = false;
    if (result?.data || !result?.hasError) await router.push('/plans');
  };
  onMounted(async () => {
    if (!id) return;
    await controller.fetchOne(new ShowPlanParams(id, true));
    const item = controller.itemData.value;
    if (!item) return;
    title.value = normalize(item.title, 'title');
    description.value = normalize(item.description, 'description');
    duration.value = item.duration;
    price.value = item.price;
    hasTrial.value = item.hasTrial;
    trialDays.value = item.trialDays;
    durationType.value =
      durationOptions.value.find((option) => option.id === Number(item.durationType)) ?? null;
    status.value = statusOptions.value.find((option) => option.id === Number(item.status)) ?? null;
    badges.value = item.highlightBadges;
    pricing.value = [...item.pricing];
    planFeatures.value.forEach((feature) => {
      const savedFeature = item.features.find(
        (itemFeature) => itemFeature.feature_type === feature.featureType,
      );
      feature.enabled = Boolean(savedFeature?.status ?? savedFeature);
      feature.subTypes.forEach((subType) => {
        const savedSubType = savedFeature?.feature_sub_type.find(
          (itemSubType) => itemSubType.sub_type === subType.subType,
        );
        subType.enabled = Boolean(savedSubType?.status ?? savedSubType);
        if (subType.hasLimit && savedSubType?.limit !== undefined) {
          subType.limit = savedSubType.limit;
        }
      });
    });
  });
</script>

<template>
  <section class="plan-form">
    <h2>{{ $t(id ? 'edit_plan' : 'add_plan') }}</h2>
    <MultiLangInput
      field-key="title"
      :label="$t('title')"
      :model-value="title"
      @update:model-value="title = $event"
    />
    <MultiLangInput
      field-key="description"
      type="description"
      :label="$t('description')"
      :model-value="description"
      @update:model-value="description = $event"
    />
    <div class="form-grid">
      <label>{{ $t('duration') }}<input v-model.number="duration" type="number" min="1" /></label>
      <UpdatedCustomInputSelect
        v-model="durationType"
        :label="$t('duration_type')"
        :placeholder="$t('select_duration_type')"
        :static-options="durationOptions"
        required
      />
      <label>{{ $t('price') }}<input v-model.number="price" type="number" min="0" /></label>
      <UpdatedCustomInputSelect
        v-model="status"
        :label="$t('status')"
        :placeholder="$t('select_status')"
        :static-options="statusOptions"
        required
      />
      <UpdatedCustomInputSelect
        v-model="badges"
        :type="2"
        :label="$t('highlight_badges')"
        :placeholder="$t('select_highlight_badges')"
        :controller="badgeController"
        :params="new IndexHighlightBadgeParams('', 1, 100, 0)"
      />
    </div>
    <section class="features-section">
      <h3>{{ $t('plan_features') }}</h3>
      <article
        v-for="(feature, featureIndex) in planFeatures"
        :key="feature.featureType"
        class="feature-card"
      >
        <header class="feature-row feature-heading">
          <span class="feature-number">{{ featureIndex + 1 }}</span>
          <span class="feature-copy">
            <strong>{{ $t(feature.titleKey) }}</strong>
            <small>{{ $t(feature.descriptionKey) }}</small>
          </span>
          <ToggleSwitch v-model="feature.enabled" />
        </header>
        <div v-if="feature.enabled" class="sub-features">
          <div v-for="subType in feature.subTypes" :key="subType.subType" class="feature-row">
            <span class="sub-feature-dot" aria-hidden="true"></span>
            <span class="feature-copy">
              <strong>{{ $t(subType.titleKey) }}</strong>
              <small>{{ $t(subType.descriptionKey) }}</small>
            </span>
            <input
              v-if="subType.hasLimit"
              v-model.number="subType.limit"
              class="feature-limit"
              type="number"
              min="0"
              :aria-label="$t(subType.titleKey)"
            />
            <ToggleSwitch v-else v-model="subType.enabled" />
          </div>
        </div>
      </article>
    </section>
    <label class="switch-row"><ToggleSwitch v-model="hasTrial" /> {{ $t('has_trial') }}</label>
    <label v-if="hasTrial"
      >{{ $t('trial_days') }}<input v-model.number="trialDays" type="number" min="0"
    /></label>
    <div class="pricing-header">
      <h3>{{ $t('pricing') }}</h3>
      <button class="btn" @click="addPricing">{{ $t('add_pricing') }}</button>
    </div>
    <div v-for="(row, index) in pricing" :key="index" class="pricing-row">
      <input v-model.number="row.price" type="number" :placeholder="$t('price')" />
      <input v-model.number="row.duration" type="number" :placeholder="$t('duration')" />
      <select v-model="row.duration_type">
        <option v-for="option in durationOptions" :key="option.id" :value="option.id">
          {{ option.title }}
        </option>
      </select>
      <button class="btn btn-cancel" @click="pricing.splice(index, 1)">{{ $t('remove') }}</button>
    </div>
    <div class="actions">
      <button class="btn btn-primary" :disabled="loading" @click="save">{{ $t('save') }}</button
      ><button class="btn btn-cancel" @click="router.push('/plans')">{{ $t('cancel') }}</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .plan-form {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-1);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--xl-size-base);
  }

  .features-section {
    display: grid;
    gap: var(--xs-size);
  }

  .feature-card {
    overflow: hidden;
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    background: var(--BgWhite);
  }

  .feature-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--xs-size);
    min-height: 58px;
    padding: var(--xs-size) var(--xl-size-base);
  }

  .feature-number {
    display: grid;
    width: 28px;
    height: 28px;
    place-items: center;
    color: var(--PrimaryColor);
    background: var(--PrimaryColor-alpha-10);
    border-radius: var(--radius-full);
  }

  .feature-copy {
    display: grid;
    gap: var(--xs-size-3);
  }

  .feature-copy small {
    color: var(--GrayText);
  }

  .sub-features {
    margin-inline-start: 44px;
    border-inline-start: 1px solid var(--border-weak);
  }

  .sub-features .feature-row {
    border-top: 1px solid var(--border-weak);
  }

  .sub-feature-dot {
    width: 8px;
    height: 8px;
    background: var(--PrimaryColor);
    border-radius: var(--radius-full);
  }

  .feature-limit {
    width: 80px;
  }

  label {
    display: grid;
    gap: var(--xs-size-3);
  }

  input,
  select {
    min-height: 44px;
    padding: var(--xs-size);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
    background: var(--BgWhite);
  }

  .switch-row,
  .pricing-header,
  .pricing-row,
  .actions {
    display: flex;
    align-items: center;
    gap: var(--xs-size);
  }

  .pricing-header,
  .actions {
    justify-content: space-between;
  }

  .pricing-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr) auto;
  }

  @media (max-width: 768px) {
    .form-grid,
    .pricing-row {
      grid-template-columns: 1fr;
    }
  }
</style>
