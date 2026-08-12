<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import ToggleSwitch from 'primevue/toggleswitch';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import IndexAddIcon from '@/shared/icons/IndexAddIcon.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import IndexHighLightsBadgesParams from '@/modules/HighlightBadge/core/params/index.highlightBadge.params';
  import HighlightBadgeController from '@/modules/HighlightBadge/presentation/controllers/highlightBadge.controller';
  import type PlanDetailsModel from '../../core/models/plan.details.model';
  import { PlanDurationTypeEnum } from '../../core/enums/plan.duration.enum';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
  import {
    PLAN_FEATURE_DEFINITIONS,
    type PlanFeatureSubTypeEnum,
    type PlanFeatureTypeEnum,
  } from '../../core/enums/planType.enum';
  import AddPlanParams from '../../core/params/add.plan.params';
  import EditPlanParams, { type PlanEditSection } from '../../core/params/edit.plan.params';
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
    plan?: PlanDetailsModel;
    loading?: boolean;
    formKey?: string;
  }>();
  const emit = defineEmits<{
    updateData: [params: AddPlanParams | EditPlanParams];
    validityChange: [isValid: boolean];
  }>();
  const { t } = useI18n();
  const route = useRoute();
  const badgeController = HighlightBadgeController.getInstance();
  const id = Number(route.params.id || 0);
  const editSection = computed<PlanEditSection | undefined>(() => {
    if (!id) return undefined;
    const section = route.query.section;
    return section === 'basic' || section === 'pricing' || section === 'features'
      ? section
      : undefined;
  });
  const isFeatureEdit = computed(() => Boolean(id) && editSection.value === 'features');
  const activeTab = ref('basic');
  const planFormRoot = ref<HTMLElement | null>(null);
  const showValidationErrors = ref(false);
  const basicSection = ref<HTMLElement | null>(null);
  const pricingSection = ref<HTMLElement | null>(null);
  const featuresSection = ref<HTMLElement | null>(null);

  const title = ref<Record<string, string>>({});
  const description = ref<Record<string, string>>({});
  const numberOfSubjects = ref<number>();
  const status = ref<TitleInterface<number> | null>({
    id: PlanStatusEnum.ACTIVE,
    title: t('active'),
  });
  const badges = ref<TitleInterface<number>[]>([]);
  const hasTrial = ref(false);
  const trialDays = ref(0);
  const createPricing = () =>
    new PlanPricingParams({
      price: undefined,
      duration: undefined,
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
    { id: PlanStatusEnum.deactivated, title: t('deactivated') },
    { id: PlanStatusEnum.Archived, title: t('archived') },
    { id: PlanStatusEnum.DRAFT, title: t('draft') },
  ]);

  const hasTranslation = (value: Record<string, string>) =>
    ['en', 'ar'].some((locale) => (value[locale]?.trim().length ?? 0) > 0);
  const isNumberAtLeast = (value: unknown, minimum: number) =>
    Number.isFinite(Number(value)) && Number(value) >= minimum;
  const hasActiveLimit = (subType: PlanSubFeatureFormItem) =>
    subType.hasLimit && isNumberAtLeast(subType.limit, 1);
  const isSubFeatureIncluded = (subType: PlanSubFeatureFormItem) =>
    subType.hasLimit ? hasActiveLimit(subType) : subType.enabled;
  const updateLimitSubFeature = (subType: PlanSubFeatureFormItem) => {
    subType.enabled = hasActiveLimit(subType);
  };

  const validationErrors = computed<Record<string, string>>(() => {
    const errors: Record<string, string> = {};
    const validates = (section: PlanEditSection) =>
      editSection.value === undefined || editSection.value === section;

    if (validates('basic')) {
      if (!hasTranslation(title.value)) errors.title = t('plan_title_required');
      if (!hasTranslation(description.value)) {
        errors.description = t('plan_description_required');
      }
      if (badges.value.length === 0) errors.badges = t('plan_badge_required');
      if (!Number.isInteger(Number(numberOfSubjects.value)) || Number(numberOfSubjects.value) < 1) {
        errors.numberOfSubjects = t('plan_number_of_subjects_required');
      }
    }

    if (validates('pricing')) {
      pricing.value.forEach((item, index) => {
        if (!isNumberAtLeast(item.price, 0)) {
          errors[`pricing-${index}-price`] = t('plan_price_required');
        }
        if (!isNumberAtLeast(item.duration, 1)) {
          errors[`pricing-${index}-duration`] = t('plan_duration_required');
        }
        if (!item.durationType) {
          errors[`pricing-${index}-duration-type`] = t('plan_duration_type_required');
        }
      });

      if (hasTrial.value && !isNumberAtLeast(trialDays.value, 1)) {
        errors.trialDays = t('plan_trial_days_required');
      }
    }

    if (validates('features')) {
      const enabledFeatures = planFeatures.value.filter((feature) => feature.enabled);
      if (enabledFeatures.length === 0) errors.features = t('plan_feature_required');
    }

    return errors;
  });

  const isPublishReady = computed(() => Object.keys(validationErrors.value).length === 0);

  const validate = async () => {
    showValidationErrors.value = true;
    if (isPublishReady.value) return true;

    await nextTick();
    const firstError = planFormRoot.value?.querySelector<HTMLElement>(
      '[data-plan-validation-error]',
    );
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError
      ?.closest<HTMLElement>('.validated-field')
      ?.querySelector<HTMLElement>('input, textarea, select, button')
      ?.focus();
    return false;
  };

  defineExpose({ validate });

  const scrollToSection = (section: 'basic' | 'pricing' | 'features') => {
    activeTab.value = section;
    const target = {
      basic: basicSection.value,
      pricing: pricingSection.value,
      features: featuresSection.value,
    }[section];
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const normalizeTranslations = (value: unknown, key: string) =>
    Array.isArray(value)
      ? Object.fromEntries(
          value.map((item: Record<string, unknown>) => [
            String(item.locale),
            String(item[key] ?? ''),
          ]),
        )
      : typeof value === 'string'
        ? { en: value }
        : ((value as Record<string, string>) ?? {});

  const addPricing = () => pricing.value.push(createPricing());
  const resetBasicInfo = () => {
    title.value = {};
    description.value = {};
    badges.value = [];
    numberOfSubjects.value = undefined;
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
        subType.limit = isFeatureEdit.value
          ? 0
          : PLAN_FEATURE_DEFINITIONS[featureIndex]?.subTypes[subTypeIndex]?.defaultLimit;
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
      numberOfSubjects: numberOfSubjects.value,
      features: planFeatures.value
        .filter((feature) => feature.enabled)
        .map(
          (feature) =>
            new PlanFeatureParams({
              featureType: feature.featureType,
              featureSubType: feature.subTypes.filter(isSubFeatureIncluded).map(
                (subType) =>
                  new PlanSubFeatureParams({
                    subType: subType.subType,
                    ...(subType.hasLimit ? { limit: subType.limit ?? 0 } : {}),
                  }),
              ),
            }),
        ),
    };

    emit(
      'updateData',
      id
        ? new EditPlanParams({ id, section: editSection.value, ...data })
        : new AddPlanParams(data),
    );
    emit('validityChange', isPublishReady.value);
  };

  watch(
    () => props.plan,
    (plan) => {
      if (!plan) return;

      title.value = normalizeTranslations(plan.titles, 'title');
      description.value = normalizeTranslations(plan.descriptions, 'description');
      numberOfSubjects.value = plan.numberOfSubjects || undefined;
      status.value =
        statusOptions.value.find((option) => option.id === Number(plan.status)) ?? null;
      badges.value = plan.highlightBadges.map((el) => {
        return {
          id: el.id,
          name: normalizeTranslations(el.title, 'title'),
        };
      });
      hasTrial.value = plan.trialDays > 0;
      trialDays.value = plan.trialDays;
      pricing.value = plan.pricing.map(
        (item) =>
          new PlanPricingParams({
            price: item.price,
            duration: item.duration,
            durationType: Number(item.durationType) as PlanDurationTypeEnum,
          }),
      );
      planFeatures.value.forEach((feature) => {
        const savedFeature = plan.features.find((item) => item.featureId === feature.featureType);
        feature.enabled = Boolean(savedFeature);
        feature.subTypes.forEach((subType) => {
          if (isFeatureEdit.value && subType.hasLimit) subType.limit = 0;
          const savedSubType = savedFeature?.subFeatures.find(
            (item) => item.id === subType.subType,
          );
          subType.enabled = Boolean(savedSubType?.status);
          if (subType.hasLimit && savedSubType?.limit !== undefined) {
            subType.limit = savedSubType.limit;
          }
        });
      });
    },
    { immediate: true },
  );

  watch(
    [
      title,
      description,
      numberOfSubjects,
      status,
      badges,
      pricing,
      hasTrial,
      trialDays,
      planFeatures,
    ],
    updateData,
    { deep: true, immediate: true },
  );
</script>

<template>
  <section ref="planFormRoot" class="plan-form" :class="{ 'is-loading': props.loading }">
    <header class="plan-form-header">
      <h2>{{ $t(id ? 'plan_form_edit_title' : 'plan_form_create_title') }}</h2>
      <p>{{ $t(id ? 'plan_form_edit_subtitle' : 'plan_form_create_subtitle') }}</p>
    </header>

    <nav v-if="!editSection" class="plan-tabs" :aria-label="$t('plan_form_sections')">
      <button
        type="button"
        :class="{ active: activeTab === 'basic' }"
        @click="scrollToSection('basic')"
      >
        {{ $t('basic_info') }}
      </button>
      <button
        type="button"
        :class="{ active: activeTab === 'pricing' }"
        @click="scrollToSection('pricing')"
      >
        {{ $t('pricing') }}
      </button>
      <button
        type="button"
        :class="{ active: activeTab === 'features' }"
        @click="scrollToSection('features')"
      >
        {{ $t('features') }}
      </button>
    </nav>

    <div class="plan-sections">
      <section
        v-if="!editSection || editSection === 'basic'"
        id="plan-basic"
        ref="basicSection"
        class="plan-section"
      >
        <div class="panel-heading">
          <h3>{{ $t('basic_info') }}</h3>
          <button type="button" class="reset-button" @click="resetBasicInfo">
            {{ $t('reset') }}
          </button>
        </div>
        <div class="basic-info-fields">
          <div class="validated-field">
            <MultiLangInput
              field-key="title"
              :label="$t('plan_display_name')"
              :placeholder="$t('enter_plan_name')"
              :model-value="title"
              @update:model-value="title = $event"
            />
            <p
              v-if="showValidationErrors && validationErrors.title"
              data-plan-validation-error
              class="field-error"
            >
              {{ validationErrors.title }}
            </p>
          </div>
          <div class="validated-field">
            <MultiLangInput
              field-key="description"
              type="description"
              :label="$t('description_text')"
              :placeholder="$t('enter_plan_description')"
              :model-value="description"
              @update:model-value="description = $event"
            />
            <p
              v-if="showValidationErrors && validationErrors.description"
              data-plan-validation-error
              class="field-error"
            >
              {{ validationErrors.description }}
            </p>
          </div>
          <div class="validated-field">
            <label for="plan-number-of-subjects">{{ $t('number_of_subjects') }}</label>
            <input
              id="plan-number-of-subjects"
              v-model.number="numberOfSubjects"
              type="number"
              min="1"
              step="1"
              :placeholder="$t('enter_number_of_subjects')"
              :class="{
                'field-invalid': showValidationErrors && validationErrors.numberOfSubjects,
              }"
              :aria-invalid="Boolean(showValidationErrors && validationErrors.numberOfSubjects)"
              :aria-describedby="
                showValidationErrors && validationErrors.numberOfSubjects
                  ? 'plan-number-of-subjects-error'
                  : undefined
              "
            />
            <p
              v-if="showValidationErrors && validationErrors.numberOfSubjects"
              id="plan-number-of-subjects-error"
              data-plan-validation-error
              class="field-error"
            >
              {{ validationErrors.numberOfSubjects }}
            </p>
          </div>
          <div class="validated-field">
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
            <p
              v-if="showValidationErrors && validationErrors.badges"
              data-plan-validation-error
              class="field-error"
            >
              {{ validationErrors.badges }}
            </p>
          </div>
        </div>
      </section>

      <section
        v-if="!editSection || editSection === 'pricing'"
        id="plan-pricing"
        ref="pricingSection"
        class="plan-section"
      >
        <div class="panel-heading">
          <h3>{{ $t('pricing') }}</h3>
          <button type="button" class="reset-button" @click="resetPricing">
            {{ $t('reset') }}
          </button>
        </div>
        <div class="pricing-list">
          <div v-for="(row, index) in pricing" :key="index" class="pricing-card">
            <div class="validated-field pricing-field">
              <label :for="`pricing-${index}-price`">{{ $t('price') }}</label>
              <input
                :id="`pricing-${index}-price`"
                v-model.number="row.price"
                type="number"
                min="0"
                :placeholder="$t('enter_plan_price')"
                :class="{
                  'field-invalid':
                    showValidationErrors && validationErrors[`pricing-${index}-price`],
                }"
                :aria-invalid="
                  Boolean(showValidationErrors && validationErrors[`pricing-${index}-price`])
                "
                :aria-describedby="
                  showValidationErrors && validationErrors[`pricing-${index}-price`]
                    ? `pricing-${index}-price-error`
                    : undefined
                "
              />
            </div>
            <div class="validated-field pricing-field">
              <label :for="`pricing-${index}-duration`">{{ $t('duration') }}</label>
              <span class="duration-field">
                <span class="pricing-control">
                  <input
                    :id="`pricing-${index}-duration`"
                    v-model.number="row.duration"
                    type="number"
                    min="1"
                    :placeholder="$t('enter_duration_number')"
                    :class="{
                      'field-invalid':
                        showValidationErrors && validationErrors[`pricing-${index}-duration`],
                    }"
                    :aria-invalid="
                      Boolean(showValidationErrors && validationErrors[`pricing-${index}-duration`])
                    "
                    :aria-describedby="
                      showValidationErrors && validationErrors[`pricing-${index}-duration`]
                        ? `pricing-${index}-duration-error`
                        : undefined
                    "
                  />
                </span>
                <span class="pricing-control">
                  <select
                    :id="`pricing-${index}-duration-type`"
                    v-model="row.durationType"
                    :aria-label="$t('duration_type')"
                    :class="{
                      'field-invalid':
                        showValidationErrors && validationErrors[`pricing-${index}-duration-type`],
                    }"
                    :aria-invalid="
                      Boolean(
                        showValidationErrors && validationErrors[`pricing-${index}-duration-type`],
                      )
                    "
                    :aria-describedby="
                      showValidationErrors && validationErrors[`pricing-${index}-duration-type`]
                        ? `pricing-${index}-duration-type-error`
                        : undefined
                    "
                  >
                    <option :value="undefined" disabled>{{ $t('select_duration_type') }}</option>
                    <option v-for="option in durationOptions" :key="option.id" :value="option.id">
                      {{ option.title }}
                    </option>
                  </select>
                </span>
              </span>
            </div>
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
            <div v-if="showValidationErrors" class="pricing-row-errors" aria-live="polite">
              <span
                v-if="validationErrors[`pricing-${index}-price`]"
                :id="`pricing-${index}-price-error`"
                data-plan-validation-error
                class="field-error"
              >
                {{ validationErrors[`pricing-${index}-price`] }}
              </span>
              <span
                v-if="validationErrors[`pricing-${index}-duration`]"
                :id="`pricing-${index}-duration-error`"
                data-plan-validation-error
                class="field-error"
              >
                {{ validationErrors[`pricing-${index}-duration`] }}
              </span>
              <span
                v-if="validationErrors[`pricing-${index}-duration-type`]"
                :id="`pricing-${index}-duration-type-error`"
                data-plan-validation-error
                class="field-error"
              >
                {{ validationErrors[`pricing-${index}-duration-type`] }}
              </span>
            </div>
          </div>
        </div>
        <div class="trial-section validated-field">
          <div class="trial-heading">
            <span>{{ $t('trial_days') }}</span>
            <ToggleSwitch v-model="hasTrial" :aria-label="$t('has_trial')" />
          </div>
          <input
            v-model.number="trialDays"
            type="number"
            min="0"
            :disabled="!hasTrial"
            :class="{ 'field-invalid': showValidationErrors && validationErrors.trialDays }"
            :aria-invalid="Boolean(showValidationErrors && validationErrors.trialDays)"
            :aria-describedby="
              showValidationErrors && validationErrors.trialDays ? 'trial-days-error' : undefined
            "
          />
          <p
            v-if="showValidationErrors && validationErrors.trialDays"
            id="trial-days-error"
            data-plan-validation-error
            class="field-error"
          >
            {{ validationErrors.trialDays }}
          </p>
        </div>
      </section>

      <section
        v-if="!editSection || editSection === 'features'"
        id="plan-features"
        ref="featuresSection"
        class="plan-section"
      >
        <div class="panel-heading">
          <h3>{{ $t('features') }}</h3>
          <button type="button" class="reset-button" @click="resetFeatures">
            {{ $t('reset') }}
          </button>
        </div>
        <section class="features-section">
          <p
            v-if="showValidationErrors && validationErrors.features"
            data-plan-validation-error
            class="field-error"
          >
            {{ validationErrors.features }}
          </p>
          <article
            v-for="(feature, featureIndex) in planFeatures"
            :key="feature.featureType"
            class="feature-card"
            :class="{
              'edit-selection-inactive': isFeatureEdit && !feature.enabled,
            }"
          >
            <header class="feature-row">
              <span class="feature-number">{{ featureIndex + 1 }}</span>
              <span class="feature-copy">
                <strong>{{ $t(feature.titleKey) }}</strong>
                <small>{{ $t(feature.descriptionKey) }}</small>
              </span>
              <ToggleSwitch v-model="feature.enabled" :aria-label="$t(feature.titleKey)" />
            </header>
            <div v-if="feature.enabled || isFeatureEdit" class="sub-features">
              <div
                v-for="subType in feature.subTypes"
                :key="subType.subType"
                class="feature-row validated-field"
                :class="{
                  'edit-selection-inactive': isFeatureEdit && !subType.enabled,
                }"
              >
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
                  @input="updateLimitSubFeature(subType)"
                />
                <ToggleSwitch v-else v-model="subType.enabled" :aria-label="$t(subType.titleKey)" />
                <span
                  v-if="
                    showValidationErrors &&
                    validationErrors[`feature-${feature.featureType}-limit-${subType.subType}`]
                  "
                  data-plan-validation-error
                  class="field-error feature-limit-error"
                >
                  {{ validationErrors[`feature-${feature.featureType}-limit-${subType.subType}`] }}
                </span>
              </div>
            </div>
          </article>
        </section>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
  :global(.content-wrapper:has(.plan-form)),
  :global(.main-content:has(.plan-form)) {
    overflow-x: clip;
    overflow-y: visible;
  }

  .validated-field input {
    width: 100%;
  }

  .plan-form {
    display: grid;
    gap: var(--xs-size);
    // padding: var(--xl-size-1);
    background: var(--bg-main);
    // border: 1px solid var(--border-weak);
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
    position: sticky;
    z-index: 10;
    top: 0;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-bottom: 1px solid var(--border-weak);
    background: var(--bg-main);
    box-shadow: var(--shadow-sm);

    button {
      min-height: 48px;
      border: 0;
      border-bottom: 3px solid transparent;
      background: transparent;
      color: var(--GrayText);
      cursor: pointer;

      &.active {
        border-color: var(--Black);
        color: var(--Black);
      }
    }
  }

  .plan-sections {
    display: grid;
    gap: var(--xl-size-2);
    padding-top: var(--xl-size-base);
  }

  .plan-section {
    scroll-margin-top: 64px;
    padding-bottom: var(--xl-size-2);
    border-bottom: 1px solid var(--border-weak);

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
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

  .validated-field {
    min-width: 0;
  }

  .pricing-field,
  .pricing-control {
    display: grid;
    min-width: 0;
    gap: var(--xs-size-3);
  }

  .field-error {
    margin: var(--xs-size-3) 0 0;
    color: var(--danger-color);
    font-size: 0.85rem;
  }

  input.field-invalid,
  select.field-invalid {
    border-color: var(--danger-color);
  }

  .feature-limit-error {
    grid-column: 2 / -1;
    justify-self: end;
  }

  .features-section {
    gap: var(--xs-size);
  }

  .feature-card {
    overflow: hidden;
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    background: var(--BgWhite);
    transition: opacity 0.2s ease;
  }

  .feature-card.edit-selection-inactive,
  .sub-features .feature-row.edit-selection-inactive {
    opacity: 0.42;
  }

  .sub-features .feature-row {
    transition: opacity 0.2s ease;
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

  .pricing-row-errors {
    display: grid;
    grid-column: 1 / -1;
    gap: var(--xs-size-3);
  }

  .pricing-row-errors .field-error {
    margin: 0;
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
  :deep(.field-label),
  label,
  .input-label,
  .field-label {
    color: #5d5d5d !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
</style>
