<script setup lang="ts">
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
  import questionsController from '../controllers/questions.controller';
  import questionsForm from './questionsForm.vue';
  // import LoadingIcon from '@/assets/images/loading.webp';
  import type AddquestionsParams from '../../core/params/add.question.params';
  import { QuestionStatusEnum } from '../../core/constant/question.status.enum.ts';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import WithReviewDialog from '../subComponents/Dialogs/WithReviewDialog.vue';
  import CancelQuestionDialog from '../subComponents/Dialogs/CancelQuestionDialog.vue';
  import UnsavedQuestionChangesDialog from '../subComponents/Dialogs/UnsavedQuestionChangesDialog.vue';

  const props = withDefaults(
    defineProps<{
      articleId?: number;
      subjectId?: number;
      sequenceId?: number;
      embedded?: boolean;
    }>(),
    {
      articleId: undefined,
      subjectId: undefined,
      sequenceId: undefined,
      embedded: false,
    },
  );
  const emit = defineEmits<{
    saved: [];
    close: [];
  }>();

  const controller = questionsController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  const loading = ref(false);
  const params = ref<AddquestionsParams | null>(null);
  const router = useRouter();
  const questionFormRef = ref<{ validate: () => Promise<boolean> } | null>(null);
  const initialFormSnapshot = ref<string | null>(null);
  const hasUnsavedChanges = ref(false);
  const allowNavigation = ref(false);
  const leaveDialogVisible = ref(false);
  let resolveNavigation: ((allow: boolean) => void) | null = null;

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
    if (!hasUnsavedChanges.value || allowNavigation.value) return true;

    leaveDialogVisible.value = true;
    return new Promise<boolean>((resolve) => {
      resolveNavigation = resolve;
    });
  });

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!hasUnsavedChanges.value || allowNavigation.value) return;
    event.preventDefault();
    event.returnValue = '';
  };

  onMounted(async () => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    await nextTick();
    await nextTick();
    initialFormSnapshot.value = getFormSnapshot();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    resolveNavigation?.(false);
  });

  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  const saveQuestion = async (isRouting: boolean, isWithReview: boolean) => {
    const isFormValid = await questionFormRef.value?.validate?.();
    if (isFormValid === false) return;
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No employee parameters to save');
        return;
      }
      isWithReview
        ? (params.value.status = QuestionStatusEnum.NOT_REVIEW)
        : (params.value.status = QuestionStatusEnum.APPROVED);

      const result = await controller.create(params.value, undefined, formKey);
      if (!(result instanceof DataSuccess)) return;
      allowNavigation.value = true;
      hasUnsavedChanges.value = false;

      if (props.embedded) {
        emit('saved');
        return;
      }

      if (isRouting) {
        if (params.value?.parentId != null) {
          router.push({
            name: 'Article questions',
            params: { artical_id: params.value.parentId },
          });
        } else {
          router.back();
        }
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      loading.value = false;
    }
  };

  const saveAsDraft = async () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No question parameters to save');
        return;
      }
      localStorage.setItem(`question-draft`, JSON.stringify(params.value));

      params.value.status = QuestionStatusEnum.DRAFT;
      const result = await controller.create(params.value, undefined, formKey);
      if (!(result instanceof DataSuccess)) return;
      allowNavigation.value = true;
      hasUnsavedChanges.value = false;

      if (params.value?.parentId != null) {
        router.push({
          name: 'Article questions',
          params: { artical_id: params.value.parentId },
        });
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      loading.value = false;
    }
  };
  const updateData = (updatedParams: AddquestionsParams) => {
    params.value = updatedParams;
    if (initialFormSnapshot.value !== null) {
      hasUnsavedChanges.value = getFormSnapshot() !== initialFormSnapshot.value;
    }
  };

  const cancelAdd = () => {
    allowNavigation.value = true;
    if (route.query.article_id || route.query.artical_id) {
      router.push({ name: 'Articles' });
    } else {
      router.push({ name: 'Questions' });
    }
  };
</script>

<template>
  <div class="questions-add-page">
    <questionsForm
      ref="questionFormRef"
      :class="loading ? 'disabled' : ''"
      :form-key="formKey"
      :article-id="props.articleId"
      :subject-id="props.subjectId"
      :sequence-id="props.sequenceId"
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
        v-if="!props.embedded"
        class="save-emp"
        :save-status="SaveStatusEnum.SaveAndNew"
        @with-review="saveQuestion(false, true)"
        @without-review="saveQuestion(false, false)"
      />
      <button
        v-if="!props.embedded"
        class="btn btn-draft"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="saveAsDraft"
      >
        {{ $t(`Save As draft`) }}
      </button>
      <button v-if="props.embedded" class="btn btn-cancel" type="button" @click="emit('close')">
        {{ $t('cancel') }}
      </button>
      <CancelQuestionDialog v-else @cancel="cancelAdd" />
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
  .btn-cancel {
    width: 20%;
    border: 1px solid var(--background-btn-hard-color);
    border-radius: 50px;
    background-color: var(--background-btn-outline-color);
    color: var(--danger-color);

    @media (max-width: 768px) {
      width: 50%;
    }
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

  .save-emp {
    width: 100%;
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .actions {
    margin-block: 18px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
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
