<script setup lang="ts">
  import AgreeIcon from '@/shared/icons/Question/AgreeIcon.vue';
  import questionsController from '../../controllers/questions.controller';
  import ToggleQuestionStatusParams from '@/modules/Questions/core/params/question.toggle.status.params';
  import { useRoute, useRouter } from 'vue-router';
  import { QuestionStatusRejectAbroveEnum } from '@/modules/Questions/core/constant/question.status.reject.abrove.enum';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
import RejectQuestion from '../Dialogs/RejectQuestion.vue';

  const controller = questionsController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const aproveQuestion = async () => {
    const quiestionStatusParams = new ToggleQuestionStatusParams({
      id: Number(route.params.id),
      status: QuestionStatusRejectAbroveEnum.APPROVED,
    });
    await controller.updateReviewStatus(quiestionStatusParams);
    router.push({ name: 'Questions' });
    dialogManager.toastSuccess('Question approved successfully');
  };
  const rejectQuestion = async (note?:string) => {
    const quiestionStatusParams = new ToggleQuestionStatusParams({
      id: Number(route.params.id),
      status: QuestionStatusRejectAbroveEnum.REJECTED,
      note:note
    });
    await controller.updateReviewStatus(quiestionStatusParams);
    router.push({ name: 'Questions' });
    dialogManager.toastSuccess('Question rejected successfully');
  };
</script>

<template>
  <div class="question-review-procedures-wrapper">
    <div class="card-content">
      <!-- <div class="question-review-procedures-header">
        <h2>Review procedures</h2>
        <p>
          Review the question text and options, and determine if it is ready for publication or
          needs editing.
        </p>
      </div>

      <div class="question-review-procedures-body">
        <div class="caution-item">
          <CautionIcon />
          <p>AI-generated question. Please verify before posting.</p>
        </div>
      </div> -->
      <div class="actions">
        <button class="approve-btn btn btn-primary" @click="aproveQuestion">
          <AgreeIcon />
          Agree to the question
        </button>
        <!-- <button class="reject-btn btn btn-cancel" @click="rejectQuestion">
          <RejectIcon />
          reject question
        </button> -->
      <RejectQuestion @reject="rejectQuestion" />
      </div>
    </div>
  </div>
</template>
