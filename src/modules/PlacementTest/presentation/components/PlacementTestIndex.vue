<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  // import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  // import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import PlacementTestController from '../controllers/placement.test.controller';
  import { IndexEmployeeParams } from '@/modules/employee';
  import type PlcaementTestModel from '../../core/models/placement.test.model';
  import { PlacementTestEnum } from '../../core/constant/palcement.test.enum';
  import Articlearrow from '@/shared/icons/articlearrow.vue';
  import type EducationClassificationSubjectModel from '@/shared/GeneralModels/education.classification.subject.model';
  import Articlesubject from '@/shared/icons/articlesubject.vue';
  import ShowIcon from '@/shared/icons/ShowIcon.vue';

  // Controller instance
  const controller = PlacementTestController.getInstance();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();

  // const FormStore = useFormsStore();
  // const formRoute = computed(() => '/employees/add');

  // Table headers
  const headers: TableHeader[] = [
    { key: 'student', label: 'student ', width: '20%', sortable: true },
    { key: 'result', label: 'The result', width: '10%' },
    { key: 'EducationClassificationSubject', label: 'subject', width: '20%' },
    { key: 'numberOfQuestions', label: 'num of Q', width: '10%' },
    { key: 'status', label: 'status', width: '10%' },
    { key: 'in_plan', label: 'plan', width: '10%' },
    { key: 'date', label: 'date', width: '10%' },
    // { key: 'actions', label: 'Actions', width: '10%' },
  ];

  // Pagination state
  const perPage = ref(10);
  const word = ref('');

  const fetchPlacementTest = async (page: number = 1, wordStr: string = '') => {
    await controller.fetchList(
      new IndexEmployeeParams({
        word: wordStr || word.value,
        pageNumber: page,
        perPage: perPage.value,
        withPage: 1,
        status: null,
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
    fetchPlacementTest(1, word.value);
  });

  const onPageChange = (page: number) => {
    fetchPlacementTest(page);
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
    fetchPlacementTest(1);
  };

  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }
    await fetchPlacementTest(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  // const FilterDialogShow = ref<boolean>(false);
  // const ApplayFilter = () => {
  //   FilterDialogShow.value = false;
  //   fetchPlacementTest();
  // };
  // const CloseFiletrDialog = () => {
  //   FilterDialogShow.value = false;
  // };
  const GetPlasmentStatus = (status: number): string => {
    if (status === PlacementTestEnum.completed) {
      return 'Completed';
    }
    if (status === PlacementTestEnum.inprogress) {
      return 'In Progress';
    }
    if (status === PlacementTestEnum.rejected) {
      return 'Rejected';
    }
    return '';
  };

  const getSubjectPath = (item: EducationClassificationSubjectModel) => {
    if (!item?.fullTitle) return '';
    const parts = item.fullTitle?.split(/\s*->\s*/);

    return parts?.map((subject) => subject.trim()) ?? '';
  };
</script>

<template>
  <div class="employee-page">
    <div class="index-header">
      <div class="search-field">
        <span class="search-icon">
          <IndexSearchIcon />
        </span>
        <input
          v-model="word"
          placeholder="Search by placement test..."
          class="search-input"
          type="text"
          @input="Search"
        />
      </div>
      <div class="btns-container">
        <!-- <FilterDialog v-model="FilterDialogShow">
          <template #content>
            <UpdatedCustomInputSelect
              id="doc-type"
              v-model="selectedStatus"
              :label="`Employee Status`"
              :placeholder="`enter status`"
              :static-options="employeeTypeOptions"
              @update:model-value="UpdateStatus"
            />
            <div class="filter-action">
              <button class="btn btn-cancel" @click="CloseFiletrDialog">Reset</button>
              <button class="btn btn-primary" @click="ApplayFilter">apply</button>
            </div>
          </template>
        </FilterDialog> -->
      </div>
    </div>

    <DataStatusBuilder :controller="state">
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as PlcaementTestModel[]"
            :hoverable="true"
            :striped="true"
            show-index
          >
            <template #cell-status="{ value }">
              <span class="" :class="GetPlasmentStatus(value)">{{ GetPlasmentStatus(value) }}</span>
            </template>
            <template #cell-in_plan="{ value }">
              <span class="" :class="value ? 'text-success' : 'text-danger'">{{
                value ? 'Yes' : 'No'
              }}</span>
            </template>
            <template #cell-result="{ value }">
              <span class="">{{ value }} </span>
            </template>
            <template #cell-student="{ value }">
              <div class="student-container">
                <img :src="value.image" alt="" class="rounded-full" />
                <span class="">{{ value.name }}</span>
              </div>
            </template>
            <template #cell-EducationClassificationSubject="{ value }">
              <div class="subject-cell">
                <div class="parent-subject-curriculum">
                  <span
                    v-for="(subject, index) in getSubjectPath(value)"
                    :key="index"
                    class="subject-curriculum"
                  >
                    <p>{{ subject }}</p>
                    <Articlearrow
                      v-if="index < getSubjectPath(value).length - 1"
                      class="arrow-icon"
                    />
                  </span>
                </div>
                <div>
                  <Articlesubject />
                </div>
                <span class="subject-cycle">
                  <span class="subject-lang">{{ value?.title }}</span>
                </span>
              </div>
            </template>
            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  class="action-btn edit"
                  :to="`/placement-test/${item.id}`"
                  title="show"
                >
                  <ShowIcon />
                </router-link>
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

      <template #empty>
        <div class="empty-state">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3>No placement test found</h3>
          <p>Start by adding a new placement test to your organization</p>
          <!-- <router-link :to="formRoute" class="btn btn-primary empty-cta">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add Placement</span>
          </router-link> -->
        </div>
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
  .student-container {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 50px;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
</style>
