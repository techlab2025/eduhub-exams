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
  const { questionData } = defineProps<{ questionData: ShowQuestionsModel }>();
  const router = useRouter();

  const id = router.currentRoute.value.params.id;

  const getStatusText = (review_status: QuestionStatusEnum) => {
    switch (review_status) {
      case QuestionStatusEnum.PENDING:
        return 'Under Review';
      case QuestionStatusEnum.APPROVED:
        return 'Approved';
      case QuestionStatusEnum.REJECTED:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusDescription = (review_status: QuestionStatusEnum) => {
    switch (review_status) {
      case QuestionStatusEnum.PENDING:
        return 'complete all details of the question and the available procedures to can publish it';
      case QuestionStatusEnum.REJECTED:
        return 'View all details of the question and reason of rejected';
      case QuestionStatusEnum.APPROVED:
        return '';
      default:
        return 'Unknown';
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
    await controller.updateReviewStatus(quiestionStatusParams);
    // dialogManager.toastSuccess('Question rejected successfully');
  };
    const ArchiveQuestion = async () => {
    const quiestionStatusParams = new ToggleQuestionStatusParams({
      id: Number(route.params.id),
      status: QuestionStatusEnum.ARCHIVED,
    });
    await controller.updateReviewStatus(quiestionStatusParams);
    // dialogManager.toastSuccess('Question rejected successfully');
  };
</script>

<template>
  <!-- {{ id }} -->
  <div class="action-row-wrapper">
    <div class="info">
      <img :src="FaqImg" alt="question image" />
      <div class="name">
        <h3>{{ getStatusText(questionData?.review_status!) }} Question</h3>
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
    <div class="question-actions" v-if="questionData.review_status != QuestionStatusEnum.APPROVED">
      <button
        class="btn btn-primary"
        @click="router.push({ name: 'Edit question', params: { id } })"
      >
        <EditIcon /> {{ $t('edit') }}
      </button>

      <button class="action-btn delete" title="Delete" @click="DeleteQuestion">
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
      </button>
    </div>
    <div class="question-actions" v-if="questionData.review_status == QuestionStatusEnum.APPROVED">
      <RevisionQuestion @revision="RvisionQuestion" />

      <button class="btn btn-primary" @click="ArchiveQuestion">
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

      </button>
    </div>
  </div>
</template>
