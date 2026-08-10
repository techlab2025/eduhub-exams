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
  import PlanController from '../controllers/plan.controller';
  import type PlanModel from '../../core/models/plan.model';
  import { LastUpdatedEnum, PlanStatusEnum } from '../../core/models/plan.model';
  import { DeletePlanParams, IndexPlanParams } from '../../core/params/plan.params';

  const { t } = useI18n();
  const router = useRouter();
  const controller = PlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const fromPrice = ref<number>();
  const toPrice = ref<number>();
  const fromDate = ref<Date | null>(null);
  const toDate = ref<Date | null>(null);
  const status = ref<TitleInterface<number> | null>(null);
  const lastUpdated = ref<TitleInterface<number> | null>(null);
  const filterDialogVisible = ref(false);
  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const statusOptions = computed(() => [
    { id: Number(PlanStatusEnum.ACTIVE), title: t('active') },
    { id: Number(PlanStatusEnum.INACTIVE), title: t('inactive') },
    { id: Number(PlanStatusEnum.ARCHIVED), title: t('archived') },
    { id: Number(PlanStatusEnum.DRAFT), title: t('draft') },
  ]);
  const updatedOptions = computed(() => [
    { id: Number(LastUpdatedEnum.TODAY), title: t('today') },
    { id: Number(LastUpdatedEnum.LAST_7_DAYS), title: t('last_7_days') },
    { id: Number(LastUpdatedEnum.LAST_30_DAYS), title: t('last_30_days') },
    { id: Number(LastUpdatedEnum.LAST_3_MONTHS), title: t('last_3_months') },
    { id: Number(LastUpdatedEnum.CUSTOM), title: t('custom') },
  ]);
  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('title') },
    { key: 'price', label: t('price') },
    { key: 'duration', label: t('duration') },
    { key: 'status', label: t('status') },
    { key: 'subscribers', label: t('subscribers') },
  ]);
  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexPlanParams(word.value, page, perPage.value, {
        fromPrice: fromPrice.value,
        toPrice: toPrice.value,
        status: status.value ? (String(status.value.id) as PlanStatusEnum) : undefined,
        fromDate: dateValue(fromDate.value),
        toDate: dateValue(toDate.value),
        lastUpdated: lastUpdated.value
          ? (String(lastUpdated.value.id) as LastUpdatedEnum)
          : undefined,
      }),
    );
  const remove = async (id: number) => {
    if (!window.confirm(t('confirm_delete'))) return;
    await controller.delete(new DeletePlanParams(id));
    await fetchItems();
  };
  const applyFilters = async () => {
    filterDialogVisible.value = false;
    await fetchItems();
  };
  const resetFilters = async () => {
    fromPrice.value = undefined;
    toPrice.value = undefined;
    fromDate.value = null;
    toDate.value = null;
    status.value = null;
    lastUpdated.value = null;
    await applyFilters();
  };
  onMounted(() => fetchItems());
</script>

<template>
  <section class="plan-page">
    <header class="index-header">
      <input
        v-model="word"
        class="search-input"
        :placeholder="$t('search')"
        @input="fetchItems()"
      />
      <div class="header-actions">
        <FilterDialog v-model="filterDialogVisible">
          <template #content>
            <div class="filters">
              <input v-model.number="fromPrice" type="number" :placeholder="$t('from_price')" />
              <input v-model.number="toPrice" type="number" :placeholder="$t('to_price')" />
              <UpdatedCustomInputSelect
                v-model="status"
                :label="$t('status')"
                :placeholder="$t('select_status')"
                :static-options="statusOptions"
              />
              <UpdatedCustomInputSelect
                v-model="lastUpdated"
                :label="$t('last_updated')"
                :placeholder="$t('select_period')"
                :static-options="updatedOptions"
              />
              <DatePicker
                v-model="fromDate"
                :placeholder="$t('from_date')"
                show-icon
                panel-class="light-datepicker-panel"
              />
              <DatePicker
                v-model="toDate"
                :placeholder="$t('to_date')"
                show-icon
                panel-class="light-datepicker-panel"
              />
              <div class="filter-actions">
                <button class="btn btn-cancel" @click="resetFilters">{{ $t('reset') }}</button
                ><button class="btn btn-primary" @click="applyFilters">{{ $t('apply') }}</button>
              </div>
            </div>
          </template>
        </FilterDialog>
        <button class="btn btn-primary" @click="router.push('/plans/add')">
          {{ $t('add_plan') }}
        </button>
      </div>
    </header>
    <DataStatusBuilder
      :controller="state"
      :on-retry="
        async () => {
          await fetchItems();
        }
      "
    >
      <template #success="{ data }">
        <AppTable :headers="headers" :items="data as PlanModel[]" show-index>
          <template #cell-duration="{ item }"
            >{{ item.duration }} / {{ item.durationType }}</template
          >
          <template #cell-status="{ item }">{{ $t(`plan_status_${item.status}`) }}</template>
          <template #actions="{ item }">
            <div class="row-actions">
              <button class="btn" @click="router.push(`/plans/${item.id}`)">
                {{ $t('view') }}
              </button>
              <button class="btn" @click="router.push(`/plans/edit/${item.id}`)">
                {{ $t('edit') }}
              </button>
              <button class="btn btn-cancel" @click="remove(item.id)">{{ $t('delete') }}</button>
            </div>
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
  </section>
</template>

<style scoped lang="scss">
  .index-header,
  .header-actions,
  .row-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--xs-size);
  }

  .filter-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: flex-end;
    grid-column: 1 / -1;
  }

  .filters input {
    min-height: 44px;
    padding: var(--xs-size);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
    background: var(--BgWhite);
  }

  :global(.light-datepicker-panel) {
    color-scheme: light;
    background: var(--BgWhite);
  }
</style>
