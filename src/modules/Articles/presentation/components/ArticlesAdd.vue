<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type AddArticlesParams from '../../core/params/add.Artical.params';
  import ArticleController from '../controllers/Article.controller';
  import ArticleForm from './ArticleForm.vue';
  import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import WithReviewDialog from '@/modules/Questions/presentation/subComponents/Dialogs/WithReviewDialog.vue';
  import CancelQuestionDialog from '@/modules/Questions/presentation/subComponents/Dialogs/CancelQuestionDialog.vue';

  const controller = ArticleController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;

  const params = ref<AddArticlesParams | null>(null);
  const articleFormRef = ref<InstanceType<typeof ArticleForm> | null>(null);

  /**
   * Save new article
   */

  const loading = ref(false);
  const SaveStatusEnum = {
    Save: 1,
    SaveAndNew: 2,
  } as const;

  const saveArticle = async (isRouting: boolean, isWithReview: boolean) => {
    try {
      if (!(await articleFormRef.value?.validateRequiredFields())) return;

      if (!params.value) {
        console.error('No article parameters to save');
        return;
      }
      loading.value = true;
      params.value.status = isWithReview
        ? QuestionStatusEnum.NOT_REVIEW
        : QuestionStatusEnum.APPROVED;

      const result = await controller.create(params.value, undefined, formKey, isRouting);
      if (!(result instanceof DataSuccess) || isRouting) return;

      window.location.reload();
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      loading.value = false;
    }
  };

  const saveAsDraft = async () => {
    loading.value = true;
    try {
      if (!params.value) {
        console.error('No article parameters to save');
        return;
      }

      localStorage.setItem('article-draft', JSON.stringify(params.value));
      params.value.status = QuestionStatusEnum.DRAFT;
      await controller.create(params.value, undefined, formKey);
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddArticlesParams) => {
    params.value = updatedParams;
  };
  const cancel = () => {
    router.push({ name: 'Articles' });
  };
</script>

<template>
  <div class="artical-add-page">
    <!-- <ArticleForm :form-key="formKey" :loading="loading" @update-data="updateData" /> -->
    <ArticleForm
      ref="articleFormRef"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
    />

    <div class="actions" :class="{ disabled: loading }">
      <WithReviewDialog
        class="save-emp"
        :save-status="SaveStatusEnum.Save"
        @with-review="saveArticle(true, true)"
        @without-review="saveArticle(true, false)"
      />
      <WithReviewDialog
        class="save-emp"
        :save-status="SaveStatusEnum.SaveAndNew"
        @with-review="saveArticle(false, true)"
        @without-review="saveArticle(false, false)"
      />
      <button
        class="btn btn-draft"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="saveAsDraft"
      >
        {{ $t(`Save As draft`) }}
      </button>
      <CancelQuestionDialog @cancel="cancel" />
    </div>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '../../../../styles/variables' as *;

  .loader {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 14px solid;
    border-color: black transparent black transparent;
    animation: l1 1.2s linear infinite;
    display: inline-block;
  }

  @keyframes l1 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .actions {
    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }
  }

  //
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

  .actions {
    margin-top: 24px;
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
