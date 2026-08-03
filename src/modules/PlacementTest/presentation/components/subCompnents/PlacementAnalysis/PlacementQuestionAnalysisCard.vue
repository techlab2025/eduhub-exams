<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
  import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import PlacementQuestionAnswerDetails from './PlacementQuestionAnswerDetails.vue';

  defineProps<{
    question: ShowQuestionsModel;
    number: number;
    duration?: number;
  }>();

  const { t } = useI18n();
  const expanded = ref(false);

  function getQuestionType(type?: number): string {
    if (type === QuestionTypeEnum.mcq) return t('placement_test.question_type_mcq');
    if (type === QuestionTypeEnum.true_false) {
      return t('placement_test.question_type_true_false');
    }
    if (type === QuestionTypeEnum.complate) return t('placement_test.question_type_complete');
    if (type === QuestionTypeEnum.matching) return t('placement_test.question_type_matching');
    if (type === QuestionTypeEnum.paragraph) return t('placement_test.question_type_paragraph');
    if (type === QuestionTypeEnum.ranking) return t('placement_test.question_type_ranking');
    return t('placement_test.question_type_unknown');
  }

  function getDifficulty(difficulty?: number): string {
    if (difficulty === QuestionDifficultyEnum.easy) return t('placement_test.easy');
    if (difficulty === QuestionDifficultyEnum.medium) return t('placement_test.medium');
    if (difficulty === QuestionDifficultyEnum.hard) return t('placement_test.hard');
    return '—';
  }

  function formatDuration(duration?: number): string {
    if (duration === undefined) return '—';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    if (!minutes) return t('placement_test.seconds_value', { value: seconds });
    return `${minutes}${t('placement_test.min')} : ${seconds}${t('placement_test.seconds_short')}`;
  }
</script>

<template>
  <article
    class="question-analysis-card"
    :class="{
      'question-analysis-card--correct': question.correctStatus === 1,
      'question-analysis-card--wrong': question.correctStatus === 0,
    }"
  >
    <span class="question-analysis-card__number">{{ number }}</span>

    <div class="question-analysis-card__content">
      <div class="question-analysis-card__meta">
        <span>{{ getQuestionType(question.questionType) }}</span>
        <span>{{ getDifficulty(question.difficulty) }}</span>
      </div>
      <strong>{{ question.questionTitle ?? question.question ?? '—' }}</strong>
    </div>

    <div class="question-analysis-card__metric">
      <span>{{ t('placement_test.question_time') }}</span>
      <strong>{{ formatDuration(duration) }}</strong>
    </div>

    <div class="question-analysis-card__metric">
      <span>{{ t('placement_test.hesitation') }}</span>
      <strong>{{ question.note ?? '—' }}</strong>
    </div>

    <button
      class="question-analysis-card__toggle"
      type="button"
      :aria-expanded="expanded"
      :aria-label="t('placement_test.question_details')"
      @click="expanded = !expanded"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m7 10 5 5 5-5" />
      </svg>
    </button>

    <PlacementQuestionAnswerDetails
      v-if="expanded"
      class="question-analysis-card__details"
      :question="question"
    />
  </article>
</template>

<style scoped lang="scss">
  .question-analysis-card {
    display: grid;
    grid-template-columns: 42px minmax(280px, 1fr) 110px 110px 34px;
    gap: 12px;
    align-items: center;
    min-height: 92px;
    padding: 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    &--correct &__number {
      background: var(--success-light);
      border-color: var(--PrimaryColor-alpha-40);
    }

    &--wrong &__number {
      background: var(--danger-light);
      border-color: var(--danger-alpha-15);
    }

    &__number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      color: var(--gray-800);
      font-weight: 700;
      border: 2px solid var(--border-weak);
      border-radius: var(--radius-md);
    }

    &__content {
      min-width: 0;

      > strong {
        display: block;
        margin-top: 7px;
        color: var(--gray-700);
        font-size: var(--sm-size);
        font-weight: 500;
        line-height: 1.4;
      }
    }

    &__meta {
      display: flex;
      gap: 22px;
      color: var(--info);
      font-size: var(--xs-size);

      span {
        position: relative;
        padding-inline-start: 10px;

        &::before {
          position: absolute;
          top: 50%;
          inset-inline-start: 0;
          width: 6px;
          height: 6px;
          content: '';
          background: currentColor;
          border-radius: 50%;
          transform: translateY(-50%);
        }
      }

      span:last-child {
        color: var(--danger);
      }
    }

    &__details {
      grid-column: 1 / -1;
      margin-top: 2px;
    }

    &__metric {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 7px;
      padding-inline: 8px;
      text-align: center;
      border-inline-start: 1px solid var(--border-weak);

      span {
        color: var(--gray-500);
        font-size: var(--xs-size);
      }

      strong {
        color: var(--gray-700);
        font-size: var(--xs-size);
      }
    }

    &__toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: var(--gray-400);
      cursor: pointer;
      background: var(--bg-card);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-sm);

      svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.5;
        transition: transform 0.2s ease;
      }

      &[aria-expanded='true'] svg {
        transform: rotate(180deg);
      }
    }
  }

  @media (max-width: 820px) {
    .question-analysis-card {
      grid-template-columns: 42px minmax(0, 1fr) 34px;

      &__metric {
        display: none;
      }
    }
  }
</style>
