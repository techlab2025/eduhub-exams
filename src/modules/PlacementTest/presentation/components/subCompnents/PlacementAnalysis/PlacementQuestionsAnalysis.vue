<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import type ShowPlcaementTestModel from '@/modules/PlacementTest/core/models/show.placement.test.model';
  import PlacementQuestionAnalysisCard from './PlacementQuestionAnalysisCard.vue';

  const props = defineProps<{
    placementTest: ShowPlcaementTestModel;
  }>();

  const { t } = useI18n();

  function getDuration(question: ShowQuestionsModel, index: number): number | undefined {
    const questionId = question.id ?? question.question_id;
    const matchingAnalysis = props.placementTest.questionAnswerAnalysis?.find(
      (item) => item.question?.id === questionId,
    );
    return (
      matchingAnalysis?.questionAnswerDuration ??
      props.placementTest.questionAnswerAnalysis?.[index]?.questionAnswerDuration
    );
  }
</script>

<template>
  <div
    id="placement-questions-panel"
    class="questions-analysis"
    role="tabpanel"
    aria-labelledby="placement-questions-tab"
  >
    <h2>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        />
        <path d="M10 9a2 2 0 1 1 2 2v1m0 2h.01" />
      </svg>
      {{ t('placement_test.questions') }}
    </h2>

    <div class="questions-analysis__list">
      <template v-for="(question, index) in placementTest.quesions" :key="question.id ?? index">
        <article v-if="question.questions?.length" class="questions-analysis__article-group">
          <h3>
            <span>{{ index + 1 }}</span>
            {{ t('placement_test.article_question') }}
          </h3>

          <div class="questions-analysis__article-info">
            <small>{{ t('placement_test.article_id') }}: {{ question.id ?? '—' }}</small>
            <strong>{{ question.questionTitle ?? question.question ?? '—' }}</strong>
            <p>{{ question.question_description ?? '—' }}</p>
            <span>
              {{ t('placement_test.number_questions') }}:
              <b>{{ question.number_of_questions ?? question.questions.length }}</b>
            </span>
          </div>

          <PlacementQuestionAnalysisCard
            v-for="(childQuestion, childIndex) in question.questions"
            :key="childQuestion.id ?? childIndex"
            :question="childQuestion"
            :number="childIndex + 1"
            :duration="getDuration(childQuestion, childIndex)"
          />
        </article>

        <PlacementQuestionAnalysisCard
          v-else
          :question="question"
          :number="index + 1"
          :duration="getDuration(question, index)"
        />
      </template>

      <p v-if="!placementTest.quesions?.length" class="questions-analysis__empty">
        {{ t('placement_test.no_questions_data') }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .questions-analysis {
    padding: 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-xl);

    > h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 64px;
      margin: 0 0 22px;
      padding: 0 16px;
      color: var(--gray-800);
      font-family: var(--font-family);
      font-size: var(--md-size);
      background: var(--gray-200);
      border-radius: var(--radius-md);

      svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.5;
      }
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__article-group {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px;
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-lg);

      > h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        color: var(--gray-900);
        font-size: var(--md-size);

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 2px solid var(--border-weak);
          border-radius: var(--radius-md);
        }
      }
    }

    &__article-info {
      display: flex;
      flex-direction: column;
      gap: 9px;
      padding: 14px;
      color: var(--gray-600);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);

      small {
        color: var(--gray-500);
      }

      > strong {
        color: var(--gray-900);
        font-size: var(--md-size);
      }

      p {
        margin: 0;
        line-height: 1.5;
      }

      > span {
        margin-top: 6px;
        color: var(--gray-500);

        b {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          min-height: 24px;
          margin-inline-start: 6px;
          color: var(--success);
          background: var(--success-light);
          border-radius: var(--radius-xs);
        }
      }
    }

    &__empty {
      padding: 60px 0;
      color: var(--gray-500);
      text-align: center;
    }
  }
</style>
