<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import warningImage from '@/assets/images/PLan/PlanDeleteWarning.gif';
  import DeleteIllustration from '@/shared/icons/DeleteDialogIcons/DeleteIcon.vue';
  import type QuestionBatchModel from '../../core/models/question.batch.model';

  const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      batch: QuestionBatchModel | null;
      loading?: boolean;
    }>(),
    { loading: false },
  );

  const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'confirm', batch: QuestionBatchModel): void;
  }>();

  const { t } = useI18n();
  const visible = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  });
  const canDelete = computed(() => props.batch?.canDelete ?? true);

  const confirmDelete = () => {
    if (!props.batch || !canDelete.value || props.loading) return;
    emit('confirm', props.batch);
  };
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :dismissable-mask="!loading"
    :close-on-escape="!loading"
    :pt="{ root: 'question-batch-delete-dialog' }"
    :style="{ width: 'min(46rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <section
        class="question-batch-delete-dialog__content"
        :aria-busy="loading"
        aria-live="polite"
      >
        <DeleteIllustration v-if="canDelete" class="question-batch-delete-dialog__illustration" />
        <img v-else class="question-batch-delete-dialog__warning" :src="warningImage" alt="" />

        <h2>
          {{
            canDelete
              ? t('question_batch.delete_batch_title')
              : t('question_batch.cannot_delete_batch_title')
          }}
        </h2>
        <p>
          {{
            canDelete
              ? t('question_batch.delete_batch_message')
              : t('question_batch.cannot_delete_batch_message')
          }}
        </p>

        <div class="question-batch-delete-dialog__actions">
          <button
            v-if="canDelete"
            type="button"
            class="question-batch-delete-dialog__confirm"
            data-testid="confirm-delete"
            :disabled="loading"
            @click="confirmDelete"
          >
            {{ t('question_batch.confirm_delete') }}
          </button>
          <button
            type="button"
            class="question-batch-delete-dialog__cancel"
            data-testid="cancel-delete"
            :disabled="loading"
            @click="visible = false"
          >
            {{ t('question_batch.cancel') }}
          </button>
        </div>
      </section>
    </template>
  </Dialog>
</template>
