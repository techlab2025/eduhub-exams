<script setup lang="ts">
  import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';

  const { note, status } = defineProps<{
    note: string;
    status: QuestionStatusEnum;
  }>();

  const GetStattus = (status: QuestionStatusEnum) => {
    switch (status) {
      case QuestionStatusEnum.APPROVED:
        return 'approve';
      case QuestionStatusEnum.REJECTED:
        return 'reject';

      case QuestionStatusEnum.REVISION:
        return 'revision';

      case QuestionStatusEnum.DRAFT:
        return 'draft';

      case QuestionStatusEnum.NOT_REVIEW:
        return 'not reviewd';

      case QuestionStatusEnum.APPROVED:
        return 'approve';
    }
  };
</script>

<template>
  <div class="question-review-reject-wrapper">
    <div class="card-content">
      <div class="question-review-reject-header">
        <h2>{{ `${GetStattus(status)} Reason` }}</h2>
        <p>{{ note || 'no Reason For Reject ' }}</p>
      </div>

      <!-- <div class="question-review-reject-body">
        <div class="reject-item">
          <h4>Reject By :</h4>
          <p>Ai .</p>
        </div>
        <div class="reject-item">
          <h4>rejected in:</h4>
          <p>2 / 11 / 2006</p>
        </div>
      </div> -->
    </div>
    <div class="actions">
      <!--  <router-link class="approve-btn btn btn-primary" :to="`/questions/edit/${route.params.id}`">
        <EditIcon />
        Edit question
      </router-link>-->
      <!-- <button class="btn btn-edit">
        <ReloadIcon />
        send Question to review again
      </button> -->
    </div>
  </div>
</template>
