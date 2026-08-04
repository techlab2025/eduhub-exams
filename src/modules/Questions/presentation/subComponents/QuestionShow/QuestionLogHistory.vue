<script setup lang="ts">
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  import { computed } from 'vue';
  import { QuestionStatusEnum } from '../../../core/constant/question.status.enum';
  import type QuestionHistoryModel from '../../../core/models/question.history.model';
  import { formatJoinDate } from '@/base/Presentation/Utils/date_format';
  import { formatTime } from '@/base/Presentation/Utils/time_format';

  const props = defineProps<{
    logs: QuestionHistoryModel[];
  }>();

  const reversedLogs = computed(() => [...props.logs].reverse());

  const getStatusClass = (status?: QuestionStatusEnum) => {
    switch (status) {
      case QuestionStatusEnum.CREATED:
        return 'status-created';
      case QuestionStatusEnum.APPROVED:
        return 'status-approved';
      case QuestionStatusEnum.REJECTED:
        return 'status-rejected';
      case QuestionStatusEnum.DRAFT:
        return 'status-draft';
      case QuestionStatusEnum.NOT_REVIEW:
        return 'status-not-reviewed';
      case QuestionStatusEnum.ARCHIVED:
        return 'status-archived';
      case QuestionStatusEnum.REVISION:
        return 'status-revision';
      default:
        return 'status-unknown';
    }
  };

  const getQuestionStatus = (status?: QuestionStatusEnum) => {
    switch (status) {
      case QuestionStatusEnum.CREATED:
        return 'created';
      case QuestionStatusEnum.APPROVED:
        return 'approved';
      case QuestionStatusEnum.REJECTED:
        return 'rejected';
      case QuestionStatusEnum.DRAFT:
        return 'draft';
      case QuestionStatusEnum.NOT_REVIEW:
        return 'not reviewed';
      case QuestionStatusEnum.ARCHIVED:
        return 'archived';
      case QuestionStatusEnum.REVISION:
        return 'revision';
      default:
        return 'unknown';
    }
  };
</script>

<template>
  <div class="question-log-history">
    <Accordion value="0">
      <AccordionPanel value="0">
        <!-- MAIN HEADER -->
        <AccordionHeader class="card-header">
          <h3>Log History</h3>
        </AccordionHeader>

        <!-- CONTENT -->
        <AccordionContent>
          <div class="logs">
            <div v-for="log in reversedLogs" :key="`${log.questionId}-${log}`" class="log-item">
              <div class="log-date" :class="getStatusClass(log.status?.value)">
                {{ formatJoinDate(log.caretedAt!) }}
              </div>

              <div class="log-content">
                <div class="top">
                  <h4 :class="getStatusClass(log.status?.value)">
                    {{ getQuestionStatus(log.status?.value) }}
                  </h4>

                  <span> At {{ formatTime(log.caretedAt!) }} </span>
                </div>

                <p v-if="log.employee">
                  Created By:
                  <span class="created-by-name">
                    {{ log.employee?.name }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
