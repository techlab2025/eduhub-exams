<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import Tab from 'primevue/tab';
  import TabList from 'primevue/tablist';
  import TabPanel from 'primevue/tabpanel';
  import TabPanels from 'primevue/tabpanels';
  import Tabs from 'primevue/tabs';
  import ToggleSwitch from 'primevue/toggleswitch';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import IndexAddIcon from '@/shared/icons/IndexAddIcon.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import IndexHighLightsBadgesParams from '@/modules/HighlightBadge/core/params/index.highlightBadge.params';
  import HighlightBadgeController from '@/modules/HighlightBadge/presentation/controllers/highlightBadge.controller';
  import type PlanModel from '../../core/models/plan.model';
  import { PlanDurationTypeEnum } from '../../core/enums/plan.duration.enum';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
  import {
    PLAN_FEATURE_DEFINITIONS,
    type PlanFeatureSubTypeEnum,
    type PlanFeatureTypeEnum,
  } from '../../core/enums/planType.enum';
  import AddPlanParams from '../../core/params/add.plan.params';
  import EditPlanParams from '../../core/params/edit.plan.params';
  import PlanFeatureParams from '../../core/params/plan.features.params';
  import PlanPricingParams from '../../core/params/plan.pricing.params';
  import PlanSubFeatureParams from '../../core/params/plan.sub.features.params';

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

  const props = defineProps<{
    plan?: PlanModel;
    loading?: boolean;
    formKey?: string;
  }>();
  const emit = defineEmits(['updateData']);
  const { t } = useI18n();
  const route = useRoute();
  const badgeController = HighlightBadgeController.getInstance();
  const id = Number(route.params.id || 0);
  const activeTab = ref('basic');

  const title = ref<Record<string, string>>({});
  const description = ref<Record<string, string>>({});
  const status = ref<TitleInterface<number> | null>({
    id: PlanStatusEnum.ACTIVE,
    title: t('active'),
  });
  const badges = ref<TitleInterface<number>[]>([]);
  const hasTrial = ref(false);
  const trialDays = ref(0);
  const createPricing = () =>
    new PlanPricingParams({
      price: 0,
      duration: 1,
      durationType: PlanDurationTypeEnum.MONTH,
    });
  const pricing = ref<PlanPricingParams[]>([createPricing()]);
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

  const durationOptions = computed(() => [
    { id: PlanDurationTypeEnum.DAY, title: t('day') },
    { id: PlanDurationTypeEnum.WEEK, title: t('week') },
    { id: PlanDurationTypeEnum.MONTH, title: t('month') },
    { id: PlanDurationTypeEnum.YEAR, title: t('year') },
  ]);
  const statusOptions = computed(() => [
    { id: PlanStatusEnum.ACTIVE, title: t('active') },
    { id: PlanStatusEnum.INACTIVE, title: t('inactive') },
    { id: PlanStatusEnum.ARCHIVED, title: t('archived') },
    { id: PlanStatusEnum.DRAFT, title: t('draft') },
  ]);

  const normalizeTranslations = (value: unknown, key: string) =>
    Array.isArray(value)
      ? Object.fromEntries(
          value.map((item: Record<string, unknown>) => [
            String(item.locale),
            String(item[key] ?? ''),
          ]),
        )
      : ((value as Record<string, string>) ?? {});

  const addPricing = () => pricing.value.push(createPricing());
  const resetBasicInfo = () => {
    title.value = {};
    description.value = {};
    badges.value = [];
  };
  const resetPricing = () => {
    pricing.value = [createPricing()];
    hasTrial.value = false;
    trialDays.value = 0;
  };
  const resetFeatures = () => {
    planFeatures.value.forEach((feature, featureIndex) => {
      feature.enabled = false;
      feature.subTypes.forEach((subType, subTypeIndex) => {
        subType.enabled = false;
        subType.limit =
          PLAN_FEATURE_DEFINITIONS[featureIndex]?.subTypes[subTypeIndex]?.defaultLimit;
      });
    });
  };

  const updateData = () => {
    if (!status.value) return;

    const data = {
      translations: new TranslationParams({ title: title.value, description: description.value }),
      status: Number(status.value.id) as PlanStatusEnum,
      highlightBadge: badges.value.map((item) => Number(item.id)),
      pricing: pricing.value,
      hasTrail: hasTrial.value,
      trialDays: trialDays.value,
      features: planFeatures.value
        .filter((feature) => feature.enabled)
        .map(
          (feature) =>
            new PlanFeatureParams({
              featureType: feature.featureType,
              featureSubType: feature.subTypes
                .filter((subType) => subType.hasLimit || subType.enabled)
                .map(
                  (subType) =>
                    new PlanSubFeatureParams({
                      subType: subType.subType,
                      ...(subType.hasLimit ? { limit: subType.limit ?? 0 } : {}),
                    }),
                ),
            }),
        ),
    };

    emit('updateData', id ? new EditPlanParams({ id, ...data }) : new AddPlanParams(data));
  };

  watch(
    () => props.plan,
    (plan) => {
      if (!plan) return;

      title.value = normalizeTranslations(plan.title, 'title');
      description.value = normalizeTranslations(plan.description, 'description');
      status.value =
        statusOptions.value.find((option) => option.id === Number(plan.status)) ?? null;
      badges.value = plan.highlightBadges;
      hasTrial.value = plan.hasTrial;
      trialDays.value = plan.trialDays;
      pricing.value = plan.pricing.map(
        (item) =>
          new PlanPricingParams({
            price: item.price,
            duration: item.duration,
            durationType: Number(item.duration_type) as PlanDurationTypeEnum,
          }),
      );
      planFeatures.value.forEach((feature) => {
        const savedFeature = plan.features.find(
          (item) => item.feature_type === feature.featureType,
        );
        feature.enabled = Boolean(savedFeature?.status ?? savedFeature);
        feature.subTypes.forEach((subType) => {
          const savedSubType = savedFeature?.feature_sub_type.find(
            (item) => item.sub_type === subType.subType,
          );
          subType.enabled = Boolean(savedSubType?.status ?? savedSubType);
          if (subType.hasLimit && savedSubType?.limit !== undefined) {
            subType.limit = savedSubType.limit;
          }
        });
      });
    },
    { immediate: true },
  );

  watch(
    [title, description, status, badges, pricing, hasTrial, trialDays, planFeatures],
    updateData,
    { deep: true, immediate: true },
  );
</script>

<template>
  <section class="plan-form" :class="{ 'is-loading': props.loading }">
    <header class="plan-form-header">
      <h2>{{ $t(id ? 'plan_form_edit_title' : 'plan_form_create_title') }}</h2>
      <p>{{ $t(id ? 'plan_form_edit_subtitle' : 'plan_form_create_subtitle') }}</p>
    </header>

    <Tabs v-model:value="activeTab" class="plan-tabs">
      <TabList>
        <Tab value="basic">{{ $t('basic_info') }}</Tab>
        <Tab value="pricing">{{ $t('pricing') }}</Tab>
        <Tab value="features">{{ $t('features') }}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="basic">
          <div class="panel-heading">
            <h3>{{ $t('basic_info') }}</h3>
            <button type="button" class="reset-button" @click="resetBasicInfo">
              {{ $t('reset') }}
            </button>
          </div>
          <div class="basic-info-fields">
            <MultiLangInput
              field-key="title"
              :label="$t('plan_display_name')"
              :placeholder="$t('enter_plan_name')"
              :model-value="title"
              @update:model-value="title = $event"
            />
            <MultiLangInput
              field-key="description"
              type="description"
              :label="$t('description_text')"
              :placeholder="$t('enter_plan_description')"
              :model-value="description"
              @update:model-value="description = $event"
            />
            <UpdatedCustomInputSelect
              v-model="badges"
              :type="2"
              :label="$t('highlight_badges')"
              :placeholder="$t('highlight_badges_example')"
              :controller="badgeController"
              :params="
                new IndexHighLightsBadgesParams({
                  word: '',
                  pageNumber: 1,
                  perPage: 100,
                  withPage: 0,
                })
              "
            />
          </div>
        </TabPanel>

        <TabPanel value="pricing">
          <div class="panel-heading">
            <h3>{{ $t('pricing') }}</h3>
            <button type="button" class="reset-button" @click="resetPricing">
              {{ $t('reset') }}
            </button>
          </div>
          <div class="pricing-list">
            <div v-for="(row, index) in pricing" :key="index" class="pricing-card">
              <label>
                {{ $t('price') }}
                <input
                  v-model.number="row.price"
                  type="number"
                  min="0"
                  :placeholder="$t('enter_plan_price')"
                />
              </label>
              <label>
                {{ $t('duration') }}
                <span class="duration-field">
                  <input
                    v-model.number="row.duration"
                    type="number"
                    min="1"
                    :placeholder="$t('enter_duration_number')"
                  />
                  <select v-model="row.durationType" :aria-label="$t('duration_type')">
                    <option v-for="option in durationOptions" :key="option.id" :value="option.id">
                      {{ option.title }}
                    </option>
                  </select>
                </span>
              </label>
              <button
                v-if="index === pricing.length - 1"
                type="button"
                class="pricing-action pricing-action--add"
                :aria-label="$t('add_pricing')"
                @click="addPricing"
              >
                <IndexAddIcon />
              </button>
              <button
                v-else
                type="button"
                class="pricing-action pricing-action--remove"
                :aria-label="$t('remove')"
                @click="pricing.splice(index, 1)"
              >
                &times;
              </button>
            </div>
          </div>
          <div class="trial-section">
            <div class="trial-heading">
              <span>{{ $t('trial_days') }}</span>
              <ToggleSwitch v-model="hasTrial" :aria-label="$t('has_trial')" />
            </div>
            <input v-model.number="trialDays" type="number" min="0" :disabled="!hasTrial" />
          </div>
        </TabPanel>

        <TabPanel value="features">
          <div class="panel-heading">
            <h3>{{ $t('features') }}</h3>
            <button type="button" class="reset-button" @click="resetFeatures">
              {{ $t('reset') }}
            </button>
          </div>
          <section class="features-section">
            <article
              v-for="(feature, featureIndex) in planFeatures"
              :key="feature.featureType"
              class="feature-card"
            >
              <header class="feature-row">
                <span class="feature-number">{{ featureIndex + 1 }}</span>
                <span class="feature-copy">
                  <strong>{{ $t(feature.titleKey) }}</strong>
                  <small>{{ $t(feature.descriptionKey) }}</small>
                </span>
                <ToggleSwitch v-model="feature.enabled" :aria-label="$t(feature.titleKey)" />
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
                  <ToggleSwitch
                    v-else
                    v-model="subType.enabled"
                    :aria-label="$t(subType.titleKey)"
                  />
                </div>
              </div>
            </article>
          </section>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>

<style scoped lang="scss">
  .plan-form {
    display: grid;
    gap: var(--xs-size);
    padding: var(--xl-size-1);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);

    &.is-loading {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  .plan-form-header {
    display: grid;
    gap: var(--xs-size-3);
  }

  .plan-form-header h2,
  .plan-form-header p,
  .panel-heading h3 {
    margin: 0;
  }

  .plan-form-header p,
  .feature-copy small {
    color: var(--GrayText);
  }

  .plan-tabs {
    min-width: 0;
  }

  :deep(.p-tablist-tab-list) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    background: transparent;
    border-color: var(--border-weak);
  }

  :deep(.p-tab) {
    justify-content: center;
    color: var(--GrayText);
    background: transparent;
    border-width: 0 0 3px;
  }

  :deep(.p-tab-active) {
    color: var(--Black);
    border-color: var(--Black);
  }

  :deep(.p-tabpanels) {
    padding: var(--xl-size-base) 0 0;
    color: inherit;
    background: transparent;
  }

  .panel-heading,
  .trial-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--xl-size-base);
  }

  .reset-button {
    padding: 0;
    color: var(--danger-color);
    text-decoration: underline;
    background: transparent;
    border: 0;
    cursor: pointer;
  }

  .basic-info-fields,
  .pricing-list,
  .features-section,
  .trial-section {
    display: grid;
    gap: var(--xl-size-base);
  }

  .features-section {
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

  .pricing-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) auto;
    align-items: end;
    gap: var(--xl-size-base);
    padding: var(--xl-size-base);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
  }

  label {
    display: grid;
    gap: var(--xs-size-3);
  }

  input,
  select {
    min-width: 0;
    min-height: 52px;
    padding: var(--xs-size) var(--xl-size-base);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);
    background: var(--BgWhite);
  }

  .duration-field {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 140px;
  }

  .duration-field input {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  .duration-field select {
    margin-inline-start: -1px;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  .pricing-action {
    display: grid;
    width: 52px;
    height: 52px;
    place-items: center;
    border-radius: var(--radius-full);
    cursor: pointer;
  }

  .pricing-action--add {
    color: var(--PrimaryColor);
    background: var(--BgWhite);
    border: 2px solid var(--PrimaryColor);
  }

  .pricing-action--remove {
    color: var(--danger-color);
    background: var(--BgWhite);
    border: 1px solid var(--error-border);
    font-size: var(--xl-size);
  }

  .trial-section {
    margin-top: var(--xl-size-base);
    gap: var(--xs-size);
  }

  .trial-heading {
    margin-bottom: 0;
  }

  .trial-section input:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .pricing-card {
      grid-template-columns: 1fr;
    }

    .pricing-action {
      justify-self: end;
    }

    .duration-field {
      grid-template-columns: minmax(0, 1fr) 110px;
    }
  }
</style>
