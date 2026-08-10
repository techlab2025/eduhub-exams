<script setup lang="ts">
  import FaqImg from '@/assets/images/faq-image.png';
  import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
  import EditIcon from '@/shared/icons/Privacy/EditIcon.vue';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import { useRoute, useRouter } from 'vue-router';
  import questionsController from '../../controllers/questions.controller';
  import DeletequestionsParams from '@/modules/Questions/core/params/delete.question.params';
  import RevisionQuestion from '../Dialogs/RevisionQuestion.vue';
  import ToggleQuestionStatusParams from '@/modules/Questions/core/params/question.toggle.status.params.ts';
  import { useI18n } from 'vue-i18n';
  import UnArchiveDialog from '../Dialogs/unArchiveDialog.vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import ArchiveDialog from '../Dialogs/ArchiveDialog.vue';
  import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue';

  const { questionData } = defineProps<{ questionData: ShowQuestionsModel }>();
  const router = useRouter();
  const { t } = useI18n();

  const id = router.currentRoute.value.params.id;

  const getStatusText = (reviewStatus: QuestionStatusEnum) => {
    switch (reviewStatus) {
      case QuestionStatusEnum.CREATED:
        return t('question_status_details.titles.created');
      case QuestionStatusEnum.NOT_REVIEW:
        return t('question_status_details.titles.not_review');
      case QuestionStatusEnum.APPROVED:
        return t('question_status_details.titles.approved');
      case QuestionStatusEnum.REJECTED:
        return t('question_status_details.titles.rejected');
      case QuestionStatusEnum.DRAFT:
        return t('question_status_details.titles.draft');
      case QuestionStatusEnum.ARCHIVED:
        return t('question_status_details.titles.archived');
      case QuestionStatusEnum.REVISION:
        return t('question_status_details.titles.revision');
      default:
        return t('question_status_details.titles.unknown');
    }
  };

  const getStatusDescription = (reviewStatus: QuestionStatusEnum) => {
    switch (reviewStatus) {
      case QuestionStatusEnum.CREATED:
        return t('question_status_details.descriptions.created');
      case QuestionStatusEnum.NOT_REVIEW:
        return t('question_status_details.descriptions.not_review');
      case QuestionStatusEnum.REJECTED:
        return t('question_status_details.descriptions.rejected');
      case QuestionStatusEnum.APPROVED:
        return t('question_status_details.descriptions.approved');
      case QuestionStatusEnum.DRAFT:
        return t('question_status_details.descriptions.draft');
      case QuestionStatusEnum.ARCHIVED:
        return t('question_status_details.descriptions.archived');
      case QuestionStatusEnum.REVISION:
        return t('question_status_details.descriptions.revision');
      default:
        return t('question_status_details.descriptions.unknown');
    }
  };

  const Controller = questionsController.getInstance();
  const route = useRoute();
  const DeleteQuestion = async () => {
    const deleteParams = new DeletequestionsParams(Number(route.params.id));
    await Controller.delete(deleteParams);
    router.push({ name: 'Questions' });
  };

  const controller = questionsController.getInstance();
  const RvisionQuestion = async (note?: string) => {
    const quiestionStatusParams = new ToggleQuestionStatusParams({
      id: Number(route.params.id),
      status: QuestionStatusEnum.REVISION,
      note: note,
    });
    const result = await controller.updateReviewStatus(quiestionStatusParams);
    if (result instanceof DataSuccess) {
      router.push('/questions');
    }
    // dialogManager.toastSuccess('Question rejected successfully');
  };
  const ArchiveQuestion = async () => {
    const quiestionStatusParams = new ToggleQuestionStatusParams({
      id: Number(route.params.id),
      status: QuestionStatusEnum.ARCHIVED,
    });
    const result = await controller.updateReviewStatus(quiestionStatusParams);
    if (result instanceof DataSuccess) {
      router.push('/questions');
    }
    // dialogManager.toastSuccess('Question rejected successfully');
  };
  const UnArchiveQuestion = async () => {
    const quiestionStatusParams = new ToggleQuestionStatusParams({
      id: Number(route.params.id),
      status: QuestionStatusEnum.REVISION,
    });
    const result = await controller.updateReviewStatus(quiestionStatusParams);
    if (result instanceof DataSuccess) {
      router.push('/questions');
    }
    // dialogManager.toastSuccess('Question rejected successfully');
  };
</script>

<template>
  <!-- {{ id }} -->
  <div class="action-row-wrapper">
    <div class="info">
      <img :src="FaqImg" alt="question image" />
      <div class="name">
        <h3>{{ getStatusText(questionData?.review_status!) }} {{ t('question') }}</h3>
        <p>{{ getStatusDescription(questionData?.review_status!) }}</p>
        <div
          v-if="questionData?.review_status === QuestionStatusEnum.APPROVED"
          class="approved-case-info"
        >
          <h4>
            <span>Approved by :</span>
            {{ questionData.approvedBy }}
          </h4>

          <h4>
            <span>Approved at :</span>
            {{ questionData.createdAt }}
          </h4>
        </div>
      </div>
    </div>
    <div v-if="questionData.review_status != QuestionStatusEnum.APPROVED" class="question-actions">
      <button
        class="btn btn-primary"
        @click="router.push({ name: 'Edit question', params: { id } })"
        v-if="questionData.review_status != QuestionStatusEnum.ARCHIVED"
      >
        <EditIcon /> {{ $t('edit') }}
      </button>

      <!-- <button >
        {{ $t('unarchive') }}
      </button> -->
      <UnArchiveDialog
        v-if="questionData.review_status == QuestionStatusEnum.ARCHIVED"
        @unarchive="UnArchiveQuestion"
      />

      <DeleteDialog
        class="action-btn delete"
        :aria-label="$t('delete')"
        :title="$t('delete_question_title')"
        :message="$t('delete_question_message')"
        :hasbtn="true"
        @delete="DeleteQuestion"
        v-if="questionData?.can_delete!"
      >
        <template #btn>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </template>
      </DeleteDialog>
    </div>
    <div v-if="questionData.review_status == QuestionStatusEnum.APPROVED" class="question-actions">
      <RevisionQuestion @revision="RvisionQuestion" />

      <!-- <button class="btn btn-primary" @click="ArchiveQuestion">
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.40498 1.11L2.39999 3.33752C1.49249 3.84002 0.75 5.10001 0.75 6.13501V10.3725C0.75 11.4075 1.49249 12.6675 2.39999 13.17L6.40498 15.3975C7.25998 15.87 8.66248 15.87 9.51748 15.3975L13.5225 13.17C14.43 12.6675 15.1725 11.4075 15.1725 10.3725V6.13501C15.1725 5.10001 14.43 3.84002 13.5225 3.33752L9.51748 1.11C8.65498 0.63 7.25998 0.63 6.40498 1.11Z"
            stroke="#4FAF7C"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>archive</span>
      </button> -->
      <ArchiveDialog @archive="ArchiveQuestion" />
    </div>
  </div>
</template>
