<script setup lang="ts">
  import { QuestionGeneratedByEnum } from '@/modules/Questions/core/constant/generatedby.enum';
  import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { questionData } = defineProps<{ questionData: ShowQuestionsModel }>();
  const { t } = useI18n();

  const statusClass = computed(() => {
    switch (questionData.review_status) {
      case QuestionStatusEnum.CREATED:
        return 'status-created';
      case QuestionStatusEnum.APPROVED:
        return 'status-approved';
      case QuestionStatusEnum.REJECTED:
        return 'status-rejected';
      case QuestionStatusEnum.DRAFT:
        return 'status-draft';
      case QuestionStatusEnum.NOT_REVIEW:
        return 'status-under-review';
      case QuestionStatusEnum.ARCHIVED:
        return 'status-archived';
      case QuestionStatusEnum.REVISION:
        return 'status-revision';
      default:
        return 'status-unknown';
    }
  });

  const getStatusLabel = (reviewStatus: QuestionStatusEnum) => {
    switch (reviewStatus) {
      case QuestionStatusEnum.CREATED:
        return t('question_status_details.titles.created');
      case QuestionStatusEnum.APPROVED:
        return t('question_status_details.titles.approved');
      case QuestionStatusEnum.REJECTED:
        return t('question_status_details.titles.rejected');
      case QuestionStatusEnum.DRAFT:
        return t('question_status_details.titles.draft');
      case QuestionStatusEnum.NOT_REVIEW:
        return t('question_status_details.titles.not_review');
      case QuestionStatusEnum.ARCHIVED:
        return t('question_status_details.titles.archived');
      case QuestionStatusEnum.REVISION:
        return t('question_status_details.titles.revision');
      default:
        return t('question_status_details.titles.unknown');
    }
  };

  const getGeneratedByLabel = (from_source_type: QuestionGeneratedByEnum) => {
    switch (from_source_type) {
      case QuestionGeneratedByEnum.manual:
        return t('question_status_card.manual');
      case QuestionGeneratedByEnum.ai:
        return t('question_status_card.ai');
      default:
        return t('question_status_details.titles.unknown');
    }
  };
</script>

<template>
  <div class="question-status-card" :class="statusClass">
    <div class="status-grid">
      <div class="status-item">
        <label>{{ t('question_status_card.status') }}</label>
        <h3>{{ getStatusLabel(questionData?.review_status!) }}</h3>
      </div>

      <div class="status-item">
        <label>{{ t('question_status_card.question_id') }}</label>
        <h3>{{ questionData?.question_id }}</h3>
      </div>

      <div class="status-item">
        <label>{{ t('question_status_card.generated_by') }}</label>
        <h3>{{ getGeneratedByLabel(questionData.from_source_type!) }}</h3>
      </div>

      <div class="status-item">
        <label>{{ t('question_status_card.created_at') }}</label>
        <h3>{{ questionData?.createdAt }}</h3>
      </div>
    </div>
  </div>
</template>
