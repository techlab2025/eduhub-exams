<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Popover from 'primevue/popover';
  import { QuestionBatchStatusEnum } from '../../core/constant/question.batch.status.enum';
  import ActionsIcon from '@/shared/icons/ActionsIcon.vue';
  import DeleteIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import IconCheck from '@/shared/icons/IconCheck.vue';
  import ViewIcon from '@/shared/icons/Plan/PlanViewIcon.vue';

  interface ActionsPopover {
    toggle(event: Event): void;
    hide(): void;
  }

  const props = defineProps<{
    status: string;
  }>();

  const emit = defineEmits<{
    (event: 'view' | 'approve' | 'delete'): void;
  }>();

  const { t } = useI18n();
  const popover = ref<ActionsPopover | null>(null);
  const expanded = ref(false);
  const canApprove = computed(() => props.status !== QuestionBatchStatusEnum.APPROVED);

  const toggle = (event: Event) => popover.value?.toggle(event);
  const runAction = (action: 'view' | 'approve' | 'delete') => {
    emit(action);
    popover.value?.hide();
  };
</script>

<template>
  <button
    type="button"
    class="question-batch-actions__trigger"
    :aria-label="t('question_batch.open_actions')"
    aria-haspopup="menu"
    :aria-expanded="expanded"
    @click="toggle"
  >
    <ActionsIcon />
  </button>

  <Popover
    ref="popover"
    :pt="{
      root: 'question-batch-actions-popover',
      content: 'question-batch-actions-popover__content',
    }"
    @show="expanded = true"
    @hide="expanded = false"
  >
    <ul class="question-batch-actions__menu" role="menu">
      <li role="none">
        <button
          type="button"
          class="question-batch-actions__item"
          role="menuitem"
          data-action="view"
          @click="runAction('view')"
        >
          <ViewIcon />
          <span>{{ t('question_batch.view') }}</span>
        </button>
      </li>
      <li v-if="canApprove" role="none">
        <button
          type="button"
          class="question-batch-actions__item question-batch-actions__item--approve"
          role="menuitem"
          data-action="approve"
          @click="runAction('approve')"
        >
          <IconCheck />
          <span>{{ t('question_batch.approve') }}</span>
        </button>
      </li>
      <li role="none">
        <button
          type="button"
          class="question-batch-actions__item question-batch-actions__item--danger"
          role="menuitem"
          data-action="delete"
          @click="runAction('delete')"
        >
          <DeleteIcon />
          <span>{{ t('question_batch.delete') }}</span>
        </button>
      </li>
    </ul>
  </Popover>
</template>
