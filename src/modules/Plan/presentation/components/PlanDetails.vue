<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import ActionsIcon from '@/shared/icons/ActionsIcon.vue';
  import PricingIcon from '@/shared/icons/PricingIcon.vue';
  import PlanController from '../controllers/plan.controller';
  import ShowPlanParams from '../../core/params/show.plan.params';
  import { PlanDurationTypeEnum } from '../../core/enums/plan.duration.enum';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
  import { PLAN_FEATURE_DEFINITIONS } from '../../core/enums/planType.enum';
  import CreatedByIcon from '@/shared/icons/Plan/CreatedByIcon.vue';
  import CreatedDateicon from '@/shared/icons/Plan/CreatedDateicon.vue';
  import LastUpdatedIcon from '@/shared/icons/Plan/LastUpdatedIcon.vue';
  import PlanSucbscripbersIcon from '@/shared/icons/Plan/PlanSucbscripbersIcon.vue';
  import IncludedFeatureIcon from '@/shared/icons/Plan/IncludedFeatureIcon.vue';

  const route = useRoute();
  const router = useRouter();
  const controller = PlanController.getInstance();
  const { locale, t } = useI18n();
  const activeTab = ref<'overview' | 'activity'>('overview');
  const plan = computed(() => controller.itemData.value);

  const formatDate = (value: string) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale.value === 'ar' ? 'ar-EG' : 'en-US').format(value);

  const userInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?';

  const statusLabel = (status: PlanStatusEnum) => {
    if (status === PlanStatusEnum.ACTIVE) return t('active');
    if (status === PlanStatusEnum.deactivated) return t('deactivated');
    if (status === PlanStatusEnum.Archived) return t('archived');
    return t('draft');
  };

  const pricingLabel = (durationType: PlanDurationTypeEnum) => {
    if (durationType === PlanDurationTypeEnum.MONTH) return t('monthly_subscription');
    if (durationType === PlanDurationTypeEnum.YEAR) return t('annual_subscription');
    return t('subscription_price');
  };

  const durationLabel = (duration: number, durationType: PlanDurationTypeEnum) => {
    const keys = {
      [PlanDurationTypeEnum.DAY]: duration === 1 ? 'day' : 'days',
      [PlanDurationTypeEnum.WEEK]: duration === 1 ? 'week' : 'weeks',
      [PlanDurationTypeEnum.MONTH]: duration === 1 ? 'month' : 'months',
      [PlanDurationTypeEnum.YEAR]: duration === 1 ? 'year' : 'years',
    };
    return `${duration} ${t(keys[durationType])}`;
  };

  const featureTitle = (featureId: number, apiTitle: string) => {
    if (apiTitle) return apiTitle;
    const definition = PLAN_FEATURE_DEFINITIONS.find((item) => item.type === featureId);
    return definition ? t(definition.titleKey) : String(featureId);
  };

  const subFeatureTitle = (featureId: number, subFeatureId: number) => {
    const definition = PLAN_FEATURE_DEFINITIONS.find((item) => item.type === featureId);
    const subFeature =
      definition?.subTypes.find((item) => item.type === subFeatureId) ??
      PLAN_FEATURE_DEFINITIONS.flatMap((item) => item.subTypes).find(
        (item) => item.type === subFeatureId,
      );
    return subFeature ? t(subFeature.titleKey) : String(subFeatureId);
  };

  onMounted(() => controller.fetchOne(new ShowPlanParams(Number(route.params.id))));
</script>

<template>
  <main v-if="plan" class="plan-details">
    <section class="plan-summary">
      <div class="summary-heading">
        <div class="title-line">
          <h1>{{ plan.title }}</h1>
          <span class="status-badge" :class="`status-${plan.status}`">
            {{ statusLabel(plan.status) }}
          </span>
          <span v-for="badge in plan.highlightBadges" :key="badge.id" class="highlight-badge">
            {{ badge.title }}
          </span>
        </div>
        <button
          type="button"
          class="icon-button"
          :aria-label="$t('edit_plan')"
          :title="$t('edit_plan')"
          @click="router.push(`/plans/edit/${route.params.id}`)"
        >
          <ActionsIcon />
        </button>
      </div>

      <dl class="summary-meta">
        <div>
          <span class="meta-icon"><CreatedByIcon /></span>
          <dt>{{ $t('created_by') }}</dt>
          <dd>{{ plan.createdBy.title || '--' }}</dd>
        </div>
        <div>
          <span class="meta-icon"><CreatedDateicon /></span>
          <dt>{{ $t('created_date') }}</dt>
          <dd>{{ formatDate(plan.createdAt) }}</dd>
        </div>
        <div>
          <span class="meta-icon"><LastUpdatedIcon /></span>
          <dt>{{ $t('last_updated') }}</dt>
          <dd>{{ formatDate(plan.lastUpdateAt) }}</dd>
        </div>
        <div>
          <span class="meta-icon"><PlanSucbscripbersIcon /></span>
          <dt>{{ $t('subscribers') }}</dt>
          <dd>{{ formatNumber(plan.subscribers) }}</dd>
        </div>
      </dl>
    </section>

    <nav class="details-tabs" :aria-label="$t('plan_details_sections')">
      <button
        type="button"
        :class="{ active: activeTab === 'overview' }"
        @click="activeTab = 'overview'"
      >
        {{ $t('overview') }}
      </button>
      <button
        type="button"
        :class="{ active: activeTab === 'activity' }"
        @click="activeTab = 'activity'"
      >
        {{ $t('activity_log') }}
      </button>
    </nav>

    <template v-if="activeTab === 'overview'">
      <section class="details-section pricing-details">
        <header class="section-heading">
          <PricingIcon />
          <h2>{{ $t('pricing_details') }}</h2>
        </header>
        <div class="pricing-grid">
          <dl v-for="(item, index) in plan.pricing" :key="index" class="pricing-item">
            <dt>{{ pricingLabel(item.durationType) }}</dt>
            <dd>
              {{ formatNumber(item.price) }} {{ $t('currency_egp') }} /
              {{ durationLabel(item.duration, item.durationType) }}
            </dd>
          </dl>
          <dl class="pricing-item">
            <dt>{{ $t('trial_period') }}</dt>
            <dd>{{ plan.trialDays }} {{ $t(plan.trialDays === 1 ? 'day' : 'days') }}</dd>
          </dl>
        </div>
      </section>

      <section class="details-section included-features">
        <header class="section-heading">
          <IncludedFeatureIcon />
          <h2>{{ $t('included_features') }}</h2>
        </header>
        <div class="feature-groups">
          <article v-for="feature in plan.features" :key="feature.featureId" class="feature-group">
            <h3>{{ featureTitle(feature.featureId, feature.featureTitle) }}</h3>
            <div class="sub-feature-list">
              <span
                v-for="subFeature in feature.subFeatures.filter((item) => item.status)"
                :key="subFeature.id"
                class="sub-feature"
              >
                {{ subFeatureTitle(feature.featureId, subFeature.id) }}
                <strong v-if="subFeature.limit > 0">{{ subFeature.limit }}</strong>
              </span>
            </div>
          </article>
        </div>
      </section>
    </template>

    <section v-else class="activity-log">
      <ol v-if="plan.activeLog.length" class="activity-list">
        <li v-for="(activity, index) in plan.activeLog" :key="`${activity.user.id}-${index}`">
          <span class="activity-dot" aria-hidden="true"></span>
          <article class="activity-entry">
            <header class="activity-user">
              <span class="activity-avatar" aria-hidden="true">
                {{ userInitials(activity.user.name) }}
              </span>
              <strong>{{ activity.user.name }}</strong>
              <time>{{ formatDate(activity.date) }}</time>
            </header>
            <p>{{ activity.text }}</p>
          </article>
        </li>
      </ol>
      <p v-else class="empty-activity">{{ $t('no_activity_log') }}</p>
    </section>
  </main>
</template>

<style scoped lang="scss">
  .plan-details {
    display: grid;
    gap: var(--xl-size-base);
    color: var(--Black);
  }

  .plan-summary,
  .details-section {
    background: var(--BgWhite);
    border: 1px solid var(--border-weak);
  }

  .plan-summary {
    overflow: hidden;
    border-radius: var(--radius-lg);
  }

  .summary-heading {
    min-height: 64px;
    padding: var(--xl-size-base);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--xs-size);
  }

  .title-line {
    min-width: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--xs-size);

    h1 {
      margin: 0;
      font-size: 1.1rem;
      letter-spacing: 0;
    }
  }

  .status-badge,
  .highlight-badge,
  .sub-feature {
    padding: 5px 12px;
    border-radius: var(--radius-full);
    font-size: 0.78rem;
  }

  .status-badge {
    color: var(--SecondText);
    background: var(--gray-100);
  }

  .status-1 {
    color: var(--primary-green);
    background: var(--success-light);
  }

  .highlight-badge {
    color: var(--blue-primary);
    background: var(--info-light);
  }

  .icon-button {
    flex: 0 0 38px;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
    background: var(--BgWhite);
    cursor: pointer;
  }

  .summary-meta {
    margin: 0;
    padding: 0 var(--xl-size-base) var(--xl-size-base);
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));

    > div {
      min-width: 0;
      padding-inline: var(--xs-size);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 2px var(--xs-size-3);
      border-inline-end: 1px solid var(--border-weak);

      &:last-child {
        border-inline-end: 0;
      }
    }

    dt {
      color: var(--GrayText);
      font-size: 0.75rem;
    }

    dd {
      grid-column: 2;
      margin: 0;
      overflow-wrap: anywhere;
      font-size: 0.82rem;
      font-weight: 600;
    }
  }

  .meta-icon {
    grid-row: 1 / 3;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    color: var(--primary-green);
    background: var(--success-light);
    border-radius: var(--radius-md);
    margin-block: auto;
  }

  .details-tabs {
    min-height: 48px;
    padding-inline: var(--xl-size-base);
    display: flex;
    gap: var(--xl-size-2);
    border-bottom: 4px solid var(--gray-100);

    button {
      min-width: 110px;
      margin-bottom: -4px;
      border: 0;
      border-bottom: 4px solid transparent;
      color: var(--GrayText);
      background: transparent;
      cursor: pointer;

      &.active {
        color: var(--primary-green);
        border-color: var(--primary-green);
      }
    }
  }

  .details-section {
    padding: var(--xl-size-base);
    border-inline-start: 3px solid var(--primary-green);
    border-radius: var(--radius-lg);
  }

  .section-heading {
    min-height: 34px;
    display: flex;
    align-items: center;
    gap: var(--xs-size-3);
    border-bottom: 1px solid var(--border-weak);

    h2 {
      margin: 0;
      font-size: 0.95rem;
      letter-spacing: 0;
    }
  }

  .pricing-grid {
    padding-top: var(--xs-size);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--xs-size);
  }

  .pricing-item {
    min-width: 0;
    margin: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--xs-size-3);

    dt {
      color: var(--GrayText);
    }

    dd {
      min-width: 0;
      margin: 0;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
  }

  .features-mark {
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border: 1px solid var(--Black);
    border-radius: var(--radius-md);
    font-size: 0.75rem;
  }

  .feature-groups {
    padding-top: var(--xs-size);
    display: grid;
    gap: var(--xs-size);
  }

  .feature-group {
    padding: var(--xs-size) var(--xl-size-base);
    background: var(--BgWhite);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);

    h3 {
      margin: 0;
      padding-bottom: var(--xs-size);
      border-bottom: 1px dashed var(--border-weak);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0;
    }
  }

  .sub-feature-list {
    padding-top: var(--xs-size);
    display: flex;
    flex-wrap: wrap;
    gap: var(--xs-size-3);
  }

  .sub-feature {
    color: var(--SecondText);
    background: var(--gray-100-std);
    line-height: 1.2;

    strong {
      margin-inline-start: 4px;
    }
  }

  .included-features {
    background: var(--gray-50-std);
    border: 0;
    border-inline-start: 2px solid var(--primary-green);
    border-radius: var(--radius-sm);
  }

  .activity-log {
    min-width: 0;
  }

  .activity-list {
    position: relative;
    margin: 0;
    padding: 0;
    padding-block-start: var(--xs-size);
    padding-inline-start: var(--xl-size-2);
    list-style: none;

    &::before {
      position: absolute;
      inset-inline-start: 6px;
      top: 0;
      bottom: var(--xl-size-base);
      width: 1px;
      content: '';
      background: var(--border-weak);
    }

    li {
      position: relative;
      padding: 0 0 var(--xl-size-base);

      &:last-child {
        padding-bottom: 0;
      }
    }
  }

  .activity-dot {
    position: absolute;
    z-index: 1;
    inset-inline-start: calc(1px - var(--xl-size-2));
    top: 13px;
    width: 11px;
    height: 11px;
    border: 1px solid var(--primary-green);
    background: var(--BgWhite);
    border-radius: var(--radius-full);
  }

  .activity-list li:first-child .activity-dot {
    background: var(--primary-green);
    box-shadow: 0 0 0 4px var(--success-light);
  }

  .activity-entry {
    min-height: 72px;
    padding: var(--xs-size);
    border-inline-start: 2px solid var(--primary-green);
    border-radius: var(--radius-md);
    background: var(--gray-50);

    p {
      margin: var(--xs-size-3) 0 0;
      color: var(--SecondText);
      font-size: 0.8rem;
      overflow-wrap: anywhere;
    }
  }

  .activity-user {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--xs-size-3);

    strong {
      font-size: 0.82rem;
    }

    time {
      color: var(--GrayText);
      font-size: 0.75rem;
    }
  }

  .activity-avatar {
    width: 28px;
    height: 28px;
    display: grid;
    flex: 0 0 28px;
    place-items: center;
    color: var(--primary-green);
    background: var(--success-light);
    border-radius: var(--radius-full);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .empty-activity {
    margin: var(--xl-size-base) 0 0;
    color: var(--GrayText);
  }

  @media (max-width: 768px) {
    .summary-meta,
    .pricing-grid {
      grid-template-columns: 1fr;
    }

    .summary-meta {
      gap: var(--xs-size);

      > div {
        padding: 0;
        border-inline-end: 0;
      }
    }

    .details-tabs {
      padding-inline: 0;
      gap: 0;

      button {
        flex: 1;
        min-width: 0;
      }
    }

    .pricing-item {
      grid-template-columns: 1fr;
    }

    .activity-list {
      padding-inline-start: var(--xl-size-base);
    }

    .activity-dot {
      inset-inline-start: calc(1px - var(--xl-size-base));
    }
  }
</style>
