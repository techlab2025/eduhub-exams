<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import DatePicker from 'primevue/datepicker';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import PlanController from '../controllers/plan.controller';
  import type PlanModel from '../../core/models/plan.model';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import { LastUpdatedEnum } from '../../core/enums/plan.last.updated.enum';
  import IndexPlanParams from '../../core/params/index.plan.params';
  import DeletePlanParams from '../../core/params/delete.plan.params';
  import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import ShowIcon from '@/shared/icons/ShowIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import { PlanDurationTypeEnum } from '../../core/enums/plan.duration.enum';
  import TogglePlanStatusParams from '../../core/params/toggle.plan.status.params';
  import DeactivatePlanDialog from '../subCopmnents/DeactivatePlanDialog.vue';
  import ArchivePlanDialog from '../subCopmnents/ArchivePlanDialog.vue';
  import DeactiveIcon from '@/shared/icons/Plan/DeactiveIcon.vue';
  import ArchiveIcon from '@/shared/icons/Plan/ArchiveIcon.vue';
import PlanEditIcon from '@/shared/icons/Plan/PlanEditIcon.vue';

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
  const deactivateDialogVisible = ref(false);
  const archiveDialogVisible = ref(false);
  const selectedPlanId = ref<number | null>(null);
  const statusLoading = ref(false);
  const listMode = ref<'active' | 'archived'>('active');
  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const statusOptions = computed(() => [
    { id: Number(PlanStatusEnum.ACTIVE), title: t('active') },
    { id: Number(PlanStatusEnum.deactivated), title: t('inactive') },
    { id: Number(PlanStatusEnum.Archived), title: t('archived') },
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
    { key: 'id', label: t('ID') },
    { key: 'title', label: t('plan name') },
    { key: 'duration', label: t('duration') },
    { key: 'price', label: t('price') },
    { key: 'status', label: t('status') },
    { key: 'trialDays', label: t('trial_days') },
    { key: 'lastUpdated', label: t('lastUpdated') },
  ]);
  const durationType = ref<TitleInterface<string>>();
  const fetchItems = (page = 1, word = '') =>
    controller.fetchList(
      new IndexPlanParams(word, page, perPage.value, {
        fromPrice: fromPrice.value,
        toPrice: toPrice.value,
        status:
          listMode.value === 'archived'
            ? PlanStatusEnum.Archived
            : status.value
              ? (status.value.id as PlanStatusEnum)
              : undefined,
        duration: String(durationType.value?.id),
        fromDate: dateValue(fromDate.value),
        toDate: dateValue(toDate.value),
        lastUpdated: lastUpdated.value
          ? (String(lastUpdated.value.id) as LastUpdatedEnum)
          : undefined,
      }),
    );
  const remove = async (id: number) => {
    await controller.delete(new DeletePlanParams(id));
    await fetchItems();
  };
  const changeStatus = async (id: number, nextStatus: PlanStatusEnum) => {
    statusLoading.value = true;
    try {
      const result = await controller.toggleStatus(
        new TogglePlanStatusParams({ planId: id, status: nextStatus }),
      );
      if (result.hasError) return;

      await fetchItems();
      deactivateDialogVisible.value = false;
      archiveDialogVisible.value = false;
      selectedPlanId.value = null;
    } finally {
      statusLoading.value = false;
    }
  };
  const openDeactivateDialog = (id: number) => {
    selectedPlanId.value = id;
    deactivateDialogVisible.value = true;
  };
  const openArchiveDialog = (id: number) => {
    selectedPlanId.value = id;
    archiveDialogVisible.value = true;
  };
  const confirmStatusChange = async (status: PlanStatusEnum) => {
    if (selectedPlanId.value === null) return;
    await changeStatus(selectedPlanId.value, status);
  };
  const actionList = (item: PlanModel) => [
    {
      text: t('view'),
      icon: ShowIcon,
      link: `/plans/${item.id}`,
    },
    {
      text: t('edit_price'),
      icon: PlanEditIcon,
      link: `/plans/edit/${item.id}?section=pricing`,
    },
    {
      text: t('edit_basic_info'),
      icon: PlanEditIcon,
      link: `/plans/edit/${item.id}?section=basic`,
    },
    {
      text: t('edit_features'),
      icon: PlanEditIcon,
      link: `/plans/edit/${item.id}?section=features`,
    },
    {
      text: t('deactivate'),
      icon: DeactiveIcon,
      action: () => openDeactivateDialog(item.id),
    },
    {
      text: t('archive'),
      icon: ArchiveIcon,
      action: () => openArchiveDialog(item.id),
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => remove(item.id),
    },
  ];
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
  const setListMode = async (mode: 'active' | 'archived') => {
    if (listMode.value === mode) return;
    listMode.value = mode;
    await fetchItems(1, word.value);
  };
  onMounted(() => fetchItems());
  const route = useRoute();
  const Search = debounce(() => {
    router.push({
      query: {
        ...route.query,
        page: 1,
        word: word.value || undefined,
      },
    });
    fetchItems(1, word.value);
  });

  const GetDuarationType = (durationType: PlanDurationTypeEnum) => {
    switch (durationType) {
      case PlanDurationTypeEnum.DAY:
        return t('days');
      case PlanDurationTypeEnum.MONTH:
        return t('months');
      case PlanDurationTypeEnum.WEEK:
        return t('weeks');
      case PlanDurationTypeEnum.YEAR:
        return t('years');
      default:
        return '';
    }
  };
  const GetStatusText = (status: PlanStatusEnum) => {
    switch (status) {
      case PlanStatusEnum.ACTIVE:
        return t('active');
      case PlanStatusEnum.deactivated:
        return t('deactivated');
      case PlanStatusEnum.Archived:
        return t('archived');
      case PlanStatusEnum.DRAFT:
        return t('draft');
      default:
        return '';
    }
  };

  const DurationTypeOptions = computed(() => [
    { id: PlanDurationTypeEnum.DAY, title: t('days') },
    { id: PlanDurationTypeEnum.WEEK, title: t('weeks') },
    { id: PlanDurationTypeEnum.MONTH, title: t('months') },
    { id: PlanDurationTypeEnum.YEAR, title: t('years') },
  ]);
</script>

<template>
  <section class="plan-page">
    <button class="btn btn-primary" @click="router.push('/plans/add')">
      <span class="plus">+</span> {{ $t('Add New Plan') }}
    </button>
    <header class="index-header">
      <div class="search-field">
        <span class="search-icon">
          <IndexSearchIcon />
        </span>
        <input
          v-model="word"
          placeholder="search by  Name,id,duration...... "
          class="search-input"
          type="text"
          @input="Search"
        />
      </div>
      <div class="header-actions">
        <div class="plan-list-toggle" role="group" :aria-label="$t('status')">
          <button
            type="button"
            :class="{ active: listMode === 'active' }"
            :aria-pressed="listMode === 'active'"
            @click="setListMode('active')"
          >
            {{ $t('active') }}
          </button>
          <button
            type="button"
            :class="{ active: listMode === 'archived' }"
            :aria-pressed="listMode === 'archived'"
            @click="setListMode('archived')"
          >
            {{ $t('plan_archive_filter') }}
          </button>
        </div>
        <FilterDialog v-model="filterDialogVisible">
          <template #content>
            <div class="filters">
              <div class="price-container">
                <h2>price range</h2>
                <div>
                  <input v-model.number="fromPrice" type="number" :placeholder="$t('from_price')" />
                  <input v-model.number="toPrice" type="number" :placeholder="$t('to_price')" />
                </div>
              </div>
              <UpdatedCustomInputSelect
                v-model="durationType"
                :label="$t('duration_type')"
                :placeholder="$t('select_duration_type')"
                :static-options="DurationTypeOptions"
              />
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
            >{{ item.duration }} {{ GetDuarationType(item.durationType) }}</template
          >
          <template #cell-status="{ item }">
            <p :class="`status-${GetStatusText(item.status)}`">
              {{ $t(GetStatusText(item.status)) }}
            </p>
          </template>
          <template #cell-price="{ item }">{{ item.price }} LE</template>
          <template #cell-trialDays="{ item }">{{ item.trialDays }} Days</template>
          <template #cell-lastUpdated="{ item }">
            <div class="last-updated-cell">
              <strong v-if="item.lastUpdated.lastupdatedBy.name">
                {{ item.lastUpdated.lastupdatedBy.name }}
              </strong>
              <small v-if="item.lastUpdated.date">{{ item.lastUpdated.date }}</small>
              <span v-if="!item.lastUpdated.lastupdatedBy.name && !item.lastUpdated.date">--</span>
            </div>
          </template>
          <template #actions="{ item }">
            <DropList
              :action-list="actionList(item)"
              :delete-dialog-title="$t('confirm_delete')"
              :delete-dialog-message="$t('confirm_delete')"
            />
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
    <DeactivatePlanDialog
      v-model="deactivateDialogVisible"
      :loading="statusLoading"
      @confirm="confirmStatusChange(PlanStatusEnum.deactivated)"
    />
    <ArchivePlanDialog
      v-model="archiveDialogVisible"
      :loading="statusLoading"
      @confirm="confirmStatusChange(PlanStatusEnum.Archived)"
    />
  </section>
</template>

<style scoped lang="scss">
  .action-confirmation {
    h3 {
      font-family: 'Demi';
      display: flex;
      flex-direction: column;
    }
  }
  :deep(.input-label) {
    color: var(--SecondText);
    font-size: 18px !important;
    font-weight: 600 !important;
    font-family: var(--font-family);
  }

  .price-container {
    display: flex;
    flex-direction: column;
    max-width: 100%;

    h2 {
      color: var(--SecondText);
      font-size: 18px;
      font-weight: 600;
      padding-block: 8px;
      font-family: var(--font-family);
    }

    div {
      display: flex;
      gap: 10px;

      input {
        width: 50%;
      }
    }
  }

  .plus {
    margin-inline: 3px;
    font-size: 12px;
  }

  .btn-primary {
    margin-left: auto !important;
    margin-block: 15px;
  }

  .th-content {
    color: var(--standard-black);
    font-size: 14px;
    font-weight: 600;
  }

  .status-Active {
    color: var(--primary-green) !important;
  }

  .status-deactivated {
    color: var(--warning-dark);
  }

  .status-Draft {
    color: var(--blue-primary);
  }

  .status-Archived {
    color: var(--gray-500-std);
  }

  .index-header,
  .header-actions,
  .row-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
  }

  .header-actions {
    align-items: center;
    flex-wrap: wrap;
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

  .plan-list-toggle {
    min-height: 42px;
    padding: 4px;
    border-radius: 24px;
    background: var(--gray-100);
    display: inline-grid;
    grid-template-columns: repeat(2, minmax(76px, 1fr));

    button {
      min-height: 34px;
      padding-inline: 14px;
      border: 0;
      border-radius: 20px;
      background: transparent;
      color: var(--SecondText);
      cursor: pointer;
      font-weight: 500;

      &.active {
        background: var(--BgWhite);
        color: var(--primary-green);
        box-shadow: var(--shadow-sm);
      }
    }
  }

  .last-updated-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      color: var(--SecondText);
      font-size: 13px;
      font-weight: 400;
    }

    small {
      color: var(--SecondText);
    }
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
