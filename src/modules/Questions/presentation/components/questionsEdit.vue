<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type EditQuestionParams from '../../core/params/edit.question.params';
  import ShowQuestionParams from '../../core/params/show.question.params';
  import questionsController from '../controllers/questions.controller';
  import QuestionsForm from './questionsForm.vue';
  import { QuestionStatusEnum } from '../../core/constant/question.status.enum';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import WithReviewDialog from '../subComponents/Dialogs/WithReviewDialog.vue';
  import CancelQuestionDialog from '../subComponents/Dialogs/CancelQuestionDialog.vue';

  const controller = questionsController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;

  const params = ref<EditQuestionParams | null>(null);
  const loading = ref(false);
  const questionFormRef = ref<{ validate: () => Promise<boolean> } | null>(null);

  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  const navigateAfterSave = (isRouting: boolean) => {
    const parentId = params.value?.parentId;

    if (isRouting) {
      if (parentId != null) {
        router.push({ name: 'Article questions', params: { id: parentId } });
      } else {
        router.back();
      }
      return;
    }

    router.push({
      name: 'Add question',
      ...(parentId != null && { query: { article_id: parentId } }),
    });
  };

  const saveQuestion = async (isRouting: boolean, isWithReview: boolean) => {
    const isFormValid = await questionFormRef.value?.validate?.();
    if (isFormValid === false) return;
    if (!params.value) {
      console.error('No question parameters to update');
      return;
    }

    loading.value = true;
    try {
      params.value.status = isWithReview
        ? QuestionStatusEnum.NOT_REVIEW
        : QuestionStatusEnum.APPROVED;

      const result = await controller.update(params.value, undefined, formKey);
      if (!(result instanceof DataSuccess)) return;

      navigateAfterSave(isRouting);
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      loading.value = false;
    }
  };

  const saveAsDraft = async () => {
    if (!params.value) {
      console.error('No question parameters to update');
      return;
    }

    loading.value = true;
    try {
      params.value.status = QuestionStatusEnum.DRAFT;
      const result = await controller.update(params.value, undefined, formKey);
      if (!(result instanceof DataSuccess)) return;

      navigateAfterSave(true);
    } catch (error) {
      console.error('Error saving question draft:', error);
    } finally {
      loading.value = false;
    }
  };

  const cancelEdit = () => {
    const parentId =
      params.value?.parentId ??
      (route.query.article_id ? Number(route.query.article_id) : undefined);
    if (parentId != null) {
      router.push({ name: 'Article questions', params: { id: parentId } });
    } else {
      router.push({ name: 'Questions' });
    }
  };

  const updateData = (updatedParams: EditQuestionParams) => {
    params.value = updatedParams;
  };

  onMounted(async () => {
    await controller.fetchOne(new ShowQuestionParams(Number(route.params.id)));
  });
</script>

<template>
  <div class="questions-edit-page">
    <QuestionsForm
      ref="questionFormRef"
      :class="loading ? 'disabled' : ''"
      :question="controller.itemData.value!"
      :form-key="formKey"
      @update-data="updateData"
    />

    <div class="actions">
      <WithReviewDialog
        class="save-emp"
        :save-status="SaveStatusEnum.Save"
        @with-review="saveQuestion(true, true)"
        @without-review="saveQuestion(true, false)"
      />
      <WithReviewDialog
        class="save-emp"
        :save-status="SaveStatusEnum.SaveAndNew"
        @with-review="saveQuestion(false, true)"
        @without-review="saveQuestion(false, false)"
      />
      <button
        type="button"
        class="btn btn-draft"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="saveAsDraft"
      >
        {{ $t('Save As draft') }}
      </button>
      <CancelQuestionDialog @cancel="cancelEdit" />
    </div>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .actions {
    margin-block: 18px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .save-emp {
    width: 100%;
  }

  .btn-draft {
    width: 20%;
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 50px;
    background-color: var(--PrimaryColor-alpha-10);
    color: var(--PrimaryColor);

    @media (max-width: 768px) {
      width: 50%;
    }
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .error-toast {
    margin-top: 20px;
    padding: 12px 16px;
    background-color: var(--error-light);
    color: var(--error-dark);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
  }
</style>
