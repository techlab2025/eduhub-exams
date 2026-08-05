<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
import IconClock from '@/shared/icons/iconClock.vue';
import IconFlag from '@/shared/icons/IconFlag.vue';
import IconExam from '@/shared/icons/iconExam.vue';
import IconDurion from '@/shared/icons/iconDurion.vue';
import Iconalert from '@/shared/icons/Iconalert.vue';

  const props = defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();

  const timeItems = computed(() => [
    {
      key: 'start',
      label: t('placement_test.start_time'),
      value: props.placementTest.timeAnalysis?.startTime,
    },
    {
      key: 'end',
      label: t('placement_test.end_time'),
      value: props.placementTest.timeAnalysis?.endTime,
    },
    {
      key: 'exam',
      label: t('placement_test.exam_time'),
      value: props.placementTest.timeAnalysis?.examTime,
    },
    {
      key: 'actual',
      label: t('placement_test.actual_duration'),
      value: props.placementTest.timeAnalysis?.actualDuration,
    },
  ]);
</script>

<template>
  <section class="time-analysis-card" aria-labelledby="time-analysis-title">
    <header class="time-analysis-card__header">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <h2 id="time-analysis-title">{{ t('placement_test.real_time_analysis') }}</h2>
    </header>

    <div class="time-analysis-card__grid">
      <article v-for="item in timeItems" :key="item.key" class="time-analysis-card__item">
        <span >
          <IconClock v-if="item.key === 'start'" />
          <IconFlag v-else-if="item.key === 'end'" />
          <IconExam v-else-if="item.key === 'exam'" />
          <IconDurion v-else-if="item.key === 'actual'" />
        </span>

        <div>
          <span class="time-analysis-card__label">{{ item.label }}</span>
          <strong>{{ item.value || '--' }}</strong>
        </div>
      </article>
    </div>

    <div class="time-analysis-card__passed">
      <div>
        <span>{{ t('placement_test.time_passed') }}</span>
        <strong>{{  props.placementTest.timeAnalysis?.timePassed }} {{ t('min') }}</strong>
      </div>
      <Iconalert />
    </div>
  </section>
</template>

<style scoped lang="scss">
  .time-analysis-card {
    min-width: 0;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;

      > svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: var(--gray-800);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }
    }

    h2 {
      margin: 0;
      color: var(--gray-900);
      font-family: var(--font-family);
      font-size: var(--sm-size);
      font-weight: 700;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 74px;
      padding: 12px;
      background: var(--gray-50);
      border-radius: var(--radius-md);

      > div {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      strong {
        color: var(--table-data-color);
        font-size: var(--md-size);
        font-family: 'demi';
        font-weight: 600;
      }
    }

    &__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 34px;
      width: 34px;
      height: 34px;
      color: var(--info);
      background: var(--info-light);
      border-radius: 50%;

      svg {
        width: 22px;
        height: 22px;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }

      &--end {
        color: var(--success);
        background: var(--success-light);
      }

      &--exam {
        color: var(--gray-700);
        background: var(--gray-200);
      }
    }

    &__label,
    &__passed span {
      color: var(--title-header-color);
      font-size: var(--sm-size);
      font-family: 'medium';
      font-weight: 500;
    }

    &__passed {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 72px;
      margin-top: 14px;
      padding: 20px 14px;
      background: var(--warning-light);
      border: 1px solid rgba(242, 213, 156, 1);
      border-radius: var(--md-size);

      > div {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      strong {
        color: var(--btn-gold);
        font-size: var(--md-size);
        font-family: 'demi';
        font-weight: 600;
      }

      > svg {
        width: 38px;
        height: 38px;
        fill: var(--warning-light);
        stroke: var(--warning);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.8;
      }
    }
  }

  @media (max-width: 640px) {
    .time-analysis-card__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
