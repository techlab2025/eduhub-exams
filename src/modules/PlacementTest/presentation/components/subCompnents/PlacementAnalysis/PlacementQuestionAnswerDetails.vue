<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';

  defineProps<{
    question: ShowQuestionsModel;
  }>();

  const { t } = useI18n();
</script>

<template>
  <div class="question-answer-details">
    <p v-if="question.question_description" class="question-answer-details__description">
      {{ question.question_description }}
    </p>

    <div class="question-answer-details__answers">
      <div
        v-for="(answer, index) in question.answers"
        :key="answer.id ?? index"
        class="question-answer-details__answer"
        :class="{ 'question-answer-details__answer--correct': answer.is_right_answer }"
      >
        <div>
          <span>
            {{ t('placement_test.answer_number', { number: index + 1 }) }}
            <b v-if="answer.is_right_answer"> ({{ t('placement_test.correct_answer_label') }}) </b>
          </span>
          <strong>{{ answer.answer ?? '—' }}</strong>
        </div>
        <img
          v-if="answer.image?.[0]?.file"
          :src="answer.image[0].file"
          :alt="answer.image[0].alt ?? answer.answer"
        />
      </div>

      <p v-if="!question.answers?.length" class="question-answer-details__empty">
        {{ t('placement_test.no_answer_data') }}
      </p>
    </div>

    <aside class="question-answer-details__history">
      <h3>{{ t('placement_test.history_log') }}</h3>
      <div class="question-answer-details__history-list">
        <div v-for="(log, index) in question.questionLogHistory" :key="index">
          <time>{{ log.time ?? log.date ?? '—' }}</time>
          <span>
            <strong>{{ log.status ?? '—' }}</strong>
            <small v-if="log.createdBy">{{ log.createdBy }}</small>
          </span>
        </div>

        <p v-if="!question.questionLogHistory?.length" class="question-answer-details__empty">
          {{ t('placement_test.no_history_data') }}
        </p>
      </div>
    </aside>
  </div>
</template>

<style scoped lang="scss">
  .question-answer-details {
    display: grid;
    grid-template-columns: minmax(360px, 1fr) minmax(230px, 0.42fr);
    gap: 16px;
    padding: 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);

    &__description {
      grid-column: 1 / -1;
      margin: 0;
      padding: 0 2px;
      color: var(--gray-600);
      line-height: 1.5;
    }

    &__answers {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__answer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 62px;
      padding: 6px 10px;
      background: var(--gray-50);
      border-radius: var(--radius-sm);

      > div {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 0;

        span {
          color: var(--gray-500);
          font-size: var(--xs-size);

          b {
            color: var(--success);
          }
        }

        strong {
          color: var(--gray-700);
          font-weight: 500;
        }
      }

      img {
        flex: 0 0 56px;
        width: 56px;
        height: 56px;
        object-fit: cover;
        border-radius: var(--radius-sm);
      }

      &--correct {
        background: var(--success-light);
      }
    }

    &__history {
      overflow: hidden;
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-md);

      h3 {
        margin: 0;
        padding: 14px;
        color: var(--gray-900);
        font-size: var(--sm-size);
        border-bottom: 1px dashed var(--border-weak);
      }
    }

    &__history-list {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 220px;
      padding: 14px;
      overflow-y: auto;

      > div {
        position: relative;
        display: grid;
        grid-template-columns: 86px minmax(0, 1fr);
        gap: 14px;
        align-items: center;

        &::before {
          position: absolute;
          top: -16px;
          bottom: -16px;
          inset-inline-start: 94px;
          content: '';
          border-inline-start: 1px solid var(--border-weak);
        }

        time {
          padding: 7px 8px;
          color: var(--gray-600);
          font-size: var(--xs-size);
          text-align: center;
          background: var(--gray-200);
          border-radius: var(--radius-full);
        }

        span {
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-inline-start: 10px;
          background: var(--bg-card);

          strong,
          small {
            color: var(--gray-600);
            font-size: var(--xs-size-2);
            font-weight: 500;
          }
        }
      }
    }

    &__empty {
      margin: 20px 0;
      color: var(--gray-500);
      text-align: center;
    }
  }

  @media (max-width: 820px) {
    .question-answer-details {
      grid-template-columns: 1fr;
    }
  }
</style>
