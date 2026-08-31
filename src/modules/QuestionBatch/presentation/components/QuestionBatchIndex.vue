<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import Popover from 'primevue/popover';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import ArticleArrow from '@/shared/icons/articlearrow.vue';
  import DialogIconFillter from '@/shared/icons/DialogIconFillter.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import {
    QuestionBatchStatusEnum,
    type QuestionBatchStatusEnum as QuestionBatchStatus,
  } from '../../core/constant/question.batch.status.enum';
  import type QuestionBatchEducationTypeModel from '../../core/models/question.batch.education.type.model';
  import type QuestionBatchModel from '../../core/models/question.batch.model';
  import IndexQuestionBatchParams from '../../core/params/index.question.batch.params';
  import QuestionBatchController from '../controllers/question.batch.controller';
  import QuestionBatchActions from './QuestionBatchActions.vue';
  import QuestionBatchDeleteDialog from './QuestionBatchDeleteDialog.vue';

  interface FilterPopover {
    toggle(event: Event): void;
  }

  interface SummaryCard {
    key: string;
    label: string;
    value: number;
  }

  const emit = defineEmits<{
    (event: 'view', batch: QuestionBatchModel): void;
    (event: 'approve', batch: QuestionBatchModel): void;
    (event: 'delete', batch: QuestionBatchModel): void;
  }>();

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = QuestionBatchController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref(String(route.query.word ?? ''));
  const perPage = ref(10);
  const filterPopover = ref<FilterPopover | null>(null);
  const filterExpanded = ref(false);
  const selectedStatuses = ref<QuestionBatchStatus[]>([]);
  const selectedBatch = ref<QuestionBatchModel | null>(null);
  const deleteDialogVisible = ref(false);
  const loadedBatches = computed(() => state.value.data ?? []);

  const statusFilters = computed(() => [
    { value: QuestionBatchStatusEnum.APPROVED, label: t('question_batch.approved') },
    { value: QuestionBatchStatusEnum.DRAFT, label: t('question_batch.draft') },
    {
      value: QuestionBatchStatusEnum.READY_FOR_REVIEW,
      label: t('question_batch.ready_for_review'),
    },
    { value: QuestionBatchStatusEnum.REJECTED, label: t('question_batch.failed') },
  ]);

  const summaryCards = computed<SummaryCard[]>(() => {
    const batches = loadedBatches.value;
    const countStatus = (status: QuestionBatchStatus) =>
      batches.filter((batch) => batch.status === status).length;

    return [
      {
        key: 'total',
        label: t('question_batch.total_batches'),
        value: controller.pagination.value?.total ?? batches.length,
      },
      {
        key: 'approved',
        label: t('question_batch.approved'),
        value: countStatus(QuestionBatchStatusEnum.APPROVED),
      },
      {
        key: 'draft',
        label: t('question_batch.draft'),
        value: countStatus(QuestionBatchStatusEnum.DRAFT),
      },
      {
        key: 'failed',
        label: t('question_batch.generated_failed'),
        value: countStatus(QuestionBatchStatusEnum.REJECTED),
      },
    ];
  });

  const filteredBatches = computed(() => {
    if (!selectedStatuses.value.length) return loadedBatches.value;
    return loadedBatches.value.filter((batch) => selectedStatuses.value.includes(batch.status));
  });

  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('question_batch.id'), width: '10%', sortable: true },
    { key: 'educationType', label: t('question_batch.education_type'), width: '14%' },
    { key: 'eCSubject', label: t('question_batch.subject_label'), width: '9%' },
    { key: 'curriculum', label: t('question_batch.curriculum'), width: '14%' },
    { key: 'numberOfQuestions', label: t('question_batch.questions_count'), width: '8%' },
    { key: 'sources', label: t('question_batch.sources'), width: '12%' },
    { key: 'status', label: t('question_batch.status'), width: '8%' },
    { key: 'createdAt', label: t('question_batch.created_at'), width: '8%' },
    { key: 'generationDate', label: t('question_batch.generation_date'), width: '9%' },
  ]);

  const sourcesLabel = (sources: string[]): string =>
    sources.filter(Boolean).join(', ') || t('question_batch.not_available');

  const educationPath = (educationType: QuestionBatchEducationTypeModel): string[] =>
    [educationType.title, ...educationType.children.map((child) => child.title)].filter(Boolean);

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
  const toggleFilters = (event: Event) => filterPopover.value?.toggle(event);
  const toggleStatus = (status: QuestionBatchStatus) => {
    const index = selectedStatuses.value.indexOf(status);
    if (index === -1) selectedStatuses.value.push(status);
    else selectedStatuses.value.splice(index, 1);
  };
  const openDeleteDialog = (batch: QuestionBatchModel) => {
    selectedBatch.value = batch;
    deleteDialogVisible.value = true;
  };
  const confirmDelete = (batch: QuestionBatchModel) => {
    emit('delete', batch);
    deleteDialogVisible.value = false;
  };

  onMounted(() => fetchBatches(Number(route.query.page ?? 1)));
</script>

<template>
  <main class="question-batch-index">
    <section class="question-batch-index__summary" :aria-label="t('question_batch.batch_summary')">
      <article
        v-for="card in summaryCards"
        :key="card.key"
        class="question-batch-index__summary-card"
        :data-summary="card.key"
      >
        <span>{{ card.label }}</span>
        <strong>{{ card.value }}</strong>
      </article>
    </section>

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
      <button
        type="button"
        class="question-batch-index__filter"
        :class="{ 'question-batch-index__filter--active': selectedStatuses.length }"
        aria-haspopup="menu"
        :aria-expanded="filterExpanded"
        @click="toggleFilters"
      >
        <span>{{ t('question_batch.filter') }}</span>
        <span v-if="selectedStatuses.length" class="question-batch-index__filter-count">
          {{ selectedStatuses.length }}
        </span>
        <DialogIconFillter />
      </button>

      <Popover
        ref="filterPopover"
        :pt="{
          root: 'question-batch-filter-popover',
          content: 'question-batch-filter-popover__content',
        }"
        @show="filterExpanded = true"
        @hide="filterExpanded = false"
      >
        <div
          class="question-batch-filter"
          role="group"
          :aria-label="t('question_batch.filter_status')"
        >
          <div class="question-batch-filter__heading">
            <strong>{{ t('question_batch.filter_status') }}</strong>
            <button v-if="selectedStatuses.length" type="button" @click="selectedStatuses = []">
              {{ t('question_batch.reset_filters') }}
            </button>
          </div>
          <button
            v-for="option in statusFilters"
            :key="option.value"
            type="button"
            class="question-batch-filter__option"
            role="checkbox"
            :aria-checked="selectedStatuses.includes(option.value)"
            @click="toggleStatus(option.value)"
          >
            <span class="question-batch-filter__checkbox" aria-hidden="true">✓</span>
            <span>{{ option.label }}</span>
          </button>
        </div>
      </Popover>
    </header>

    <DataStatusBuilder :controller="state" :on-retry="() => fetchBatches()">
      <template #success>
        <div class="question-batch-index__table">
          <AppTable
            :headers="headers"
            :items="filteredBatches"
            row-key="id"
            selectable
            :empty-message="t('question_batch.no_batches_for_filter')"
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
                  class="question-batch-index__education-path"
                >
                  <span
                    v-for="(title, index) in educationPath(educationType)"
                    :key="`${educationType.id}-${index}`"
                    class="question-batch-index__education-level"
                  >
                    <span>{{ title }}</span>
                    <ArticleArrow
                      v-if="index < educationPath(educationType).length - 1"
                      class="question-batch-index__education-arrow"
                    />
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
            <template #actions="{ item }">
              <QuestionBatchActions
                :status="item.status"
                @view="emit('view', item)"
                @approve="emit('approve', item)"
                @delete="openDeleteDialog(item)"
              />
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

    <QuestionBatchDeleteDialog
      v-model="deleteDialogVisible"
      :batch="selectedBatch"
      @confirm="confirmDelete"
    />
  </main>
</template>

<style lang="scss">
  @use '../styles/question_batch';
</style>
