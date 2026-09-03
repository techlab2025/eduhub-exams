<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import TableSkelaton from '@/shared/HelpersComponents/TableSkelaton.vue';
  import DeleteDialog from '@/shared/HelpersComponents/dialog/DeleteDialog.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import IndexPluseIcon from '@/shared/icons/IndexPluseIcon.vue';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import RoleController from '../controllers/role.controller';
  import IndexRoleParams from '../../core/params/index.role.params';
  import DeleteRoleParams from '../../core/params/delete.role.params';
  import type RoleModel from '../../core/models/role.model';
  import EditeIcon from '@/shared/icons/DocaumentType/EditeIcon.vue';
  import DeleteIcon from '@/shared/icons/DocaumentType/DeleteIcon.vue';

  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const controller = RoleController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref(String(route.query.word ?? ''));
  const perPage = ref(10);
  // const searchInput = ref<HTMLInputElement>();

  const headers = computed<TableHeader[]>(() => [
    { key: 'id', label: t('role.table.id'), sortable: true, width: '40%' },
    { key: 'title', label: t('role.table.title'), width: '60%' },
  ]);

  const fetchRoles = async (page = 1) => {
    await controller.fetchList(new IndexRoleParams(word.value, page, perPage.value, 1));
  };

  const search = debounce(() => {
    router.replace({ query: { ...route.query, page: 1, word: word.value || undefined } });
    fetchRoles();
  });

  // const applyFilter = () => {
  //   if (!word.value) {
  //     searchInput.value?.focus();
  //     return;
  //   }
  //   word.value = '';
  //   search();
  // };

  const changePage = (page: number) => {
    router.replace({ query: { ...route.query, page, word: word.value || undefined } });
    fetchRoles(page);
  };

  const changePerPage = (count: number) => {
    perPage.value = count;
    fetchRoles();
  };

  const deleteRole = async (role: RoleModel) => {
    await controller.delete(new DeleteRoleParams(role.id));
    await fetchRoles(Number(route.query.page ?? 1));
  };


  onMounted(() => fetchRoles(Number(route.query.page ?? 1)));
  const SelectedRow = ref<RoleModel[]>([]);
  const setSelectef = (items: RoleModel[]) => {
    SelectedRow.value = items;
  };
  const deleteItems = async () => {
    SelectedRow.value.forEach((item) => {
      deleteRole(item);
    });
    SelectedRow.value = [];
  };
</script>

<template>
  <main class="role-index-page">
    <header class="role-index-page__titlebar">
      <div>
        <h1>{{ $t('role.title_plural') }}</h1>
        <p>{{ $t('role.index_description') }}</p>
      </div>
      <router-link class="btn btn-primary role-index-page__add" :to="{ name: 'Add Role' }">
        <IndexPluseIcon />
        <span>{{ $t('role.add') }}</span>
      </router-link>
    </header>

    <section class="role-index-page__content" :aria-label="$t('role.title_plural')">
      <div class="role-index-page__toolbar">
        <label class="search-field" for="role-search">
          <span class="search-icon"><IndexSearchIcon /></span>
          <input
            id="role-search"
            ref="searchInput"
            v-model="word"
            class="search-input"
            type="search"
            :placeholder="$t('role.search_placeholder')"
            @input="search"
          />
        </label>
        <!-- <button class="role-index-page__filter" type="button" @click="applyFilter">
          {{ $t('role.filter') }}
        </button> -->
      </div>

      <DataStatusBuilder :controller="state" :on-retry="fetchRoles">
        <template #success="{ data }">
          <div class="role-index-page__table">
            <AppTable
              :headers="headers"
              :items="data as RoleModel[]"
              row-key="id"
              selectable
              hoverable
              @selection-change="setSelectef"
            >
              <template #actions="{ item }">
                <div class="role-row-actions">
                  <router-link :to="{ name: 'Edit Role', params: { id: item.id } }">
                    <!-- {{ $t('role.actions.edit') }} -->
                    <EditeIcon />
                  </router-link>
                  <DeleteDialog @delete="deleteRole(item)">
                    <template #Dialog>
                      <DeleteIcon />
                      <!-- <button type="button">{{ $t('role.actions.delete') }}</button> -->
                    </template>
                  </DeleteDialog>
                </div>
              </template>
            </AppTable>
          </div>

          <div v-if="SelectedRow.length > 0" class="items-deleted">
            <div class="num-type">
              <h6>{{ SelectedRow.length }} rols</h6>
            </div>
            <div class="num-deleted" @click="deleteItems">
              <h6>delete {{ SelectedRow.length }} item</h6>
            </div>
          </div>
          <Pagination
            v-if="controller.pagination.value"
            :pagination="controller.pagination.value"
            @change-page="changePage"
            @count-per-page="changePerPage"
          />
        </template>
        <template #empty>
          <div class="role-index-page__empty">
            <h2>{{ $t('role.empty_title') }}</h2>
            <p>{{ $t('role.empty_description') }}</p>
            <router-link class="btn btn-primary" :to="{ name: 'Add Role' }">
              {{ $t('role.add') }}
            </router-link>
          </div>
        </template>
        <template #loader>
          <TableSkelaton :rows="6" :columns="headers.length" :has-actions="true" selectable />
        </template>
      </DataStatusBuilder>
    </section>
  </main>
</template>

<style scoped lang="scss">
  .items-deleted {
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid var(--border-weak);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    .num-type {
      h6 {
        font-size: 14px;
        font-weight: 700;
        font-family: 'bold';
        color: var(--table-header-color);
      }
    }

    .num-deleted {
      background-color: var(--btn-red);
      color: var(--bg-main);
      padding: 6px 20px;
      border-radius: 12px;
      cursor: pointer;

      h6 {
        font-size: 14px;
        font-weight: 700;
        font-family: 'bold';
      }
    }
  }
  .role-index-page {
    display: grid;
    gap: var(--xl-size-base);
  }

  .role-index-page__titlebar,
  .role-index-page__toolbar,
  .role-row-actions {
    display: flex;
    align-items: center;
  }

  .role-index-page__titlebar {
    justify-content: space-between;
    gap: var(--sm-size);
    padding: var(--sm-size) var(--xl-size-base);
    border-radius: var(--radius-lg);
    background: var(--bg-section);

    h1 {
      margin: 0;
      color: var(--gray-900);
      font-size: var(--xl-size-base);
    }

    p {
      margin: var(--xs-size-4) 0 0;
      color: var(--gray-500);
      font-size: var(--xs-size);
    }
  }

  .role-index-page__add {
    gap: var(--xs-size-4);
    border-radius: var(--radius-full);
  }

  .role-index-page__content {
    display: grid;
    gap: var(--sm-size);
    padding: var(--sm-size);
    // border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
  }

  .role-index-page__toolbar {
    justify-content: space-between;
    gap: var(--sm-size);

    .search-field {
      max-width: 420px;
    }
  }

  .role-index-page__filter {
    min-height: 42px;
    padding: var(--xs-size) var(--xl-size-base);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);
    color: var(--gray-900);
  }

  .role-index-page__table {
    overflow: hidden;
    // border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .role-row-actions {
    justify-content: flex-end;
    gap: var(--xs-size);

    a,
    button {
      color: var(--PrimaryColor);
      font-size: var(--xs-size);
      font-weight: 600;
    }

    button {
      color: var(--danger-color);
    }
  }

  .role-index-page__empty {
    display: grid;
    justify-items: center;
    gap: var(--xs-size);
    padding: calc(var(--xl-size-base) * 2);
    text-align: center;

    h2,
    p {
      margin: 0;
    }

    p {
      color: var(--gray-500);
    }
  }

  @media (max-width: 700px) {
    .role-index-page__titlebar,
    .role-index-page__toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .role-index-page__add,
    .role-index-page__filter,
    .role-index-page__toolbar .search-field {
      justify-content: center;
      width: 100%;
      max-width: none;
    }
  }
</style>
