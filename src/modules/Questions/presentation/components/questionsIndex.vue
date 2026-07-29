<script setup lang="ts">
  import { onMounted, ref, computed, watch } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import DeleteEmployeeParams from '../../core/params/delete.question.params';
  import DeleteDialog from '@/shared/HelpersComponents/dialog/DeleteDialog.vue';
  import { useFormsStore } from '@/stores/formsStore';
  import IndexPluseIcon from '@/shared/icons/IndexPluseIcon.vue';
  // import ExportExcelIcon from '@/shared/icons/ExportExcelIcon.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  // import MultiSelectionTabs from '../subComponents/MultiSelectionTabs.vue';
  import questionsController from '../controllers/questions.controller';
  import { QuestionGeneratedByEnum } from '../../core/constant/generatedby.enum';
  import { QuestionTypeEnum } from '../../core/constant/question.type.enum';
  import { QuestionDifficultyEnum } from '../../core/constant/question.difficulty.enum';
  import { QuestionStatusEnum } from '../../core/constant/question.status.enum';
  import type questionsModel from '../../core/models/questions.model';
  import IndexQuestionsParams from '../../core/params/index.question.params';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import DatePicker from 'primevue/datepicker';
  import { useI18n } from 'vue-i18n';

  // Controller instance
  const controller = questionsController.getInstance();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const FormStore = useFormsStore();
  const formRoute = computed(() => '/questions/add');

  // Table headers
  const headers: TableHeader[] = [
    { key: 'id', label: 'ID', width: '10%', sortable: true },
    { key: 'title', label: 'Question', width: '30%' },
    { key: 'questionType', label: 'Type', width: '15%' },
    { key: 'difficulty', label: 'Difficulty', width: '15%' },
    { key: 'status', label: 'Status', width: '20%' },
  ];

  // Pagination state
  const perPage = ref(10);
  const word = ref('');
  const selectedStatus = ref<TitleInterface<string>>();
  const selectedQuestionType = ref<TitleInterface<string>>();
  const fromDate = ref<Date | null>(null);
  const toDate = ref<Date | null>(null);

  const fetchQuestions = async (page: number = 1, wordStr: string = '') => {
    await controller.fetchList(
      new IndexQuestionsParams({
        word: wordStr || word.value,
        pageNumber: page,
        perPage: perPage.value,
        withPage: 1,
        ...(route.query.subjectId ? { subjectId: Number(route.query.subjectId) } : {}),
        ...(route.query.branchId ? { branchId: Number(route.query.branchId) } : {}),
        ...(selectedStatus.value?.id
          ? { status: Number(selectedStatus.value.id) as QuestionStatusEnum }
          : {}),
        ...(selectedQuestionType.value?.id
          ? { question_type: Number(selectedQuestionType.value.id) as QuestionTypeEnum }
          : {}),
        ...(fromDate.value ? { from_date: formatDate(fromDate.value) } : {}),
        ...(toDate.value ? { to_date: formatDate(toDate.value) } : {}),
      }),
    );
  };

  const Search = debounce(() => {
    router.push({
      query: {
        ...route.query,
        page: 1,
        word: word.value || undefined,
      },
    });
    fetchQuestions(1, word.value);
  });

  const onPageChange = (page: number) => {
    fetchQuestions(page);
    router.push({
      query: {
        ...route.query,
        page: String(page),
        word: word.value,
      },
    });
  };

  const onPerPageChange = (count: number) => {
    perPage.value = count;
    fetchQuestions(1);
  };

  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }
    syncStatusFromQuery();
    await fetchQuestions(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  const deleteQuestion = async (id: number) => {
    await controller.delete(new DeleteEmployeeParams(id));
    await fetchQuestions();
  };

  const isDraft = computed(() => {
    const data = FormStore?.formData[formRoute.value] ?? {};
    return Object.keys(data).length === 0 || Object.values(data).every((v) => v == null);
  });

  const FilterDialogShow = ref<boolean>(false);
  const ApplayFilter = () => {
    FilterDialogShow.value = false;
    router.push({ query: { ...route.query, page: 1 } });
    fetchQuestions(1);
  };
  const resetFilters = () => {
    selectedStatus.value = undefined;
    selectedQuestionType.value = undefined;
    fromDate.value = null;
    toDate.value = null;
    FilterDialogShow.value = false;
    const query = { ...route.query };
    delete query.status;
    router.push({ query: { ...query, page: 1 } });
    fetchQuestions(1);
  };

  const GetGneratedBy = (val: QuestionGeneratedByEnum) => {
    switch (val) {
      case QuestionGeneratedByEnum.manual:
        return 'Manual';
      case QuestionGeneratedByEnum.ai:
        return 'AI';
    }
  };

  const GetQusetionType = (val: QuestionTypeEnum) => {
    switch (val) {
      case QuestionTypeEnum.mcq:
        return 'MCQ';
      case QuestionTypeEnum.complate:
        return 'Complete';
      case QuestionTypeEnum.true_false:
        return 'True/False';
      case QuestionTypeEnum.ranking:
        return 'Ranking';
      case QuestionTypeEnum.matching:
        return 'Matching';
      case QuestionTypeEnum.paragraph:
        return 'Artical';
    }
  };

  const GetDifficulty = (val: QuestionDifficultyEnum) => {
    switch (val) {
      case QuestionDifficultyEnum.easy:
        return 'Easy';
      case QuestionDifficultyEnum.medium:
        return 'Medium';
      case QuestionDifficultyEnum.hard:
        return 'Hard';
    }
  };

  const GetQuestionStatus = (val: QuestionStatusEnum) => {
    switch (val) {
      case QuestionStatusEnum.APPROVED:
        return t('question_filters.approved');
      case QuestionStatusEnum.ARCHIVED:
        return t('question_filters.archive');
      case QuestionStatusEnum.CREATED:
        return t('question_filters.created');
      case QuestionStatusEnum.DRAFT:
        return t('question_filters.draft');
      case QuestionStatusEnum.NOT_REVIEW:
        return t('question_filters.not_reviewed');
      case QuestionStatusEnum.REJECTED:
        return t('question_filters.rejected');
      case QuestionStatusEnum.REVISION:
        return t('question_filters.revision');
      default:
        return '--';
    }
  };

  const statusOptions = computed<TitleInterface<string>[]>(() => [
    new TitleInterface({ id: QuestionStatusEnum.APPROVED, title: t('question_filters.approved') }),
    new TitleInterface({
      id: QuestionStatusEnum.NOT_REVIEW,
      title: t('question_filters.not_reviewed'),
    }),
    new TitleInterface({ id: QuestionStatusEnum.REJECTED, title: t('question_filters.rejected') }),
    new TitleInterface({ id: QuestionStatusEnum.CREATED, title: t('question_filters.created') }),
    new TitleInterface({ id: QuestionStatusEnum.REVISION, title: t('question_filters.revision') }),
    new TitleInterface({ id: QuestionStatusEnum.ARCHIVED, title: t('question_filters.archive') }),
    new TitleInterface({ id: QuestionStatusEnum.DRAFT, title: t('question_filters.draft') }),
  ]);

  const syncStatusFromQuery = () => {
    const queryStatus = Number(route.query.status);
    selectedStatus.value = statusOptions.value.find((option) => Number(option.id) === queryStatus);
  };

  watch(
    () => route.query.status,
    async (status, previousStatus) => {
      if (status === previousStatus) return;
      syncStatusFromQuery();
      await fetchQuestions(1, word.value);
    },
  );

  const questionTypeOptions = computed<TitleInterface<string>[]>(() => [
    new TitleInterface({ id: QuestionTypeEnum.mcq, title: t('question_filters.mcq') }),
    new TitleInterface({
      id: QuestionTypeEnum.true_false,
      title: t('question_filters.true_false'),
    }),
    new TitleInterface({ id: QuestionTypeEnum.complate, title: t('question_filters.complete') }),
    new TitleInterface({ id: QuestionTypeEnum.matching, title: t('question_filters.matching') }),
    new TitleInterface({ id: QuestionTypeEnum.paragraph, title: t('question_filters.paragraph') }),
    new TitleInterface({ id: QuestionTypeEnum.ranking, title: t('question_filters.ranking') }),
  ]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
</script>

<template>
  <!-- <MultiSelectionTabs /> -->
  <div class="questions-page">
    <div class="index-header">
      <div class="search-field">
        <span class="search-icon">
          <IndexSearchIcon />
        </span>
        <input
          v-model="word"
          placeholder="Search by employee name or email…"
          class="search-input"
          type="text"
          @input="Search"
        />
      </div>
      <div class="btns-container">
        <!-- <button class="btn btn-secondary" @click="exportExcel">
          <ExportExcelIcon />
          <span>{{ $t('export') }}</span>
        </button> -->
        <router-link :to="formRoute" class="btn btn-primary btn-add">
          <IndexPluseIcon />
          <span>{{ isDraft ? 'Add Questions' : 'Continue Adding' }}</span>
        </router-link>
        <FilterDialog v-model="FilterDialogShow">
          <template #content>
            <div class="filter-body">
              <div class="form-fields">
                <div class="field-group">
                  <label class="field-label" for="question-status">
                    {{ $t('question_filters.status') }}
                  </label>
                  <div class="input-wrap">
                    <UpdatedCustomInputSelect
                      id="question-status"
                      v-model="selectedStatus"
                      :static-options="statusOptions"
                      :placeholder="$t('question_filters.select_status')"
                      :reload="false"
                    />
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label" for="question-type">
                    {{ $t('question_filters.type') }}
                  </label>
                  <div class="input-wrap">
                    <UpdatedCustomInputSelect
                      id="question-type"
                      v-model="selectedQuestionType"
                      :static-options="questionTypeOptions"
                      :placeholder="$t('question_filters.select_type')"
                      :reload="false"
                    />
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label" for="questions-from-date">
                    {{ $t('question_filters.from_date') }}
                  </label>
                  <div class="input-wrap">
                    <DatePicker
                      id="questions-from-date"
                      v-model="fromDate"
                      date-format="yy-mm-dd"
                      :max-date="toDate ?? undefined"
                      :placeholder="$t('question_filters.select_from_date')"
                      show-icon
                    />
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label" for="questions-to-date">
                    {{ $t('question_filters.to_date') }}
                  </label>
                  <div class="input-wrap">
                    <DatePicker
                      id="questions-to-date"
                      v-model="toDate"
                      date-format="yy-mm-dd"
                      :min-date="fromDate ?? undefined"
                      :placeholder="$t('question_filters.select_to_date')"
                      show-icon
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="filter-action">
              <button class="btn btn-cancel" @click="resetFilters">{{ $t('reset') }}</button>
              <button class="btn btn-primary" @click="ApplayFilter">{{ $t('apply') }}</button>
            </div>
          </template>
        </FilterDialog>
      </div>
    </div>

    <DataStatusBuilder :controller="state" :on-retry="async () => await fetchQuestions()">
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as questionsModel[]"
            :hoverable="true"
            :striped="true"
            show-index
          >
            <template #cell-title="{ item }">
              <div class="question-type">
                {{ item.title || '--' }}
              </div>
            </template>
            <template #cell-questionType="{ item }">
              <div class="question-type">
                {{ GetQusetionType(item.questionType) }}
              </div>
            </template>
            <template #cell-difficulty="{ item }">
              <div class="difficulty">
                {{ GetDifficulty(item.difficulty) }}
              </div>
            </template>
            <template #cell-status="{ item }">
              <div
                class="status"
                :class="{
                  'status-approved': item.status === QuestionStatusEnum.APPROVED,
                  'status-archived': item.status === QuestionStatusEnum.ARCHIVED,
                  'status-created': item.status === QuestionStatusEnum.CREATED,
                  'status-draft': item.status === QuestionStatusEnum.DRAFT,
                  'status-not-reviewed': item.status === QuestionStatusEnum.NOT_REVIEW,
                  'status-rejected': item.status === QuestionStatusEnum.REJECTED,
                  'status-revision': item.status === QuestionStatusEnum.REVISION,
                }"
              >
                {{ GetQuestionStatus(item.status) }}
              </div>
            </template>
            <template #cell-generatedBy="{ item }">
              <div class="generatedBy">
                {{ GetGneratedBy(item.generatedBy) }}
              </div>
            </template>

            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  v-if="item.status !== QuestionStatusEnum.APPROVED"
                  class="action-btn edit"
                  :to="`/questions/edit/${item.id}`"
                  title="Edit"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </router-link>

                <router-link
                  class="action-btn show"
                  :to="`/questions/show/${item.id}`"
                  title="Show"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </router-link>

                <DeleteDialog
                  v-if="item.status !== QuestionStatusEnum.APPROVED"
                  @delete="deleteQuestion(item.id!)"
                >
                  <template #Dialog>
                    <button class="action-btn delete" title="Delete">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </template>
                </DeleteDialog>
              </div>
            </template>
          </AppTable>
        </div>

        <Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="onPageChange"
          @count-per-page="onPerPageChange"
        />
      </template>

      <template #loader>
        <TableSkelaton
          :rows="5"
          :columns="headers.length"
          :has-actions="true"
          :show-index="true"
          :selectable="true"
        >
        </TableSkelaton>
      </template>
    </DataStatusBuilder>
  </div>
</template>

<style scoped>
  .form-fields {
    padding: 0 !important;
  }
</style>
