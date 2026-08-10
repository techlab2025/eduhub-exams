<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import DatePicker from 'primevue/datepicker';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import EducationClassificationController from '@/modules/EducationClassification/presentation/controllers/educationClassification.controller';
  import IndexEducationClassificationParams from '@/modules/EducationClassification/core/params/index.educationClassification.params';
  import PlanController from '@/modules/Plan/presentation/controllers/plan.controller';
  import { IndexPlanParams } from '@/modules/Plan/core/params/plan.params';
  import type StudentModel from '../../core/models/student.model';
  import { StudentStatusEnum } from '../../core/models/student.model';
  import {
    ChangeStudentStatusParams,
    ForceLogoutStudentParams,
    IndexStudentParams,
  } from '../../core/params/student.params';
  import StudentController from '../controllers/student.controller';
  const { t } = useI18n();
  const router = useRouter();
  const controller = StudentController.getInstance();
  const educationController = EducationClassificationController.getInstance();
  const planController = PlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const education = ref<TitleInterface<number> | null>(null);
  const plan = ref<TitleInterface<number> | null>(null);
  const status = ref<TitleInterface<number> | null>(null);
  const year = ref<number>();
  const fromDate = ref<Date | null>(null);
  const toDate = ref<Date | null>(null);
  const filterDialogVisible = ref(false);
  const statusOptions = computed(() => [
    { id: Number(StudentStatusEnum.ACTIVE), title: t('active') },
    { id: Number(StudentStatusEnum.ARCHIVE), title: t('archived') },
    { id: Number(StudentStatusEnum.BLOCK), title: t('blocked') },
  ]);
  const stats = computed(() => [
    { label: t('total_students'), value: controller.stats.value?.totalStudents ?? 0 },
    { label: t('active_students'), value: controller.stats.value?.activeStudents ?? 0 },
    { label: t('archived_students'), value: controller.stats.value?.archivedStudents ?? 0 },
    { label: t('blocked_students'), value: controller.stats.value?.blockedStudents ?? 0 },
  ]);
  const headers = computed<TableHeader[]>(() => [
    { key: 'name', label: t('student') },
    { key: 'serial', label: t('serial') },
    { key: 'educationType', label: t('education_type') },
    { key: 'currentPlan', label: t('current_plan') },
    { key: 'examsCount', label: t('exams') },
    { key: 'studyPlanCount', label: t('study_plans') },
    { key: 'status', label: t('status') },
    { key: 'joinDate', label: t('join_date') },
  ]);
  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexStudentParams(word.value, page, perPage.value, {
        educationTypeId: education.value ? Number(education.value.id) : undefined,
        planId: plan.value ? Number(plan.value.id) : undefined,
        year: year.value,
        status: status.value ? (String(status.value.id) as StudentStatusEnum) : undefined,
        joinDateFrom: dateValue(fromDate.value),
        joinDateTo: dateValue(toDate.value),
      }),
    );
  const changeStatus = async (item: StudentModel, next: StudentStatusEnum) => {
    const reason =
      next === StudentStatusEnum.BLOCK
        ? (window.prompt(t('block_reason')) ?? undefined)
        : undefined;
    await controller.changeStatus(new ChangeStudentStatusParams(item.id, next, reason));
    await Promise.all([fetchItems(), controller.fetchStats()]);
  };
  const forceLogout = async (id: number) => {
    if (!window.confirm(t('confirm_force_logout'))) return;
    await controller.forceLogout(new ForceLogoutStudentParams(id));
  };
  const applyFilters = async () => {
    filterDialogVisible.value = false;
    await fetchItems();
  };
  const resetFilters = async () => {
    education.value = null;
    plan.value = null;
    status.value = null;
    year.value = undefined;
    fromDate.value = null;
    toDate.value = null;
    await applyFilters();
  };
  onMounted(() => Promise.all([fetchItems(), controller.fetchStats()]));
</script>

<template>
  <section>
    <div class="stat-grid">
      <article v-for="card in stats" :key="card.label">
        <span>{{ card.label }}</span
        ><strong>{{ card.value }}</strong>
      </article>
    </div>
    <header class="index-header">
      <input
        v-model="word"
        class="search-input"
        :placeholder="$t('search')"
        @input="fetchItems()"
      />
      <FilterDialog v-model="filterDialogVisible">
        <template #content>
          <div class="filters">
            <UpdatedCustomInputSelect
              v-model="education"
              :label="$t('education_type')"
              :placeholder="$t('select_education_type')"
              :controller="educationController"
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
            />
            <UpdatedCustomInputSelect
              v-model="plan"
              :label="$t('plan')"
              :placeholder="$t('select_plan')"
              :controller="planController"
              :params="new IndexPlanParams('', 1, 100)"
            />
            <UpdatedCustomInputSelect
              v-model="status"
              :label="$t('status')"
              :placeholder="$t('select_status')"
              :static-options="statusOptions"
            />
            <input v-model.number="year" type="number" :placeholder="$t('year')" />
            <DatePicker
              v-model="fromDate"
              :placeholder="$t('join_from')"
              show-icon
              panel-class="light-datepicker-panel"
            />
            <DatePicker
              v-model="toDate"
              :placeholder="$t('join_to')"
              show-icon
              panel-class="light-datepicker-panel"
            />
            <div class="filter-actions">
              <button class="btn btn-cancel" @click="resetFilters">{{ $t('reset') }}</button>
              <button class="btn btn-primary" @click="applyFilters">{{ $t('apply') }}</button>
            </div>
          </div>
        </template>
      </FilterDialog>
    </header>
    <DataStatusBuilder
      :controller="state"
      :on-retry="
        async () => {
          await fetchItems();
        }
      "
      ><template #success="{ data }"
        ><AppTable :headers="headers" :items="data as StudentModel[]" show-index
          ><template #cell-name="{ item }"
            ><div class="student-name">
              <img v-if="item.image" :src="item.image" :alt="item.name" />{{ item.name }}
            </div></template
          ><template #cell-educationType="{ item }">{{ item.educationType?.title }}</template
          ><template #cell-currentPlan="{ item }">{{ item.currentPlan?.title }}</template
          ><template #cell-status="{ item }"
            ><select
              :value="item.status"
              @change="
                changeStatus(item, ($event.target as HTMLSelectElement).value as StudentStatusEnum)
              "
            >
              <option v-for="option in statusOptions" :key="option.id" :value="option.id">
                {{ option.title }}
              </option>
            </select></template
          ><template #actions="{ item }"
            ><div class="row-actions">
              <button class="btn" @click="router.push(`/students/${item.id}`)">
                {{ $t('view') }}</button
              ><button class="btn btn-cancel" @click="forceLogout(item.id)">
                {{ $t('force_logout') }}
              </button>
            </div></template
          ></AppTable
        ><Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="fetchItems"
          @count-per-page="
            (count) => {
              perPage = count;
              fetchItems();
            }
          " /></template
    ></DataStatusBuilder>
  </section>
</template>

<style scoped lang="scss">
  .stat-grid,
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--xs-size);
    margin-bottom: var(--xl-size-base);
  }

  .stat-grid article,
  .filters {
    padding: var(--xl-size-base);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .stat-grid article {
    display: grid;
    gap: var(--xs-size);
  }

  .stat-grid strong {
    font-size: var(--xl-size);
    color: var(--PrimaryColor);
  }

  .index-header,
  .filter-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
  }

  .filter-actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }

  .filters input,
  select {
    min-height: 44px;
    padding: var(--xs-size);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
    background: var(--BgWhite);
  }

  .student-name,
  .row-actions {
    display: flex;
    align-items: center;
    gap: var(--xs-size);
  }

  .student-name img {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  :global(.light-datepicker-panel) {
    color-scheme: light;
    background: var(--BgWhite);
  }
</style>
