<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import questionsController from '../controllers/questions.controller';
  import questionsForm from './questionsForm.vue';
  // import LoadingIcon from '@/assets/images/loading.webp';
  import type AddquestionsParams from '../../core/params/add.question.params';
  import { QuestionStatusEnum } from '../../core/constant/question.status.enum.ts';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import WithReviewDialog from '../subComponents/Dialogs/WithReviewDialog.vue';
  import CancelQuestionDialog from '../subComponents/Dialogs/CancelQuestionDialog.vue';

  const controller = questionsController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  const loading = ref(false);
  const params = ref<AddquestionsParams | null>(null);
  const router = useRouter();

  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  const saveQuestion = async (isRouting: boolean, isWithReview: boolean) => {
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

      if (isRouting) {
        if (params.value?.parentId != null) {
          router.push({ name: 'Questions' });
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

      if (params.value?.parentId != null) {
        router.push({ name: 'Questions' });
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
  };
</script>

<template>
  <div class="questions-add-page">
    <questionsForm
      :class="loading ? 'disabled' : ''"
      :form-key="formKey"
      @update-data="updateData"
    />
    <div class="actions">
      <!-- <button
        class="btn btn-primary save-emp"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="saveQuestion(true)"
      >
        <img
          v-if="loading"
          :src="LoadingIcon"
          class="loader-skills"
          alt="loading"
          width="30"
          height="30"
        />
        <span v-else> {{ $t(`Save`) }} </span>
      </button> -->
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
        class="btn btn-draft"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="saveAsDraft"
      >
        {{ $t(`Save As draft`) }}
      </button>
      <!-- <button
        class="btn btn-black"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="saveQuestion(false, false)"
      >
        {{ $t(`Save & New`) }}
      </button> -->

      <!-- <button
        class="btn btn-cancel"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="
          route?.query?.article_id
            ? $router.push({ name: 'Articles' })
            : $router.push({ name: 'Questions' })
        "
      >
        {{ $t(`cancel`) }}
      </button> -->
      <CancelQuestionDialog
        @cancel="
          route?.query?.article_id
            ? $router.push({ name: 'Articles' })
            : $router.push({ name: 'Questions' })
        "
      />
    </div>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .btn-cancel {
    background-color: var(--background-btn-outline-color);
    color: var(--danger-color);
    border: 1px solid rgba(245, 194, 192, 1);
    border-radius: 50px;
    width: 20%;

    @media (max-width: 768px) {
      width: 50%;
    }
  }

  .btn-draft {
    background-color: var(--PrimaryColor-alpha-10);
    color: var(--PrimaryColor);
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 50px;
    width: 20%;

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
    .btn-black {
      background-color: var(--border-color);
      color: var(--black-soft);
      border-radius: 50px;
      width: 20%;
      border: none;

      @media (max-width: 768px) {
        width: 50%;
      }
    }
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
