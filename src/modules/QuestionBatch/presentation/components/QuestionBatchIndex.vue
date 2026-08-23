<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import IndexPluseIcon from '@/shared/icons/IndexPluseIcon.vue';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import type QuestionBatchModel from '../../core/models/question.batch.model';
  import IndexQuestionBatchParams from '../../core/params/index.question.batch.params';
  import QuestionBatchController from '../controllers/question.batch.controller';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = QuestionBatchController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref(String(route.query.word ?? ''));
  const perPage = ref(10);

  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('question_batch.batch_title'), width: '25%' },
    { key: 'curriculum', label: t('question_batch.curriculum'), width: '15%' },
    { key: 'subject', label: t('question_batch.subject_label'), width: '15%' },
    { key: 'numberOfQuestions', label: t('question_batch.questions_count'), width: '12%' },
    { key: 'status', label: t('question_batch.status'), width: '13%' },
    { key: 'generationDate', label: t('question_batch.generation_date'), width: '20%' },
  ]);

  const fetchBatches = async (page = 1) => {
    await controller.fetchList(new IndexQuestionBatchParams(word.value, page, perPage.value, 1));
  };
  const search = debounce(() => {
    void router.replace({ query: { ...route.query, word: word.value || undefined, page: 1 } });
    void fetchBatches(1);
  });
  const changePage = (page: number) => {
    void router.replace({ query: { ...route.query, page, word: word.value || undefined } });
    void fetchBatches(page);
  };
  const changePerPage = (count: number) => {
    perPage.value = count;
    void fetchBatches(1);
  };
  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      '1': t('question_batch.draft'),
      '2': t('question_batch.ready_for_review'),
      '3': t('question_batch.approved'),
      '4': t('question_batch.rejected'),
    };
    return labels[status] ?? status;
  };

  onMounted(() => fetchBatches(Number(route.query.page ?? 1)));
</script>

<template>
  <main class="question-batch-index">
    <header class="question-batch-index__header">
      <div class="question-batch-index__search">
        <IndexSearchIcon />
        <input
          v-model="word"
          type="search"
          :placeholder="t('question_batch.search_batches')"
          @input="search"
        />
      </div>
      <router-link :to="{ name: 'Generate Question Batch' }" class="question-batch-index__add">
        <IndexPluseIcon /> {{ t('question_batch.new_batch') }}
      </router-link>
    </header>

    <DataStatusBuilder :controller="state" :on-retry="() => fetchBatches()">
      <template #success="{ data }">
        <div class="question-batch-index__table">
          <AppTable :headers="headers" :items="data as QuestionBatchModel[]" show-index>
            <template #cell-curriculum="{ item }">{{ item.curriculum.title }}</template>
            <template #cell-subject="{ item }">{{ item.subject.title }}</template>
            <template #cell-status="{ item }">
              <span class="question-batch-index__status" :data-status="item.status">
                {{ statusLabel(item.status) }}
              </span>
            </template>
          </AppTable>
        </div>
        <Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="changePage"
          @count-per-page="changePerPage"
        />
      </template>
      <template #empty>
        <div class="question-batch-index__empty">
          <h2>{{ t('question_batch.no_batches') }}</h2>
          <p>{{ t('question_batch.no_batches_description') }}</p>
        </div>
      </template>
      <template #loader>
        <TableSkelaton :rows="5" :columns="headers.length" show-index />
      </template>
    </DataStatusBuilder>
  </main>
</template>

<style lang="scss">
  @use '../styles/question_batch';
</style>
