<script setup lang="ts">
  import { computed, h, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import DatePicker from 'primevue/datepicker';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';
  import PlanViewIcon from '@/shared/icons/Plan/PlanViewIcon.vue';
  import ArchiveIcon from '@/shared/icons/Plan/ArchiveIcon.vue';
  import AddNoteIconSource from '@/assets/icons/Student/add-note.svg';
  import BlockIconSource from '@/assets/icons/Student/block.svg';
  import ForceLogoutIconSource from '@/assets/icons/Student/force-logout.svg';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import type BaseController from '@/base/Presentation/Controller/baseController';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import EducationClassificationController from '@/modules/EducationClassification/presentation/controllers/educationClassification.controller';
  import IndexEducationClassificationParams from '@/modules/EducationClassification/core/params/index.educationClassification.params';
  import PlanController from '@/modules/Plan/presentation/controllers/plan.controller';
  import IndexPlanParams from '@/modules/Plan/core/params/index.plan.params';
  import type StudentModel from '../../core/models/student.model';
  import { StudentStatusEnum } from '../../core/models/student.model';
  import { ChangeStudentStatusParams } from '../../core/params/change.student.status.params';
  import { AddStudentNoteParams } from '../../core/params/add.student.note.params';
  import { ForceLogoutStudentParams } from '../../core/params/force.logout.student.params';
  import { IndexStudentParams } from '../../core/params/index.student.params';
  import StudentController from '../controllers/student.controller';
  import StudentArchiveDialog from '../subComponents/StudentArchiveDialog.vue';
  import StudentBlockDialog from '../subComponents/StudentBlockDialog.vue';
  import StudentForceLogoutDialog from '../subComponents/StudentForceLogoutDialog.vue';
  import StudentNoteDialog from '../subComponents/StudentNoteDialog.vue';

  type StudentListMode = 'active' | 'archive';

  const { t } = useI18n();
  const controller = StudentController.getInstance();
  const educationController = EducationClassificationController.getInstance();
  const educationSelectController = educationController as unknown as BaseController<
    unknown,
    unknown[]
  >;
  const planController = PlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const listMode = ref<StudentListMode>('active');
  const education = ref<TitleInterface<number> | null>(null);
  const plan = ref<TitleInterface<number> | null>(null);
  const status = ref<TitleInterface<number> | null>(null);
  const year = ref<TitleInterface<number> | null>(null);
  const fromDate = ref<Date | null>(null);
  const toDate = ref<Date | null>(null);
  const filterDialogVisible = ref(false);
  const archiveDialogVisible = ref(false);
  const blockDialogVisible = ref(false);
  const forceLogoutDialogVisible = ref(false);
  const noteDialogVisible = ref(false);
  const statusActionLoading = ref(false);
  const forceLogoutLoading = ref(false);
  const noteActionLoading = ref(false);
  const selectedStudent = ref<StudentModel | null>(null);

  const AddNoteIcon = () => h('img', { src: AddNoteIconSource, alt: '' });
  const BlockIcon = () => h('img', { src: BlockIconSource, alt: '' });
  const ForceLogoutIcon = () => h('img', { src: ForceLogoutIconSource, alt: '' });
  const statusOptions = computed(() => [
    { id: Number(StudentStatusEnum.ACTIVE), title: t('active') },
    { id: Number(StudentStatusEnum.ARCHIVE), title: t('archive') },
    { id: Number(StudentStatusEnum.BLOCK), title: t('block') },
  ]);
  const yearOptions = computed<TitleInterface<number>[]>(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, index) => ({
      id: currentYear - index,
      title: String(currentYear - index),
    }));
  });
  const stats = computed(() => [
    { label: t('total_students'), value: controller.stats.value?.totalStudents ?? 0 },
    { label: t('active'), value: controller.stats.value?.activeStudents ?? 0 },
    { label: t('archive'), value: controller.stats.value?.archivedStudents ?? 0 },
    { label: t('block'), value: controller.stats.value?.blockedStudents ?? 0 },
  ]);
  const headers = computed<TableHeader[]>(() => [
    { key: 'id', label: t('student_id'), sortable: true, width: '7%' },
    { key: 'name', label: t('student'), sortable: true, width: '19%' },
    { key: 'educationType', label: t('education_type'), width: '17%' },
    { key: 'currentPlan', label: t('current_plan'), width: '13%' },
    { key: 'examsCount', label: t('num_of_exams'), width: '12%' },
    { key: 'studyPlanCount', label: t('num_of_study_plan'), width: '14%' },
    { key: 'status', label: t('status'), width: '9%' },
    { key: 'joinDate', label: t('join_date'), width: '12%' },
  ]);

  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const selectedStatus = () =>
    listMode.value === 'archive'
      ? StudentStatusEnum.ARCHIVE
      : status.value
        ? (String(status.value.id) as StudentStatusEnum)
        : undefined;
  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexStudentParams(word.value, page, perPage.value, {
        educationTypeId: education.value ? Number(education.value.id) : undefined,
        planId: plan.value ? Number(plan.value.id) : undefined,
        year: year.value ? Number(year.value.id) : undefined,
        status: selectedStatus(),
        joinDateFrom: dateValue(fromDate.value),
        joinDateTo: dateValue(toDate.value),
      }),
    );
  const search = debounce(() => fetchItems(1));
  const setListMode = async (mode: StudentListMode) => {
    listMode.value = mode;
    await fetchItems(1);
  };
  const changeStatus = async (item: StudentModel, next: StudentStatusEnum, reason?: string) => {
    await controller.changeStatus(new ChangeStudentStatusParams(item.id, next, reason));
    await Promise.all([fetchItems(), controller.fetchStats()]);
  };
  const openArchiveDialog = (item: StudentModel) => {
    selectedStudent.value = item;
    archiveDialogVisible.value = true;
  };
  const openBlockDialog = (item: StudentModel) => {
    selectedStudent.value = item;
    blockDialogVisible.value = true;
  };
  const openNoteDialog = (item: StudentModel) => {
    selectedStudent.value = item;
    noteDialogVisible.value = true;
  };
  const openForceLogoutDialog = (item: StudentModel) => {
    selectedStudent.value = item;
    forceLogoutDialogVisible.value = true;
  };
  const addNote = async (payload: { studentId: number; note: string }) => {
    if (noteActionLoading.value) return;

    noteActionLoading.value = true;
    try {
      await controller.addNote(new AddStudentNoteParams(payload.studentId, payload.note));
      noteDialogVisible.value = false;
      selectedStudent.value = null;
    } finally {
      noteActionLoading.value = false;
    }
  };
  const toggleStatusFilter = (option: TitleInterface<number>) => {
    status.value = status.value?.id === option.id ? null : option;
  };
  const confirmStatusChange = async (
    status: StudentStatusEnum,
    dialogVisible: typeof archiveDialogVisible | typeof blockDialogVisible,
  ) => {
    if (!selectedStudent.value || statusActionLoading.value) return;

    statusActionLoading.value = true;
    try {
      await changeStatus(selectedStudent.value, status);
      dialogVisible.value = false;
      selectedStudent.value = null;
    } finally {
      statusActionLoading.value = false;
    }
  };
  const confirmArchive = () => confirmStatusChange(StudentStatusEnum.ARCHIVE, archiveDialogVisible);
  const confirmBlock = () => confirmStatusChange(StudentStatusEnum.BLOCK, blockDialogVisible);
  const confirmForceLogout = async () => {
    if (!selectedStudent.value || forceLogoutLoading.value) return;

    forceLogoutLoading.value = true;
    try {
      await controller.forceLogout(new ForceLogoutStudentParams(selectedStudent.value.id));
      forceLogoutDialogVisible.value = false;
      selectedStudent.value = null;
    } finally {
      forceLogoutLoading.value = false;
    }
  };
  const actionList = (item: StudentModel) => [
    {
      text: t('view'),
      icon: PlanViewIcon,
      link: `/students/${item.id}`,
    },
    {
      text: item.status === StudentStatusEnum.ARCHIVE ? t('active') : t('archive'),
      icon: ArchiveIcon,
      action: () =>
        item.status === StudentStatusEnum.ARCHIVE
          ? changeStatus(item, StudentStatusEnum.ACTIVE)
          : openArchiveDialog(item),
    },
    {
      text: t('add_note'),
      icon: AddNoteIcon,
      action: () => openNoteDialog(item),
    },
    {
      text: t('force_logout'),
      icon: ForceLogoutIcon,
      action: () => openForceLogoutDialog(item),
    },
    {
      text: item.status === StudentStatusEnum.BLOCK ? t('active') : t('block'),
      icon: BlockIcon,
      action: () =>
        item.status === StudentStatusEnum.BLOCK
          ? changeStatus(item, StudentStatusEnum.ACTIVE)
          : openBlockDialog(item),
      danger: item.status !== StudentStatusEnum.BLOCK,
    },
  ];
  const educationLabels = (item: StudentModel) =>
    [item.educationType?.title, item.educationStage?.title, item.grade?.title].filter(
      (label): label is string => Boolean(label),
    );
  const applyFilters = async () => {
    filterDialogVisible.value = false;
    listMode.value = status.value?.id === Number(StudentStatusEnum.ARCHIVE) ? 'archive' : 'active';
    await fetchItems(1);
  };
  const resetFilters = async () => {
    education.value = null;
    plan.value = null;
    status.value = null;
    year.value = null;
    fromDate.value = null;
    toDate.value = null;
    listMode.value = 'active';
    await applyFilters();
  };

  onMounted(() => Promise.all([fetchItems(), controller.fetchStats()]));
</script>

<template>
  <section class="student-page">
    <div class="student-stat-grid">
      <article v-for="card in stats" :key="card.label">
        <span>{{ card.label }}</span>
        <strong>{{ card.value.toLocaleString() }}</strong>
      </article>
    </div>

    <header class="student-index-header">
      <label class="student-search">
        <IndexSearchIcon aria-hidden="true" />
        <input
          v-model="word"
          type="search"
          :placeholder="$t('search_students_placeholder')"
          @input="search"
        />
      </label>

      <div class="student-toolbar-actions">
        <div class="student-mode-tabs" role="group" :aria-label="$t('student_status_filter')">
          <button
            type="button"
            :class="{ active: listMode === 'active' }"
            @click="setListMode('active')"
          >
            {{ $t('active') }}
          </button>
          <button
            type="button"
            :class="{ active: listMode === 'archive' }"
            @click="setListMode('archive')"
          >
            {{ $t('archive') }}
          </button>
        </div>

        <FilterDialog
          v-model="filterDialogVisible"
          dialog-class="student-filter-dialog"
          width="min(25.75rem, calc(100vw - 1.5rem))"
        >
          <template #content>
            <div class="student-filters">
              <section class="student-filter-section student-filter-select">
                <UpdatedCustomInputSelect
                  v-model="education"
                  :placeholder="$t('select_education_type')"
                  :controller="educationSelectController"
                  :params="
                    new IndexEducationClassificationParams({
                      word: '',
                      pageNumber: 1,
                      perPage: 100,
                      withPage: 0,
                      date: '',
                      order: 1,
                    })
                  "
                  has-header
                  :reload="false"
                >
                  <template #Header>
                    <div class="student-filter-heading">
                      <h2>{{ $t('education_type') }}</h2>
                      <button
                        type="button"
                        class="student-filter-reset"
                        :aria-label="$t('reset_education_filter')"
                        @click="education = null"
                      >
                        <ReloadIcon />
                      </button>
                    </div>
                  </template>
                </UpdatedCustomInputSelect>
              </section>

              <section class="student-filter-section student-filter-select">
                <UpdatedCustomInputSelect
                  v-model="year"
                  :placeholder="$t('select_year')"
                  :static-options="yearOptions"
                  has-header
                  :reload="false"
                >
                  <template #Header>
                    <div class="student-filter-heading">
                      <h2>{{ $t('by_year') }}</h2>
                      <button
                        type="button"
                        class="student-filter-reset"
                        :aria-label="$t('reset_year_filter')"
                        @click="year = null"
                      >
                        <ReloadIcon />
                      </button>
                    </div>
                  </template>
                </UpdatedCustomInputSelect>
              </section>

              <section class="student-filter-section student-filter-select">
                <UpdatedCustomInputSelect
                  v-model="plan"
                  :placeholder="$t('select_plan')"
                  :controller="planController"
                  :params="new IndexPlanParams('', 1, 100)"
                  has-header
                  :reload="false"
                >
                  <template #Header>
                    <div class="student-filter-heading">
                      <h2>{{ $t('plan') }}</h2>
                      <button
                        type="button"
                        class="student-filter-reset"
                        :aria-label="$t('reset_plan_filter')"
                        @click="plan = null"
                      >
                        <ReloadIcon />
                      </button>
                    </div>
                  </template>
                </UpdatedCustomInputSelect>
              </section>

              <section class="student-filter-section">
                <div class="student-filter-heading">
                  <h2>{{ $t('schedule_status') }}</h2>
                </div>
                <div class="student-status-options">
                  <label
                    v-for="option in statusOptions"
                    :key="option.id"
                    class="student-status-option"
                    :class="`student-status-option-${option.id}`"
                  >
                    <input
                      type="checkbox"
                      :checked="status?.id === option.id"
                      @change="toggleStatusFilter(option)"
                    />
                    <span class="student-status-box" aria-hidden="true"></span>
                    <span>{{ option.title }}</span>
                  </label>
                </div>
              </section>

              <section class="student-filter-section student-join-date-section">
                <div class="student-filter-heading">
                  <h2>{{ $t('join_date') }}</h2>
                </div>
                <div class="student-date-fields">
                  <label>
                    <span>{{ $t('from') }}</span>
                    <DatePicker
                      v-model="fromDate"
                      :placeholder="$t('date_placeholder')"
                      date-format="mm/dd/yy"
                      show-icon
                      panel-class="light-datepicker-panel"
                    />
                  </label>
                  <label>
                    <span>{{ $t('to') }}</span>
                    <DatePicker
                      v-model="toDate"
                      :placeholder="$t('date_placeholder')"
                      date-format="mm/dd/yy"
                      show-icon
                      panel-class="light-datepicker-panel"
                    />
                  </label>
                </div>
              </section>

              <div class="student-filter-actions">
                <button type="button" class="btn btn-primary" @click="applyFilters">
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
    </header>

    <div class="student-table-card">
      <DataStatusBuilder
        :controller="state"
        :on-retry="
          async () => {
            await fetchItems();
          }
        "
      >
        <template #success="{ data }">
          <AppTable :headers="headers" :items="data as StudentModel[]" row-key="id" selectable>
            <template #cell-name="{ item }">
              <div class="student-name-cell">
                <img v-if="item.image" :src="item.image" :alt="item.name" />
                <span v-else class="student-avatar-fallback" aria-hidden="true">
                  {{ item.name.charAt(0) }}
                </span>
                <strong>{{ item.name }}</strong>
              </div>
            </template>
            <template #cell-educationType="{ item }">
              <div class="student-education-cell">
                <span v-for="label in educationLabels(item)" :key="label">{{ label }}</span>
                <span v-if="educationLabels(item).length === 0">—</span>
              </div>
            </template>
            <template #cell-currentPlan="{ item }">{{ item.currentPlan?.title ?? '—' }}</template>
            <template #cell-status="{ item }">
              <span class="student-status" :class="`student-status-${item.status}`">
                {{ $t(`student_status_${item.status}`) }}
              </span>
            </template>
            <template #actions="{ item }">
              <DropList :action-list="actionList(item)" variant="student" />
            </template>
          </AppTable>

          <Pagination
            v-if="controller.pagination.value"
            :pagination="controller.pagination.value"
            @change-page="fetchItems"
            @count-per-page="
              (count) => {
                perPage = count;
                fetchItems();
              }
            "
          />
        </template>
      </DataStatusBuilder>
    </div>

    <StudentArchiveDialog
      v-model="archiveDialogVisible"
      :loading="statusActionLoading"
      @confirm="confirmArchive"
    />
    <StudentBlockDialog
      v-model="blockDialogVisible"
      :loading="statusActionLoading"
      @confirm="confirmBlock"
    />
    <StudentForceLogoutDialog
      v-model="forceLogoutDialogVisible"
      :loading="forceLogoutLoading"
      @confirm="confirmForceLogout"
    />
    <StudentNoteDialog
      v-model="noteDialogVisible"
      :student-id="selectedStudent?.id ?? null"
      :loading="noteActionLoading"
      @save="addNote"
    />
  </section>
</template>

<style scoped lang="scss">
  .student-page {
    display: grid;
    gap: 24px;
    font-family: var(--font-family);
  }

  .student-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;

    article {
      min-height: 92px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
      background: var(--background-color-soft-light);
      border: 1px solid var(--input-border-color);
      border-radius: 20px;
      box-shadow: var(--shadow-sm);
    }

    span {
      color: var(--Gray-6);
      font-size: 16px;
      font-weight: 500;
    }

    strong {
      color: var(--standard-black);
      font-size: 24px;
      font-weight: 600;
      line-height: 1;
    }
  }

  .student-index-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .student-search {
    width: min(420px, 100%);
    min-height: 48px;
    padding-inline: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--gray-text);
    background: var(--BgWhite);
    border: 1px solid var(--input-border-color);
    border-radius: var(--radius-full);

    input {
      width: 100%;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
    }
  }

  .student-toolbar-actions,
  .student-mode-tabs {
    display: flex;
    align-items: center;
  }

  .student-toolbar-actions {
    gap: 16px;
  }

  .student-mode-tabs {
    min-height: 48px;
    padding: 4px;
    background: var(--background-color-soft-light);
    border-radius: var(--radius-full);

    button {
      min-width: 76px;
      min-height: 40px;
      padding: 8px 16px;
      color: var(--gray-text);
      background: transparent;
      border: 0;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;

      &.active {
        color: var(--primary-green);
        background: var(--BgWhite);
      }
    }
  }

  .student-index-header :deep(.fillter-button) {
    min-width: 112px;
    min-height: 48px;
    padding-inline: 20px;
    gap: 10px;
    color: var(--standard-black);
    background: var(--BgWhite);
    border: 1px solid var(--input-border-color);
    border-radius: var(--radius-full);
    font-size: 15px;
    font-weight: 600;
  }

  .student-table-card {
    min-width: 0;
    overflow: hidden;
    background: var(--BgWhite);
    border-radius: 12px;
  }

  .student-table-card :deep(.app-table thead tr th) {
    padding: 16px 12px;
    background: var(--background-color-soft-light);
    border-bottom: 0;
    text-transform: none;
  }

  .student-table-card :deep(.app-table thead tr th .th-content) {
    justify-content: flex-start;
  }

  .student-table-card :deep(.app-table thead tr th .th-content span) {
    font-family: var(--font-family);
    font-size: 13px;
  }

  .student-table-card :deep(.app-table tbody tr td) {
    height: 84px;
    padding: 16px 12px;
    color: var(--Gray-6);
    font-size: 14px;
  }

  .student-table-card :deep(.app-table .th-checkbox),
  .student-table-card :deep(.app-table .td-checkbox) {
    width: 48px;
    padding-inline: 16px 4px;
  }

  .student-table-card :deep(.app-table .th-actions),
  .student-table-card :deep(.app-table .td-actions) {
    width: 48px;
    padding-inline: 4px 16px;
  }

  .student-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    img,
    .student-avatar-fallback {
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      border-radius: 10px;
    }

    img {
      object-fit: cover;
    }

    strong {
      color: var(--standard-black);
      font-size: 14px;
      font-weight: 600;
    }
  }

  .student-avatar-fallback {
    display: grid;
    place-items: center;
    color: var(--primary-green);
    background: var(--PrimaryColor-alpha-8);
    font-weight: 600;
  }

  .student-education-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      color: var(--gray-text);
      font-size: 12px;

      &:last-child {
        color: var(--Gray-6);
        font-weight: 600;
      }
    }
  }

  .student-status {
    font-weight: 500;
  }

  .student-status-1 {
    color: var(--info);
  }

  .student-status-2 {
    color: var(--gray-text);
  }

  .student-status-3 {
    color: var(--danger-alt);
  }

  .student-filters {
    display: flex;
    flex-direction: column;
  }

  :global(.student-filter-dialog) {
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
    overflow: hidden;
    background: var(--standard-white) !important;
    border-radius: 24px;
    box-shadow: var(--shadow-md);

    .p-dialog-header {
      padding: 24px 20px 0;
    }

    .p-dialog-header-actions {
      display: none;
    }

    .p-dialog-content {
      padding: 0 !important;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .filter-title {
      margin: 0;
      color: var(--standard-black);
      font-family: var(--font-family);
      font-size: 20px;
      font-weight: 600;
      line-height: normal;
    }
  }

  .student-filter-section {
    padding-block: 18px;
    border-bottom: 1px solid var(--input-border-color);

    &:first-child {
      padding-top: 10px;
    }
  }

  .student-filter-heading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    h2 {
      margin: 0;
      color: var(--title-header-color);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
    }
  }

  .student-filter-reset {
    width: 22px;
    height: 22px;
    padding: 0;
    display: grid;
    place-items: center;
    color: var(--gray-text);
    background: transparent;
    border: 0;
    cursor: pointer;

    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }

  .student-filter-select {
    :deep(.input-label) {
      width: 100%;
    }

    :deep(.input-select) {
      width: 100%;
      height: 48px;
      border: 1px solid var(--input-border-color);
      border-radius: var(--radius-full);
      background: var(--standard-white);
    }

    :deep(.p-select-label) {
      padding-inline: 16px;
      display: flex;
      align-items: center;
      color: var(--gray-text);
      font-size: 14px;
    }

    :deep(.p-select-dropdown) {
      width: 44px;
    }
  }

  .student-status-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .student-status-option {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--standard-black);
    cursor: pointer;
    font-size: 14px;

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
    }
  }

  .student-status-box {
    position: relative;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    background: var(--standard-white);
    border: 1px solid var(--gray-300);
    border-radius: 5px;
  }

  .student-status-option input:checked + .student-status-box {
    background: currentColor;
    border-color: currentColor;

    &::after {
      position: absolute;
      top: 3px;
      left: 6px;
      width: 4px;
      height: 8px;
      border: solid var(--standard-white);
      border-width: 0 2px 2px 0;
      content: '';
      transform: rotate(45deg);
    }
  }

  .student-status-option-1 {
    color: var(--info);
  }

  .student-status-option-2 {
    color: var(--standard-black);
  }

  .student-status-option-3 {
    color: var(--danger-alt);
  }

  .student-join-date-section {
    border-bottom: 0;
  }

  .student-date-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    label {
      min-width: 0;
      display: grid;
      gap: 6px;
      color: var(--title-header-color);
      font-size: 14px;
    }

    :deep(.p-datepicker) {
      width: 100%;
    }

    :deep(.p-inputtext) {
      width: 100%;
      min-width: 0;
      height: 48px;
      padding-inline: 14px 4px;
      color: var(--gray-text);
      border: 1px solid var(--input-border-color);
      border-inline-end: 0;
      border-radius: var(--radius-full) 0 0 var(--radius-full);
      font-size: 12px;
    }

    :deep(.p-datepicker-dropdown) {
      width: 42px;
      color: var(--gray-text);
      background: var(--standard-white);
      border: 1px solid var(--input-border-color);
      border-inline-start: 0;
      border-radius: 0 var(--radius-full) var(--radius-full) 0;
    }
  }

  .student-filter-actions {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(112px, 1fr);
    gap: 16px;
    padding-top: 8px;

    .btn {
      width: 100%;
      height: 52px;
      margin: 0 !important;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 15px;
      font-weight: 600;
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
    background: var(--BgWhite);
  }

  @media (max-width: 900px) {
    .student-stat-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .student-index-header {
      align-items: stretch;
      flex-direction: column;
    }

    .student-search {
      width: 100%;
    }

    .student-toolbar-actions {
      justify-content: space-between;
    }
  }

  @media (max-width: 560px) {
    .student-stat-grid {
      grid-template-columns: 1fr;
    }

    .student-toolbar-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .student-mode-tabs button {
      flex: 1;
    }

    .student-status-options {
      flex-wrap: wrap;
    }

    .student-date-fields {
      gap: 12px;
    }
  }
</style>
