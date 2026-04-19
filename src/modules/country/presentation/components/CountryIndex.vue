<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import DataStatusBuilder from "@/shared/DataStatues/DataStatusBuilder.vue";
import AppTable, {
  type TableHeader,
} from "@/shared/HelpersComponents/AppTable.vue";
import Pagination from "@/shared/HelpersComponents/Pagination.vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "@/base/Presentation/Utils/debouced";
import { useFormsStore } from "@/stores/formsStore";
import IndexCountryParams from "../../core/params/index.country.params";
import CountryController from "../controllers/country.controller";
import DeleteCountryParams from "../../core/params/deleteParams";
import type CountryModel from "../../core/models/country.model";

// Controller instance
const controller = CountryController.getInstance();
const state = computed(() => controller.listState.value);
const router = useRouter();
const route = useRoute();

// Table headers
const headers: TableHeader[] = [
  { key: "title", label: "Title", width: "30%", sortable: true },
  { key: "code", label: "Code", width: "30%" },
  { key: "flag", label: "Flag", width: "30%" },
];

// Pagination state
const perPage = ref(10);
const word = ref("");
const totalCount = computed(() => controller.listData.value?.length);

const fetchCountries = async (page: number = 1, word: string = "") => {
  const state = await controller.fetchList(
    new IndexCountryParams(
      word,
      route.query.page ? Number(route.query.page) : page,
      perPage.value,
    ),
  );
  console.log(state, "state");
};

const Search = debounce(() => {
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page ?? 1),
      word: word.value || undefined,
    },
  });

  fetchCountries(1, word.value);
});

const onPageChange = (page: number) => {
  fetchCountries(page);
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
  fetchCountries(1);
};

// Fetch emails on component mount
onMounted(async () => {
  if (route.query.word) {
    word.value = String(route.query.word);
  }

  await fetchCountries(
    route.query.page ? Number(route.query.page) : 1,
    word.value,
  );
});

const deleteCountry = async (id: number) => {
  await controller.delete(new DeleteCountryParams(id));
  await fetchCountries();
};

const FormStore = useFormsStore();
const formRoute = "/countries/add";

const isDraft = computed(() => {
  const data = FormStore?.formData[formRoute] ?? {};
  return (
    Object.keys(data).length === 0 ||
    Object.values(data).every((v) => v == null)
  );
});
</script>

<template>
  <div class="email-page">
    <!-- ═══ Page Header ═══ -->
    <header class="page-header">
      <div class="header-left">
        <div class="header-text">
          <h1>Country Management</h1>
          <p class="subtitle">
            Manage country
            <span v-if="totalCount" class="count-pill">{{ totalCount }}</span>
          </p>
        </div>
      </div>

      <router-link :to="formRoute" class="btn-add">
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
        <span>{{ isDraft ? "Add Country" : "Continue Adding" }}</span>
      </router-link>
    </header>

    <!-- ═══ Toolbar ═══ -->
    <div class="toolbar">
      <div class="search-field">
        <span class="search-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          v-model="word"
          placeholder="Search by country name…"
          class="search-input"
          type="text"
          @input="Search"
        />
        <Transition name="fade">
          <button
            v-if="word"
            class="clear-btn"
            @click="
              word = '';
              Search();
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </Transition>
      </div>
    </div>

    <!-- ═══ Table ═══ -->
    <DataStatusBuilder
      :controller="state"
      :on-retry="async () => await fetchCountries()"
    >
      <template #success="{ data }">
        <div class="table-frame">
          <AppTable
            :headers="headers"
            :items="data as CountryModel[]"
            selectable
            show-index
            hoverable
            striped
          >
            <template #cell-name="{ item }">
              {{ item.title }}
            </template>
            <template #cell-flag="{ item }">
              {{ item.flag }}
            </template>
            <template #actions="{ item }">
              <div class="row-actions">
                <router-link
                  class="action-btn edit"
                  :to="`/countries/edit/${item.id}`"
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
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </router-link>
                <button
                  class="action-btn delete"
                  title="Delete"
                  @click="deleteCountry(item.id!)"
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
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </template>
          </AppTable>
        </div>

        <Pagination
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
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <h3>No emails yet</h3>
          <p>Add the first employee email to get started</p>
          <router-link :to="formRoute" class="btn-add empty-cta">
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
            <span>Add Email</span>
          </router-link>
        </div>
      </template>
    </DataStatusBuilder>
  </div>
</template>
