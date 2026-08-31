<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
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
    { key: 'title', label: t('question_batch.id'), width: '14%', sortable: true },
    { key: 'educationType', label: t('question_batch.education_type'), width: '18%' },
    { key: 'eCSubject', label: t('question_batch.subject_label'), width: '12%' },
    { key: 'curriculum', label: t('question_batch.curriculum'), width: '17%' },
    { key: 'numberOfQuestions', label: t('question_batch.questions_count'), width: '10%' },
    { key: 'sources', label: t('question_batch.sources'), width: '14%' },
    { key: 'status', label: t('question_batch.status'), width: '11%' },
    { key: 'createdAt', label: t('question_batch.created_at'), width: '13%' },
    { key: 'generationDate', label: t('question_batch.generation_date'), width: '14%' },
  ]);

  const sourcesLabel = (sources: string[]): string =>
    sources.filter(Boolean).join(', ') || t('question_batch.not_available');

  const formatGenerationDate = (value: string): string => {
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return isoDate ? `${isoDate[3]}-${isoDate[2]}-${isoDate[1]}` : value;
  };

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
      '4': t('question_batch.failed'),
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
      <!-- <router-link :to="{ name: 'Generate Question Batch' }" class="question-batch-index__add">
        <IndexPluseIcon /> {{ t('question_batch.new_batch') }}
      </router-link> -->
    </header>

    <DataStatusBuilder :controller="state" :on-retry="() => fetchBatches()">
      <template #success="{ data }">
        <div class="question-batch-index__table">
          <AppTable
            :headers="headers"
            :items="data as QuestionBatchModel[]"
            row-key="id"
            selectable
          >
            <template #cell-title="{ item }">
              <span class="question-batch-index__batch-id" :title="item.title">
                {{ item.title }}
              </span>
            </template>
            <template #cell-educationType="{ item }">
              <div v-if="item.educationType.length" class="question-batch-index__education">
                <div
                  v-for="educationType in item.educationType"
                  :key="educationType.id"
                  class="question-batch-index__education-group"
                >
                  <span class="question-batch-index__education-root">
                    {{ educationType.title }}
                  </span>
                  <span
                    v-for="child in educationType.children"
                    :key="child.id"
                    class="question-batch-index__education-child"
                  >
                    {{ child.title }}
                  </span>
                </div>
              </div>
              <span v-else>{{ t('question_batch.not_available') }}</span>
            </template>
            <template #cell-eCSubject="{ item }">{{ item.eCSubject.title }}</template>
            <template #cell-curriculum="{ item }">
              <span class="question-batch-index__clamped-text" :title="item.curriculum.title">
                {{ item.curriculum.title }}
              </span>
            </template>
            <template #cell-sources="{ item }">
              <span
                class="question-batch-index__truncated-text"
                :title="sourcesLabel(item.sources)"
              >
                {{ sourcesLabel(item.sources) }}
              </span>
            </template>
            <template #cell-status="{ item }">
              <span class="question-batch-index__status" :data-status="item.status">
                {{ statusLabel(item.status) }}
              </span>
            </template>
            <template #cell-createdAt="{ item }">{{ item.createdAt.name }}</template>
            <template #cell-generationDate="{ item }">
              {{ formatGenerationDate(item.generationDate) }}
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
        <TableSkelaton :rows="5" :columns="headers.length" selectable />
      </template>
    </DataStatusBuilder>
  </main>
</template>

<style lang="scss">
  @use '../styles/question_batch';
</style>
