<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ArticleController from '../controllers/Article.controller';
  import EditArticlesParams from '../../core/params/edit.Articles.params';
  import ShowArticlesParams from '../../core/params/show.Articles.params';
  import ArticleForm from './ArticleForm.vue';
  import type AddArticlesParams from '../../core/params/add.Artical.params.ts';
  import CancelQuestionDialog from '@/modules/Questions/presentation/subComponents/Dialogs/CancelQuestionDialog.vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

  const controller = ArticleController.getInstance();
  const route = useRoute();
  const router = useRouter();

  const formKey = route.fullPath;

  const params = ref<EditArticlesParams | null>(null);
  const articleFormRef = ref<InstanceType<typeof ArticleForm> | null>(null);

  const loading = ref(false);

  const updateArticleAndContinue = async () => {
    if (!(await articleFormRef.value?.validateRequiredFields())) return;

    if (!params.value) {
      console.error('No article parameters to save');
      return;
    }
    try {
      loading.value = true;
      const result = await controller.update(params.value, undefined, formKey, false);
      if (!(result instanceof DataSuccess)) return;

      const query = {
        ...(params.value.e_c_subject_id && { subject_id: params.value.e_c_subject_id }),
        ...(params.value.questionSequenceId && { sequence_id: params.value.questionSequenceId }),
      };
      await router.push({
        name: 'Article questions',
        params: { artical_id: Number(route.params.id) },
        ...(Object.keys(query).length && { query }),
      });
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddArticlesParams) => {
    params.value = new EditArticlesParams({
      id: Number(route.params.id),
      question_description: updatedParams.question_description,
      attachments: updatedParams.attachments,
      question: updatedParams.question,
      question_type: updatedParams.question_type,
      e_c_subject_id: updatedParams.e_c_subject_id,
      questionSequenceId: updatedParams.questionSequenceId,
      documents: updatedParams.documents,
      explanation: updatedParams.explanation,
    });
  };

  onMounted(async () => {
    await controller.fetchOne(new ShowArticlesParams(Number(route.params.id)));
  });

  const cancel = () => {
    router.push({ name: 'Articles' });
  };
</script>

<template>
  <div class="article-edit-page">
    <ArticleForm
      ref="articleFormRef"
      :loading="loading"
      :article="controller.itemData.value!"
      :form-key="formKey"
      @update-data="updateData"
    />

    <div class="actions" :class="{ disabled: loading }">
      <button
        class="btn btn-primary next-button"
        type="button"
        :disabled="loading"
        :class="loading ? 'disabled' : ''"
        @click="updateArticleAndContinue"
      >
        {{ $t('article_next') }}
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
  .actions {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    .next-button,
    :deep(.btn-cancel) {
      width: 100%;
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
