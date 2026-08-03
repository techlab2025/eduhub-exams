<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import AnalysisIcon from '@/shared/icons/AnalysisIcon.vue';
  import { PlacementTotalRateEnum } from '@/modules/PlacementTest/core/constant/placment.total.rate.enum';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';

  const props = defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();

  const correct = computed(() => props.placementTest.resultAnalysis?.correct ?? 0);
  const wrong = computed(() => props.placementTest.resultAnalysis?.wrong ?? 0);
  const skipped = computed(() => props.placementTest.resultAnalysis?.Skipped ?? 0);
  const totalQuestions = computed(() => correct.value + wrong.value + skipped.value);
  const resultPercentage = computed(() => {
    const percentage = props.placementTest.resultAnalysis?.precentage ?? props.placementTest.result;
    if (percentage !== undefined) return Math.min(100, Math.max(0, percentage));
    if (!totalQuestions.value) return 0;
    return Math.round((correct.value / totalQuestions.value) * 100);
  });

  const correctPercentage = computed(() => getSegmentPercentage(correct.value));
  const wrongPercentage = computed(() => getSegmentPercentage(wrong.value));
  const skippedPercentage = computed(() => getSegmentPercentage(skipped.value));

  const rateLabel = computed(() => {
    const rate = props.placementTest.resultAnalysis?.totalRate;
    return rate === PlacementTotalRateEnum.excellent
      ? t('placement_test.excellent')
      : t('placement_test.good');
  });

  function getSegmentPercentage(value: number): number {
    if (!totalQuestions.value) return 0;
    return (value / totalQuestions.value) * 100;
  }
</script>

<template>
  <section class="result-analysis-card" aria-labelledby="result-analysis-title">
    <header class="result-analysis-card__header">
      <div class="result-analysis-card__title">
        <AnalysisIcon aria-hidden="true" />
        <h2 id="result-analysis-title">{{ t('placement_test.response_performance') }}</h2>
      </div>
      <span class="result-analysis-card__rate">{{ rateLabel }}</span>
    </header>

    <div
      class="result-analysis-card__chart"
      role="img"
      :aria-label="t('placement_test.result_percentage', { percentage: resultPercentage })"
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="result-analysis-card__track" cx="60" cy="60" r="48" pathLength="100" />
        <circle
          class="result-analysis-card__segment result-analysis-card__segment--correct"
          cx="60"
          cy="60"
          r="48"
          pathLength="100"
          :stroke-dasharray="`${correctPercentage} ${100 - correctPercentage}`"
        />
        <circle
          class="result-analysis-card__segment result-analysis-card__segment--wrong"
          cx="60"
          cy="60"
          r="48"
          pathLength="100"
          :stroke-dasharray="`${wrongPercentage} ${100 - wrongPercentage}`"
          :stroke-dashoffset="-correctPercentage"
        />
        <circle
          class="result-analysis-card__segment result-analysis-card__segment--skipped"
          cx="60"
          cy="60"
          r="48"
          pathLength="100"
          :stroke-dasharray="`${skippedPercentage} ${100 - skippedPercentage}`"
          :stroke-dashoffset="-(correctPercentage + wrongPercentage)"
        />
      </svg>

      <div class="result-analysis-card__score">
        <span>{{ t('placement_test.result') }}</span>
        <strong>{{ resultPercentage }}%</strong>
        <small>{{ correct }} / {{ totalQuestions }}</small>
      </div>
    </div>

    <div class="result-analysis-card__stats">
      <div class="result-analysis-card__stat result-analysis-card__stat--correct">
        <span>{{ t('placement_test.correct') }}</span>
        <strong>{{ correct }} {{ t('placement_test.question_short') }}</strong>
      </div>
      <div class="result-analysis-card__stat result-analysis-card__stat--wrong">
        <span>{{ t('placement_test.wrong') }}</span>
        <strong>{{ wrong }} {{ t('placement_test.question_short') }}</strong>
      </div>
      <div class="result-analysis-card__stat result-analysis-card__stat--skipped">
        <span>{{ t('placement_test.skipped') }}</span>
        <strong>{{ skipped }} {{ t('placement_test.question_short') }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .result-analysis-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    &__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    &__title {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    h2 {
      max-width: 170px;
      margin: 0;
      color: var(--gray-900);
      font-family: var(--font-family);
      font-size: var(--sm-size);
      font-weight: 700;
      line-height: 1.5;
    }

    &__rate {
      padding: 7px 14px;
      color: var(--success);
      font-size: var(--xs-size);
      font-weight: 600;
      background: var(--success-light);
      border-radius: var(--radius-full);
    }

    &__chart {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 10px auto 12px;

      svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
    }

    &__track,
    &__segment {
      fill: none;
      stroke-width: 12;
    }

    &__track {
      stroke: var(--gray-100);
    }

    &__segment {
      stroke-linecap: butt;

      &--correct {
        stroke: var(--PrimaryColor-alpha-50);
      }

      &--wrong {
        stroke: var(--danger-alpha-15);
      }

      &--skipped {
        stroke: var(--gray-300);
      }
    }

    &__score {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--gray-600);

      span,
      small {
        font-size: var(--xs-size-2);
      }

      strong {
        margin: 2px 0;
        color: var(--gray-900);
        font-family: var(--font-family);
        font-size: var(--xl-size-base);
      }
    }

    &__stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: auto;
    }

    &__stat {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 8px;
      padding: 10px 6px;
      text-align: center;
      background: var(--gray-50);
      border-radius: var(--radius-sm);

      span {
        color: var(--gray-600);
        font-size: var(--xs-size-2);

        &::before {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-inline-end: 5px;
          content: '';
          background: var(--gray-300);
          border-radius: 2px;
        }
      }

      strong {
        color: var(--gray-700);
        font-size: var(--xs-size);
      }

      &--correct span::before {
        background: var(--PrimaryColor-alpha-50);
      }

      &--wrong span::before {
        background: var(--danger-alpha-15);
      }
    }
  }

  @media (max-width: 420px) {
    .result-analysis-card__stats {
      grid-template-columns: 1fr;
    }
  }
</style>
