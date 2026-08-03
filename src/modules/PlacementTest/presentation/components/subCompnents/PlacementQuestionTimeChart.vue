<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { PlacementDifficultyLevelEnum } from '@/modules/PlacementTest/core/constant/placement.difficulty.level.enum';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';

  type Difficulty = 'easy' | 'medium' | 'hard' | 'unknown';

  const props = defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();

  const yAxisTicks = [50, 40, 30, 20, 10, 0];

  const allocation = computed(() => props.placementTest.allocation);
  const bars = computed(() => allocation.value?.allTime ?? []);

  function getDifficulty(difficulty?: number): Difficulty {
    if (difficulty === PlacementDifficultyLevelEnum.easy) return 'easy';
    if (difficulty === PlacementDifficultyLevelEnum.medium) return 'medium';
    if (difficulty === PlacementDifficultyLevelEnum.hard) return 'hard';
    return 'unknown';
  }
</script>

<template>
  <section class="question-time-chart" aria-labelledby="question-time-chart-title">
    <header class="question-time-chart__header">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <h2 id="question-time-chart-title">
        {{ t('placement_test.time_allocation_each_question') }}
      </h2>
    </header>

    <div v-if="bars.length" class="question-time-chart__scroll">
      <div class="question-time-chart__visual">
        <div class="question-time-chart__y-axis" aria-hidden="true">
          <span v-for="tick in yAxisTicks" :key="tick">
            {{ tick }}<small>{{ t('placement_test.seconds_short') }}</small>
          </span>
        </div>

        <div class="question-time-chart__plot">
          <div class="question-time-chart__grid-lines" aria-hidden="true">
            <span v-for="tick in yAxisTicks" :key="tick"></span>
          </div>

          <div class="question-time-chart__bars">
            <div
              v-for="(bar, index) in bars"
              :key="bar.questionNumber ?? index"
              class="question-time-chart__column"
              role="img"
              :aria-label="
                t('placement_test.question_time_label', {
                  number: bar.questionNumber ?? index + 1,
                  seconds: bar.time,
                })
              "
            >
              <div class="question-time-chart__bar-track">
                <div
                  class="question-time-chart__bar"
                  :class="`question-time-chart__bar--${getDifficulty(bar.difficultyLevel)}`"
                  :style="{ '--question-time': bar.time ?? 0 }"
                >
                  <span
                    v-if="bar.correctStatus !== undefined"
                    class="question-time-chart__answer-status"
                    :class="{
                      'question-time-chart__answer-status--correct': bar.correctStatus === 1,
                    }"
                    aria-hidden="true"
                  >
                    {{ bar.correctStatus === 1 ? '✓' : '×' }}
                  </span>
                </div>
              </div>

              <span class="question-time-chart__question-label">
                {{
                  t('placement_test.question_number_short', {
                    number: bar.questionNumber ?? index + 1,
                  })
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="question-time-chart__empty">
      {{ t('placement_test.no_question_time_data') }}
    </p>

    <div class="question-time-chart__summary">
      <h3>{{ t('placement_test.questions_answered_difficulty') }}</h3>

      <div class="question-time-chart__answer-key">
        <span><b>✓</b> {{ t('placement_test.correct') }}</span>
        <span><b>×</b> {{ t('placement_test.wrong') }}</span>
      </div>

      <div class="question-time-chart__difficulty-list">
        <div class="question-time-chart__difficulty question-time-chart__difficulty--easy">
          <span>{{ t('placement_test.easy') }}</span>
          <strong
            ><b>{{ allocation?.Easy ?? 0 }}</b> / {{ allocation?.totalnumberEasy ?? 0 }}</strong
          >
        </div>
        <div class="question-time-chart__difficulty question-time-chart__difficulty--medium">
          <span>{{ t('placement_test.medium') }}</span>
          <strong
            ><b>{{ allocation?.Medium ?? 0 }}</b> / {{ allocation?.totalnumberMedium ?? 0 }}</strong
          >
        </div>
        <div class="question-time-chart__difficulty question-time-chart__difficulty--hard">
          <span>{{ t('placement_test.hard') }}</span>
          <strong
            ><b>{{ allocation?.Hard ?? 0 }}</b> / {{ allocation?.totalnumberHard ?? 0 }}</strong
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .question-time-chart {
    width: 100%;
    padding: 18px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;

      svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: var(--gray-800);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.6;
      }
    }

    h2,
    h3 {
      margin: 0;
      color: var(--table-header-color);
      font-family: 'demi';
      font-weight: 600;
    }

    h2 {
      font-size: var(--md-size-2); 
    }

    h3 {
      font-size: var(--md-size-2);
      text-align: center;
    }

    &__scroll {
      width: 100%;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    &__visual {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr);
      height: 280px;
      min-width: 720px;
      padding-bottom: 34px;
    }

    &__y-axis {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-direction: column;
      height: 100%;
      padding-inline-end: 8px;

      span {
        color: var(--gray-700);
        font-size: var(--xs-size);
        line-height: 1;
        transform: translateY(50%);
      }

      small {
        margin-inline-start: 2px;
        color: var(--gray-500);
        font-size: var(--xs-size-3);
      }
    }

    &__plot {
      position: relative;
      height: 100%;
    }

    &__grid-lines {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      span {
        width: 100%;
        border-top: 1px dashed var(--border-weak);
      }
    }

    &__bars {
      position: absolute;
      inset: 0;
      display: flex;
      gap: 12px;
      padding-inline: 8px;
    }

    &__column {
      display: grid;
      flex: 1 0 28px;
      grid-template-rows: minmax(0, 1fr) 30px;
      min-width: 0;
    }

    &__bar-track {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      min-height: 0;
    }

    &__bar {
      position: relative;
      width: 16px;
      height: clamp(3%, calc(var(--question-time) * 2%), 100%);
      min-height: 16px;
      background: var(--gray-300);
      border-radius: var(--radius-full);

      &--easy {
        background: var(--PrimaryColor-alpha-40);
      }

      &--medium {
        background: rgba(242, 213, 156, 1);
        box-shadow: inset 0 0 0 20px var(--warning-light-alpha-50);
      }

      &--hard {
        background: var(--danger-alpha-15);
        box-shadow: inset 0 0 0 20px var(--danger-alpha-15);
      }
    }

    &__answer-status {
      position: absolute;
      bottom: 1px;
      left: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      color: var(--danger);
      font-size: var(--xs-size-3);
      font-weight: 700;
      background: var(--bg-card);
      border: 1px solid white;
      border-radius: 50%;
      transform: translateX(-50%);

      &--correct {
        color: black;
      }
    }

    &__question-label {
      align-self: end;
      color: var(--gray-700);
      font-size: var(--xs-size);
      text-align: center;
    }

    &__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      margin: 0;
      color: var(--gray-500);
    }

    &__summary {
      margin-top: 18px;
      padding: 18px;
      background: var(--gray-50);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-md);
    }

    &__answer-key {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 38px;
      margin: 18px 0;
      color: var(--gray-700);

      span {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      b {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        color: var(--color-gray-soft-1);
        font-size: var(--xs-size-2);
        font-family: 'medium';
        font-weight: 500;
        background: var(--bg-card);
        border-radius: 50%;
      }
    }

    &__difficulty-list {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 64px;
    }

    &__difficulty {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--color-gray-soft-1);
      font-size: var(--md-size-2);
      font-weight: 500;
      font-family: 'medium';

      > span::before {
        display: inline-block;
        width: 11px;
        height: 11px;
        margin-inline-end: 7px;
        content: '';
        background: var(--gray-300);
        border-radius: 50%;
      }

      strong {
        padding: 6px 12px;
        font-size: var(--xs-size);
        font-weight: 500;
        background: var(--bg-card);
        border: 1px solid var(--border-weak);
        border-radius: var(--radius-md);
      }

      b {
        color: var(--gray-700);
      }

      &--easy {
        > span::before {
          background: var(--PrimaryColor-alpha-40);
        }

        b {
          color: var(--success);
        }
      }

      &--medium {
        > span::before {
          background: var(--warning-light-alpha-50);
          box-shadow: inset 0 0 0 10px var(--warning-light-alpha-50);
        }

        b {
          color: var(--btn-gold);
        }
      }

      &--hard {
        > span::before {
          background: var(--danger-alpha-15);
          box-shadow: inset 0 0 0 10px var(--danger-alpha-15);
        }

        b {
          color: var(--danger);
        }
      }
    }
  }

  @media (max-width: 640px) {
    .question-time-chart {
      padding: 14px;

      &__summary {
        padding: 14px;
      }

      &__difficulty-list {
        align-items: stretch;
        flex-direction: column;
        gap: 12px;
      }

      &__difficulty {
        justify-content: space-between;
      }
    }
  }
</style>
