<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
  import type EditQuestionParams from '../../core/params/edit.question.params';
  import ShowQuestionParams from '../../core/params/show.question.params';
  import questionsController from '../controllers/questions.controller';
  import QuestionsForm from './questionsForm.vue';
  import { QuestionStatusEnum } from '../../core/constant/question.status.enum';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import WithReviewDialog from '../subComponents/Dialogs/WithReviewDialog.vue';
  import CancelQuestionDialog from '../subComponents/Dialogs/CancelQuestionDialog.vue';
  import UnsavedQuestionChangesDialog from '../subComponents/Dialogs/UnsavedQuestionChangesDialog.vue';

  const controller = questionsController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;

  const params = ref<EditQuestionParams | null>(null);
  const loading = ref(false);
  const questionFormRef = ref<{ validate: () => Promise<boolean> } | null>(null);
  const initialFormSnapshot = ref<string | null>(null);
  const hasUnsavedChanges = ref(false);
  const allowNavigation = ref(false);
  const leaveDialogVisible = ref(false);
  let resolveNavigation: ((allow: boolean) => void) | null = null;
  const isFormLocked = computed(
    () => controller.itemData.value?.review_status === QuestionStatusEnum.ARCHIVED,
  );

  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  const getFormSnapshot = () => {
    const formParams = params.value;
    return JSON.stringify(formParams ? (formParams.toMap?.() ?? formParams) : null);
  };

  const resolveLeaveRequest = (allow: boolean) => {
    leaveDialogVisible.value = false;
    const resolve = resolveNavigation;
    resolveNavigation = null;
    resolve?.(allow);
  };

  onBeforeRouteLeave(() => {
    if (!hasUnsavedChanges.value || allowNavigation.value || isFormLocked.value) return true;

    leaveDialogVisible.value = true;
    return new Promise<boolean>((resolve) => {
      resolveNavigation = resolve;
    });
  });

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!hasUnsavedChanges.value || allowNavigation.value || isFormLocked.value) return;
    event.preventDefault();
    event.returnValue = '';
  };

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    resolveNavigation?.(false);
  });

  const navigateAfterSave = (isRouting: boolean) => {
    const parentId = params.value?.parentId;

    if (isRouting) {
      if (parentId != null) {
        router.push({ name: 'Article questions', params: { artical_id: parentId } });
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
    if (isFormLocked.value) return;

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
      allowNavigation.value = true;
      hasUnsavedChanges.value = false;

      navigateAfterSave(isRouting);
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      loading.value = false;
    }
  };

  const saveAsDraft = async () => {
    if (isFormLocked.value) return;

    if (!params.value) {
      console.error('No question parameters to update');
      return;
    }

    loading.value = true;
    try {
      params.value.status = QuestionStatusEnum.DRAFT;
      const result = await controller.update(params.value, undefined, formKey);
      if (!(result instanceof DataSuccess)) return;
      allowNavigation.value = true;
      hasUnsavedChanges.value = false;

      navigateAfterSave(true);
    } catch (error) {
      console.error('Error saving question draft:', error);
    } finally {
      loading.value = false;
    }
  };

  const cancelEdit = () => {
    allowNavigation.value = true;
    const parentId =
      params.value?.parentId ??
      (route.query.article_id ? Number(route.query.article_id) : undefined);
    if (parentId != null) {
      router.push({ name: 'Article questions', params: { artical_id: parentId } });
    } else {
      router.push({ name: 'Questions' });
    }
  };

  const updateData = (updatedParams: EditQuestionParams) => {
    params.value = updatedParams;
    if (initialFormSnapshot.value !== null) {
      hasUnsavedChanges.value = getFormSnapshot() !== initialFormSnapshot.value;
    }
  };

  onMounted(async () => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    await controller.fetchOne(new ShowQuestionParams(Number(route.params.id)));
    await nextTick();
    await nextTick();
    initialFormSnapshot.value = getFormSnapshot();
  });
</script>

<template>
  <div class="questions-edit-page">
    <fieldset
      class="question-form-fieldset"
      :class="{ disabled: loading, 'is-locked': isFormLocked }"
      :disabled="loading || isFormLocked"
      :aria-disabled="isFormLocked"
      :inert="isFormLocked || undefined"
    >
      <QuestionsForm
        ref="questionFormRef"
        :question="controller.itemData.value!"
        :form-key="formKey"
        @update-data="updateData"
      />
    </fieldset>

    <div class="actions">
      <template v-if="!isFormLocked">
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
      </template>
      <CancelQuestionDialog @cancel="cancelEdit" />
    </div>

    <UnsavedQuestionChangesDialog
      v-model:visible="leaveDialogVisible"
      @discard="resolveLeaveRequest(true)"
      @stay="resolveLeaveRequest(false)"
    />

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .question-form-fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;

    &.is-locked {
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

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
