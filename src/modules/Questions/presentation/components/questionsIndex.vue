<script setup lang="ts">
  import { onMounted, ref, computed, watch } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import DeleteEmployeeParams from '../../core/params/delete.question.params';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import ShowIcon from '@/shared/icons/ShowIcon.vue';
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
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';
  import wordSlice from '@/base/Presentation/Utils/word_slice';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';

  // Controller instance
  const controller = questionsController.getInstance();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const FormStore = useFormsStore();
  const formRoute = computed(() => '/questions/add');
  const nonArticleQuestionTypes: QuestionTypeEnum[] = [
    QuestionTypeEnum.mcq,
    QuestionTypeEnum.true_false,
    QuestionTypeEnum.complate,
    QuestionTypeEnum.matching,
    QuestionTypeEnum.ranking,
  ];

  const getNonArticleQuestions = (items: questionsModel[]) =>
    items.filter((item) => item.questionType !== QuestionTypeEnum.paragraph);

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
          : { question_type: nonArticleQuestionTypes }),
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

  const actionList = (item: questionsModel) => {
    const questionId = item.id ?? 0;
    const viewAction = {
      text: t('show_question'),
      icon: ShowIcon,
      link: `/questions/show/${questionId}`,
    };

    if (item.status === QuestionStatusEnum.APPROVED) {
      return [viewAction];
    }

    return [
      {
        text: t('Edit'),
        icon: EditIcon,
        link:
          item.questionType === QuestionTypeEnum.paragraph
            ? `/articles/edit/${questionId}`
            : `/questions/edit/${questionId}`,
      },
      viewAction,
      {
        text: t('delete'),
        icon: DeletIcon,
        action: () => deleteQuestion(questionId),
      },
    ];
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
    new TitleInterface({ id: QuestionTypeEnum.ranking, title: t('question_filters.ranking') }),
  ]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const selectedRows = ref<questionsModel[]>([]);
  const deleteSelected = () => {
    selectedRows.value.forEach((item) => {
      // delete
      deleteQuestion(item.id!);
    });
    selectedRows.value = [];
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
        <FilterDialog
          v-model="FilterDialogShow"
          dialog-class="questions-filter-dialog"
          width="30rem"
        >
          <template #content>
            <div class="questions-filters">
              <section class="question-filter-section question-filter-select">
                <UpdatedCustomInputSelect
                  id="question-status"
                  v-model="selectedStatus"
                  :static-options="statusOptions"
                  :placeholder="$t('question_filters.select_status')"
                  :reload="false"
                  has-header
                >
                  <template #Header>
                    <div class="question-filter-heading">
                      <h2>{{ $t('question_filters.status') }}</h2>
                      <button
                        type="button"
                        class="question-filter-reset"
                        :aria-label="$t('reset')"
                        @click="selectedStatus = undefined"
                      >
                        <ReloadIcon />
                      </button>
                    </div>
                  </template>
                </UpdatedCustomInputSelect>
              </section>

              <section class="question-filter-section question-filter-select">
                <UpdatedCustomInputSelect
                  id="question-type"
                  v-model="selectedQuestionType"
                  :static-options="questionTypeOptions"
                  :placeholder="$t('question_filters.select_type')"
                  :reload="false"
                  has-header
                >
                  <template #Header>
                    <div class="question-filter-heading">
                      <h2>{{ $t('question_filters.type') }}</h2>
                      <button
                        type="button"
                        class="question-filter-reset"
                        :aria-label="$t('reset')"
                        @click="selectedQuestionType = undefined"
                      >
                        <ReloadIcon />
                      </button>
                    </div>
                  </template>
                </UpdatedCustomInputSelect>
              </section>

              <section class="question-filter-section question-filter-date">
                <div class="question-filter-heading">
                  <h2>{{ $t('question_filters.from_date') }}</h2>
                  <button
                    type="button"
                    class="question-filter-reset"
                    :aria-label="$t('reset')"
                    @click="fromDate = null"
                  >
                    <ReloadIcon />
                  </button>
                </div>
                <DatePicker
                  id="questions-from-date"
                  v-model="fromDate"
                  date-format="yy-mm-dd"
                  :max-date="toDate ?? undefined"
                  :placeholder="$t('question_filters.select_from_date')"
                  panel-class="light-datepicker-panel"
                  show-icon
                />
              </section>

              <section class="question-filter-section question-filter-date">
                <div class="question-filter-heading">
                  <h2>{{ $t('question_filters.to_date') }}</h2>
                  <button
                    type="button"
                    class="question-filter-reset"
                    :aria-label="$t('reset')"
                    @click="toDate = null"
                  >
                    <ReloadIcon />
                  </button>
                </div>
                <DatePicker
                  id="questions-to-date"
                  v-model="toDate"
                  date-format="yy-mm-dd"
                  :min-date="fromDate ?? undefined"
                  :placeholder="$t('question_filters.select_to_date')"
                  panel-class="light-datepicker-panel"
                  show-icon
                />
              </section>

              <div class="question-filter-actions">
                <button type="button" class="btn btn-primary" @click="ApplayFilter">
                  {{ $t('apply') }}
                </button>
                <button type="button" class="btn btn-cancel" @click="resetFilters">
                  {{ $t('reset') }}
                </button>
              </div>
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
            :items="getNonArticleQuestions(data as questionsModel[])"
            :hoverable="true"
            :striped="true"
            show-index
            :selectable="true"
            :row-selectable="(item) => item.status !== QuestionStatusEnum.APPROVED"
            @selection-change="selectedRows = $event"
          >
            <!-- :row-disabled="
  (item) => selectedRows.length > 0 &&
    item.status === QuestionStatusEnum.APPROVED
"
:row-selectable="
  (item) => !(selectedRows.length > 0 &&
    item.status === QuestionStatusEnum.APPROVED)
" -->

            <template #cell-title="{ item }">
              <div class="question-type">
                {{ wordSlice(item.title, 35) || '--' }}
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
                <DropList
                  :action-list="actionList(item)"
                  :delete-dialog-title="
                    $t('are_you_sure_you_want_to_remove_this_education_classification')
                  "
                  :delete-dialog-message="
                    $t(
                      'Deleting_this_classification_will_remove_all_related_data_including_any_configurations_and_tree_structures_This_action_is_irreversible_and_the_classification_must_be_created_again_if_needed',
                    )
                  "
                />
              </div>
            </template>
          </AppTable>
        </div>

        <div class="delete-container" v-if="selectedRows.length > 0">
          <div class="selected-count">{{ selectedRows.length }} question</div>
          <button class="btn btn-danger" @click="deleteSelected">Delete Selected</button>
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
      <template #empty>
        <NoItemContainer
          :title="t('no_questions.title')"
          :description="t('no_questions.description')"
        />
      </template>
    </DataStatusBuilder>
  </div>
</template>

<style scoped lang="scss">
  .delete-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e6e6e6;
    border-radius: 24px;
    margin-block: 10px;
    padding: 10px;

    .btn-danger {
      margin-left: auto;
      color: white;
      background-color: var(--Red);
    }

    .selected-count {
      color: #121212;
      font-size: 14px;
      font-weight: 700;
      font-family: 'bold';
    }
  }

  .form-fields {
    padding: 0 !important;
  }

  .question-type {
    color: #121212;
    font-size: 16px;
    font-weight: 500;
    font-family: 'Medium';
  }

  :global(.questions-filter-dialog) {
    inset-block-start: 0 !important;
    inset-inline-start: auto !important;
    inset-inline-end: 0 !important;
    // width: min(16rem, 100vw) !important;
    // height: 100dvh;
    // max-height: 100dvh;
    max-height: fit-content !important;
    margin: 0;
    overflow: hidden;
    background: var(--standard-white) !important;
    border: 0;
    border-radius: 0;
    box-shadow: var(--shadow-md);
    transform: none !important;

    .p-dialog-header {
      padding: 26px 10px 6px;
    }

    .p-dialog-header-actions {
      display: none;
    }

    .p-dialog-content {
      height: 100%;
      padding: 0 10px 18px !important;
      overflow-y: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .filter-title {
      margin: 0;
      color: var(--standard-black);
      font-family: var(--font-family);
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
    }
  }

  .questions-filters {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .question-filter-section {
    padding-block: 17px 13px;
    border-bottom: 1px solid var(--input-border-color);
  }

  .question-filter-heading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    h2 {
      margin: 0;
      color: var(--title-header-color);
      font-family: var(--font-family);
      font-size: 12px;
      font-weight: 600;
      line-height: 17px;
    }
  }

  .question-filter-reset {
    width: 20px;
    height: 20px;
    padding: 0;
    display: grid;
    place-items: center;
    color: var(--gray-text);
    background: transparent;
    border: 0;
    cursor: pointer;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }

  .question-filter-select {
    :deep(.input-label) {
      width: 100%;
    }

    :deep(.input-select) {
      width: 100%;
      height: 34px;
      border: 1px solid var(--input-border-color);
      border-radius: var(--radius-full);
      background: var(--standard-white);
    }

    :deep(.p-select-label) {
      padding-inline: 12px;
      display: flex;
      align-items: center;
      color: var(--gray-text);
      font-size: 10px;
    }

    :deep(.p-select-dropdown) {
      width: 34px;
      color: var(--gray-text);
    }
  }

  .question-filter-date {
    :deep(.p-datepicker) {
      width: 100%;
    }

    :deep(.p-inputtext) {
      width: 100%;
      min-width: 0;
      height: 34px;
      padding-inline: 12px 2px;
      color: var(--gray-text);
      background: var(--standard-white);
      border: 1px solid var(--input-border-color);
      border-inline-end: 0;
      border-radius: var(--radius-full) 0 0 var(--radius-full) !important;
      font-size: 10px !important;
    }

    :deep(.p-datepicker-dropdown) {
      width: 34px;
      color: var(--gray-text);
      background: var(--standard-white);
      border: 1px solid var(--input-border-color);
      border-inline-start: 0;
      border-radius: 0 var(--radius-full) var(--radius-full) 0;
    }
  }

  .question-filter-actions {
    display: grid;
    grid-template-columns: minmax(0, 2.15fr) minmax(70px, 1fr);
    gap: 10px;
    margin-top: auto;
    padding-top: 20px;

    .btn {
      width: 100%;
      height: 30px;
      margin: 0 !important;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 10px;
      font-weight: 500;
    }

    .btn-primary {
      color: var(--standard-white);
      background: var(--primary-green);
      border: 1px solid var(--primary-green);
    }

    .btn-cancel {
      color: var(--btn-red);
      background: var(--background-btn-outline-color);
      border: 1px solid var(--background-btn-hard-color);
    }
  }

  :global(.light-datepicker-panel) {
    color-scheme: light;
    background: var(--standard-white);
  }
</style>
