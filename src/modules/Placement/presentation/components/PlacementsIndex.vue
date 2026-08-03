<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import placementController from '../controllers/placement.controller';
  import IndexplacementParams from '../../core/params/index.placement.params';
  import type PlacementResultModel from '../../core/models/placementResult';

  const controller = placementController.getInstance();
  const state = computed(() => controller.listState.value);
  const router = useRouter();
  const route = useRoute();

  const headers: TableHeader[] = [
    { key: 'id', label: 'ID', width: '5%', sortable: true },
    { key: 'studentName', label: 'student', width: '15%' },
    { key: 'studentResult', label: 'The result ', width: '15%' },
    { key: 'subject', label: 'Subject', width: '15%' },
    { key: 'numberOfExams', label: 'Num of Exams', width: '15%' },
    { key: 'status', label: 'Status', width: '15%' },
    { key: 'plane', label: 'plane', width: '15%' },
    { key: 'date', label: 'Date', width: '15%' },
  ];

  // Pagination state
  const perPage = ref(10);
  const word = ref('');

  const fetchplacement = async (page: number = 1, wordStr: string = '') => {
    await controller.fetchList(
      new IndexplacementParams({
        word: wordStr || word.value,
        pageNumber: page,
        perPage: perPage.value,
        withPage: 1,
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
    fetchplacement(1, word.value);
  });

  const onPageChange = (page: number) => {
    fetchplacement(page);
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
    fetchplacement(1);
  };

  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }
    await fetchplacement(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  const FilterDialogShow = ref<boolean>(false);
  const ApplayFilter = () => {
    FilterDialogShow.value = false;
  };
  const CloseFiletrDialog = () => {
    FilterDialogShow.value = false;
  };

  const handelScoreColor = (percentage: number) => {
    if (percentage >= 75) {
      return 'var(--StandardBlue)';
    } else if (percentage >= 50) {
      return 'var(--warning)';
    } else {
      return 'var(--danger-alt)';
    }
  };
</script>

<template>
  <!-- <MultiSelectionTabs /> -->
  <div class="placement-page">
    <div class="index-header">
      <div class="search-field">
        <span class="search-icon">
          <IndexSearchIcon />
        </span>
        <input
          v-model="word"
          placeholder="Search by placement name or email…"
          class="search-input"
          type="text"
          @input="Search"
        />
      </div>
      <div class="btns-container">
        <FilterDialog v-model="FilterDialogShow">
          <template #content>
            <div class="filter-action">
              <button class="btn btn-cancel" @click="CloseFiletrDialog">Reset</button>
              <button class="btn btn-primary" @click="ApplayFilter">apply</button>
            </div>
          </template>
        </FilterDialog>
      </div>
    </div>

    <DataStatusBuilder :controller="state" :on-retry="async () => await fetchplacement()">
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as PlacementResultModel[]"
            :hoverable="true"
            :striped="true"
            :show-index="false"
          >
            <template #cell-subject="{ item }">
              <div class="subject-name">
                {{ item.subject }}
              </div>
            </template>

            <template #cell-plane="{ item }">
              {{ item.plane }}
            </template>

            <template #cell-studentName="{ item }">
              <div class="employee-name">
                <img
                  :src="item.studentImg || `https://cyber.comolho.com/static/img/avatar.png`"
                  alt="image"
                />
                <span>{{ item.studentName }}</span>
              </div>
            </template>

            <template #cell-numberOfQuestions="{ item }">
              {{ item.totalQuestions }}
            </template>

            <template #cell-studentResult="{ item }">
              <div class="result">
                <span
                  :style="{
                    color: handelScoreColor(
                      ((item.studentResult || 0) / (item.totalResult || 1)) * 100,
                    ),
                  }"
                >
                  {{ item.studentResult }}
                </span>
                /
                {{ item.totalResult }}
              </div>
            </template>

            <template #cell-status="{ item }">
              <span
                :class="`status ${item.status === 'completed' ? 'completed' : 'not_reviewed'}`"
                >{{ item.status }}</span
              >
            </template>

            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  class="action-btn show"
                  :to="`/${route.params.country_code}/placement/show/${item.id}`"
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
