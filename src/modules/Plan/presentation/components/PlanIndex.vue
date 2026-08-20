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
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import { PlanDurationTypeEnum } from '../../core/enums/plan.duration.enum';
  import TogglePlanStatusParams from '../../core/params/toggle.plan.status.params';
  import DeactivatePlanDialog from '../subCopmnents/DeactivatePlanDialog.vue';
  import ArchivePlanDialog from '../subCopmnents/ArchivePlanDialog.vue';
  import ActivatePlanDialog from '../subCopmnents/ActivatePlanDialog.vue';
  import PlanDeleteWarningDialog from '../subCopmnents/PlanDeleteWarningDialog.vue';
  import DeactiveIcon from '@/shared/icons/Plan/DeactiveIcon.vue';
  import ArchiveIcon from '@/shared/icons/Plan/ArchiveIcon.vue';
  import PlanEditIcon from '@/shared/icons/Plan/PlanEditIcon.vue';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';
  import PlanViewIcon from '@/shared/icons/Plan/PlanViewIcon.vue';
  import PlanPriceIcon from '@/shared/icons/Plan/PlanPriceIcon.vue';
  import IconCheck from '@/shared/icons/IconCheck.vue';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = PlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const currentPage = ref(1);
  const fromPrice = ref<number>();
  const toPrice = ref<number>();
  const fromDate = ref<Date | null>(null);
  const toDate = ref<Date | null>(null);
  const status = ref<TitleInterface<number> | null>(null);
  const lastUpdated = ref<TitleInterface<number> | null>(null);
  const hasTrial = ref<boolean | null>(null);
  const filterDialogVisible = ref(false);
  const deactivateDialogVisible = ref(false);
  const archiveDialogVisible = ref(false);
  const activateDialogVisible = ref(false);
  const deleteWarningDialogVisible = ref(false);
  const warningActionType = ref<'delete' | 'deactivate' | 'archive'>('delete');
  const selectedPlanId = ref<number | null>(null);
  const statusLoading = ref(false);
  const listMode = ref<PlanStatusEnum | null>(PlanStatusEnum.ACTIVE);
  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const statusOptions = computed(() => [
    { id: Number(PlanStatusEnum.ACTIVE), title: t('active') },
    { id: Number(PlanStatusEnum.deactivated), title: t('deactive') },
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
    { key: 'numberOfSubjects', label: t('number_of_subjects') },
    { key: 'lastUpdated', label: t('lastUpdated') },
  ]);
  const durationType = ref<TitleInterface<string>>();
  const queryValue = (key: string) => {
    const value = route.query[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const queryNumber = (key: string) => {
    const value = Number(queryValue(key));
    return Number.isFinite(value) ? value : undefined;
  };
  const queryDate = (key: string) => {
    const value = queryValue(key);
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const buildPlanQuery = () => ({
    ...(currentPage.value === 1 ? {} : { page: currentPage.value }),
    ...(perPage.value === 10 ? {} : { perPage: perPage.value }),
    ...(word.value ? { word: word.value } : {}),
    ...(fromPrice.value === undefined ? {} : { fromPrice: fromPrice.value }),
    ...(toPrice.value === undefined ? {} : { toPrice: toPrice.value }),
    ...(hasTrial.value === null ? {} : { hasTrial: String(hasTrial.value) }),
    ...(status.value ? { status: status.value.id } : {}),
    ...(listMode.value === null || listMode.value === PlanStatusEnum.ACTIVE
      ? {}
      : { listMode: listMode.value }),
    ...(durationType.value ? { duration: durationType.value.id } : {}),
    ...(fromDate.value ? { fromDate: dateValue(fromDate.value) } : {}),
    ...(toDate.value ? { toDate: dateValue(toDate.value) } : {}),
    ...(lastUpdated.value ? { lastUpdated: lastUpdated.value.id } : {}),
  });
  const replacePlanQuery = () => router.replace({ name: 'Plans', query: buildPlanQuery() });
  const planRouteLink = (path: string, extraQuery: Record<string, string> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries({ ...buildPlanQuery(), ...extraQuery }).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    const query = searchParams.toString();
    return query ? `${path}?${query}` : path;
  };
  const restoreFiltersFromQuery = () => {
    word.value = queryValue('word') ?? '';
    currentPage.value = Math.max(1, queryNumber('page') ?? 1);
    perPage.value = Math.max(1, queryNumber('perPage') ?? 10);
    fromPrice.value = queryNumber('fromPrice');
    toPrice.value = queryNumber('toPrice');
    hasTrial.value =
      queryValue('hasTrial') === 'true' ? true : queryValue('hasTrial') === 'false' ? false : null;
    const statusId = queryNumber('status');
    status.value = statusOptions.value.find((option) => option.id === statusId) ?? null;
    const mode = queryNumber('listMode');
    listMode.value = Object.values(PlanStatusEnum).includes(mode as PlanStatusEnum)
      ? (mode as PlanStatusEnum)
      : PlanStatusEnum.ACTIVE;
    const duration = queryNumber('duration');
    durationType.value = DurationTypeOptions.value.find((option) => option.id === duration);
    fromDate.value = queryDate('fromDate');
    toDate.value = queryDate('toDate');
    const updated = queryValue('lastUpdated');
    lastUpdated.value =
      updatedOptions.value.find((option) => String(option.id) === updated) ?? null;
  };
  const fetchItems = (page = currentPage.value, searchWord = word.value) => {
    currentPage.value = page;
    word.value = searchWord;
    return controller.fetchList(
      new IndexPlanParams(searchWord, page, perPage.value, {
        fromPrice: fromPrice.value,
        toPrice: toPrice.value,
        hasTrial: hasTrial.value ?? undefined,
        status: listMode.value ?? (status.value?.id as PlanStatusEnum | undefined),
        duration: durationType.value?.id || undefined,
        fromDate: dateValue(fromDate.value),
        toDate: dateValue(toDate.value),
        lastUpdated: lastUpdated.value
          ? (String(lastUpdated.value.id) as LastUpdatedEnum)
          : undefined,
      }),
    );
  };
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
      return !result.hasError;
    } finally {
      statusLoading.value = false;
    }
  };
  const openDeactivateDialog = (item: PlanModel) => {
    if (item.subscribers > 0) {
      warningActionType.value = 'deactivate';
      deleteWarningDialogVisible.value = true;
      return;
    }
    selectedPlanId.value = item.id;
    deactivateDialogVisible.value = true;
  };
  const openArchiveDialog = (item: PlanModel) => {
    if (item.subscribers > 0) {
      warningActionType.value = 'archive';
      deleteWarningDialogVisible.value = true;
      return;
    }
    selectedPlanId.value = item.id;
    archiveDialogVisible.value = true;
  };
  const openActivateDialog = (id: number) => {
    selectedPlanId.value = id;
    activateDialogVisible.value = true;
  };
  const closeStatusDialogs = () => {
    activateDialogVisible.value = false;
    deactivateDialogVisible.value = false;
    archiveDialogVisible.value = false;
  };
  const confirmStatusChange = async (status: PlanStatusEnum) => {
    if (selectedPlanId.value === null) return;
    // const changed =
    await changeStatus(selectedPlanId.value, status);
    // if (!changed) return;

    closeStatusDialogs();
    selectedPlanId.value = null;
    await fetchItems(currentPage.value, word.value);
  };
  const SelectedSubscribersNumber = ref();
  const actionList = (item: PlanModel) => {
    const viewAction = {
      text: t('view'),
      icon: PlanViewIcon,
      link: planRouteLink(`/plans/${item.id}`),
    };
    const editActions = [
      {
        text: t('edit_price'),
        icon: PlanPriceIcon,
        link: planRouteLink(`/plans/edit/${item.id}`, { section: 'pricing' }),
      },
      {
        text: t('edit_basic_info'),
        icon: PlanEditIcon,
        link: planRouteLink(`/plans/edit/${item.id}`, { section: 'basic' }),
      },
      {
        text: t('edit_features'),
        icon: PlanEditIcon,
        link: planRouteLink(`/plans/edit/${item.id}`, { section: 'features' }),
      },
    ];
    const deleteBlocked = item.subscribers > 0;
    const deleteAction = {
      text: t('delete'),
      icon: DeletIcon,
      action: deleteBlocked
        ? () => {
            warningActionType.value = 'delete';
            deleteWarningDialogVisible.value = true;
            SelectedSubscribersNumber.value = item.subscribers;
          }
        : () => remove(item.id),
      skipDeleteConfirmation: deleteBlocked,
    };

    if (item.status === PlanStatusEnum.DRAFT) {
      return [
        viewAction,
        {
          text: t('complete'),
          icon: PlanEditIcon,
          link: planRouteLink(`/plans/edit/${item.id}`),
        },
        deleteAction,
      ];
    }

    if (item.status === PlanStatusEnum.Archived) {
      return [
        viewAction,
        ...editActions,
        {
          text: t('activate'),
          icon: IconCheck,
          action: () => openActivateDialog(item.id),
        },
        deleteAction,
      ];
    }
    if (item.status === PlanStatusEnum.deactivated) {
      return [
        viewAction,
        ...editActions,
        {
          text: t('activate'),
          icon: DeactiveIcon,
          action: () => openActivateDialog(item.id),
        },
        {
          text: t('archive'),
          icon: ArchiveIcon,
          action: () => openArchiveDialog(item),
        },
        deleteAction,
      ];
    }

    return [
      viewAction,
      ...editActions,
      {
        text: t('deactivate'),
        icon: DeactiveIcon,
        action: () => openDeactivateDialog(item),
      },
      {
        text: t('archive'),
        icon: ArchiveIcon,
        action: () => openArchiveDialog(item),
      },
      deleteAction,
    ];
  };
  const applyFilters = async () => {
    if (status.value) listMode.value = null;
    filterDialogVisible.value = false;
    currentPage.value = 1;
    await replacePlanQuery();
    await fetchItems(1);
  };
  const resetFilters = async () => {
    fromPrice.value = undefined;
    toPrice.value = undefined;
    hasTrial.value = null;
    durationType.value = undefined;
    fromDate.value = null;
    toDate.value = null;
    status.value = null;
    lastUpdated.value = null;
    listMode.value = PlanStatusEnum.ACTIVE;
    await applyFilters();
  };
  const setListMode = async (mode: PlanStatusEnum) => {
    if (listMode.value === mode) return;
    listMode.value = mode;
    status.value = null;
    currentPage.value = 1;
    await replacePlanQuery();
    await fetchItems(1, word.value);
  };

  onMounted(() => {
    restoreFiltersFromQuery();
    fetchItems(currentPage.value, word.value);
  });
  const Search = debounce(async () => {
    currentPage.value = 1;
    await replacePlanQuery();
    fetchItems(1, word.value);
  });
  const changePage = async (page: number) => {
    currentPage.value = page;
    await replacePlanQuery();
    await fetchItems(page);
  };
  const changePerPage = async (count: number) => {
    perPage.value = count;
    currentPage.value = 1;
    await replacePlanQuery();
    await fetchItems(1);
  };

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
    <button
      class="btn btn-primary"
      @click="router.push({ name: 'Add Plan', query: buildPlanQuery() })"
      v-if="listMode !== PlanStatusEnum.Archived"
    >
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
            :class="{ active: listMode === PlanStatusEnum.ACTIVE }"
            :aria-pressed="listMode === PlanStatusEnum.ACTIVE"
            @click="setListMode(PlanStatusEnum.ACTIVE)"
          >
            {{ $t('active') }}
          </button>
          <button
            type="button"
            :class="{ active: listMode === PlanStatusEnum.Archived }"
            :aria-pressed="listMode === PlanStatusEnum.Archived"
            @click="setListMode(PlanStatusEnum.Archived)"
          >
            {{ $t('plan_archive_filter') }}
          </button>
        </div>
        <FilterDialog v-model="filterDialogVisible" dialog-class="plan-filter-dialog" width="40rem">
          <template #content>
            <div class="filters plan-filters">
              <section class="plan-filter-section plan-price-filter">
                <h2>{{ $t('price_range') }}</h2>
                <div class="plan-price-fields">
                  <label>
                    <span>{{ $t('from') }}</span>
                    <input v-model.number="fromPrice" type="number" placeholder="......." />
                  </label>
                  <label>
                    <span>{{ $t('to') }}</span>
                    <input v-model.number="toPrice" type="number" placeholder="......." />
                  </label>
                </div>
              </section>

              <section class="plan-filter-section plan-filter-select">
                <UpdatedCustomInputSelect
                  v-model="durationType"
                  :label="$t('duration')"
                  :placeholder="$t('select_duration')"
                  :static-options="DurationTypeOptions"
                  :reload="false"
                />
              </section>

              <section class="plan-filter-section">
                <div class="plan-filter-heading">
                  <h2>{{ $t('trial_days') }}</h2>
                  <button
                    type="button"
                    class="plan-filter-reset"
                    :aria-label="$t('reset_trial_filter')"
                    @click="hasTrial = null"
                  >
                    <ReloadIcon />
                  </button>
                </div>
                <div class="plan-choice-row plan-trial-choices">
                  <label class="plan-choice">
                    <input v-model="hasTrial" type="radio" :value="true" />
                    <span class="plan-choice-box"></span>
                    <span>{{ $t('has_trial') }}</span>
                  </label>
                  <label class="plan-choice">
                    <input v-model="hasTrial" type="radio" :value="false" />
                    <span class="plan-choice-box"></span>
                    <span>{{ $t('no_trial') }}</span>
                  </label>
                </div>
              </section>

              <section class="plan-filter-section">
                <div class="plan-filter-heading">
                  <h2>{{ $t('status') }}</h2>
                  <button
                    type="button"
                    class="plan-filter-reset"
                    :aria-label="$t('reset_status_filter')"
                    @click="status = null"
                  >
                    <ReloadIcon />
                  </button>
                </div>
                <div class="plan-choice-row plan-status-choices">
                  <label
                    v-for="option in statusOptions"
                    :key="option.id"
                    class="plan-choice"
                    :class="`plan-status-choice-${option.id} ${option.title}`"
                  >
                    <input v-model="status" type="radio" :value="option" />
                    <span class="plan-choice-box"></span>
                    <span>{{ option.title }}</span>
                  </label>
                </div>
              </section>

              <section class="plan-filter-section plan-last-update-filter">
                <h2>{{ $t('last_updated') }}</h2>
                <div class="plan-radio-list">
                  <label v-for="option in updatedOptions" :key="option.id" class="plan-radio">
                    <input v-model="lastUpdated" type="radio" :value="option" />
                    <span class="plan-radio-circle"></span>
                    <span>{{ option.title }}</span>
                  </label>
                </div>
                <div
                  v-if="String(lastUpdated?.id) === LastUpdatedEnum.CUSTOM"
                  class="plan-custom-dates"
                >
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
                </div>
              </section>
            </div>
          </template>
          <template #footer>
            <div class="filter-actions">
              <button class="btn btn-primary" @click="applyFilters">{{ $t('apply') }}</button>
              <button class="btn btn-cancel" @click="resetFilters">{{ $t('reset') }}</button>
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
        <AppTable :sticky-column="2" :headers="headers" :items="data as PlanModel[]" show-index>
          <template #cell-duration="{ item }"
            >{{ item.duration }} {{ GetDuarationType(item.durationType) }}</template
          >
          <template #cell-title="{ item }">
            {{
              item.title?.length > 30
                ? `${item.title?.slice(0, 30)}...`
                : item.title
                  ? item.title
                  : `--`
            }}
          </template>
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
              :delete-dialog-title="$t('delete_plan_title')"
              :delete-dialog-message="$t('delete_plan_message')"
            />
          </template>
        </AppTable>
        <Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="changePage"
          @count-per-page="changePerPage"
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
    <ActivatePlanDialog
      v-model="activateDialogVisible"
      :loading="statusLoading"
      @confirm="confirmStatusChange(PlanStatusEnum.ACTIVE)"
    />
    <PlanDeleteWarningDialog
      v-model="deleteWarningDialogVisible"
      :action-type="warningActionType"
      :SelectedSubscribersNumber="SelectedSubscribersNumber"
    />
  </section>
</template>

<style scoped lang="scss">
  :deep(.list-body .list-item a) {
    flex-direction: row-reverse !important;
  }

  .action-confirmation {
    h3 {
      font-family: var(--font-family);
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

  .filter-content {
    width: 100% !important;
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
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(120px, 1fr);
    gap: 12px;
    width: 100%;

    button {
      width: 100%;
    }
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

  :global(.plan-filter-dialog.p-dialog) {
    display: flex;
    flex-direction: column;
    height: min(52rem, calc(100dvh - 24px));
    max-width: calc(100vw - 24px);
    max-height: calc(100dvh - 24px);
    overflow: hidden;
    border: 1px solid var(--border-weak);
    border-radius: 28px;
    background: var(--standard-white) !important;
    box-shadow: var(--shadow-xl);
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-header) {
    flex: 0 0 auto;
    padding: 22px 24px 18px;
    background: linear-gradient(135deg, var(--standard-white), var(--PrimaryColor-alpha-4));
    border-bottom: 1px solid var(--border-weak);
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-header-actions) {
    display: flex;
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-close-button) {
    width: 36px;
    height: 36px;
    color: var(--gray-500);
    border-radius: var(--radius-full);
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-close-button:hover) {
    color: var(--PrimaryColor);
    background: var(--PrimaryColor-alpha-8);
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-content) {
    min-height: 0;
    flex: 1 1 auto;
    padding: 0 20px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--gray-50-std);
    scrollbar-color: var(--gray-300) transparent;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100%;
  }

  .filter-content {
    width: 100%;
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-content::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-content::-webkit-scrollbar-thumb) {
    background: var(--gray-300);
    border-radius: var(--radius-full);
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-content::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.plan-filter-dialog.p-dialog .p-dialog-footer) {
    flex: 0 0 auto;
    padding: 16px 24px 20px;
    background: var(--standard-white);
    border-top: 1px solid var(--border-weak);
    box-shadow: var(--shadow-sm);
  }

  :global(.plan-filter-dialog.p-dialog .filter-title) {
    margin: 0;
    color: var(--gray-900);
    font-family: var(--font-family);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
  }

  .filters.plan-filters {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding-block: 18px;
    font-family: var(--font-family);
  }

  .plan-filter-section {
    min-width: 0;
    padding: 18px;
    background: var(--standard-white);
    border: 1px solid var(--border-weak);
    border-radius: 18px;
    box-shadow: var(--shadow-sm);

    h2 {
      margin: 0;
      color: var(--gray-800);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .plan-filter-select {
    :deep(.input-label) {
      color: var(--gray-800) !important;
      font-size: 14px !important;
      font-weight: 700 !important;
    }

    :deep(.input-select) {
      height: 52px;
      margin-top: 7px;
      border: 1px solid var(--border-weak);
      border-radius: 14px;
      background: var(--gray-50-std);
      box-shadow: none;

      &:hover {
        border-color: var(--PrimaryColor-alpha-40);
      }
    }

    :deep(.p-select-label) {
      display: flex;
      align-items: center;
      padding-inline: 14px;
      color: var(--gray-400);
      font-size: 14px;
    }

    :deep(.reload-icon) {
      margin-inline: 0;
    }
  }

  .plan-filter-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .plan-filter-reset {
    width: 32px;
    height: 32px;
    padding: 0;
    display: grid;
    color: var(--gray-text);
    background: var(--gray-50-std);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);
    cursor: pointer;
    place-items: center;

    &:hover {
      color: var(--PrimaryColor);
      background: var(--PrimaryColor-alpha-8);
      border-color: var(--PrimaryColor-alpha-30);
    }

    :deep(svg) {
      width: 18px;
      height: 18px;
    }
  }

  .plan-price-filter {
    display: grid;
    gap: 14px;
  }

  .plan-price-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;

    label {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 7px;
      color: var(--gray-600);
      font-size: 14px;
      font-weight: 600;
    }

    input {
      width: 100%;
      height: 50px;
      padding-inline: 14px;
      background: var(--gray-50-std);
      border: 1px solid var(--border-weak);
      border-radius: 14px;
      outline: none;

      &:focus {
        background: var(--standard-white);
        border-color: var(--PrimaryColor);
        box-shadow: 0 0 0 3px var(--PrimaryColor-alpha-12);
      }
    }
  }

  .plan-choice-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    gap: 10px;
  }

  .plan-trial-choices {
    max-width: none;
  }

  .plan-choice,
  .plan-radio {
    min-width: 0;
    min-height: 46px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--gray-700);
    background: var(--gray-50-std);
    border: 1px solid var(--border-weak);
    border-radius: 13px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover,
    &:has(input:checked) {
      background: var(--standard-white);
      border-color: currentColor;
      box-shadow: var(--shadow-sm);
    }

    &:has(input:focus-visible) {
      outline: 3px solid var(--PrimaryColor-alpha-20);
      outline-offset: 2px;
    }

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
    }
  }

  .plan-choice-box {
    position: relative;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-full);
    background: var(--standard-white);
  }

  .plan-choice input:checked + .plan-choice-box {
    border-color: currentColor;
    background: var(--standard-white);

    &::after {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: var(--radius-full);
      content: '';
    }
  }

  .plan-status-choice-1 {
    color: var(--primary-green);
  }

  .plan-status-choice-2 {
    color: var(--btn-gold);
  }

  .plan-status-choice-3 {
    color: var(--title-header-color);
  }

  .plan-status-choice-4 {
    color: var(--info);
  }

  .plan-last-update-filter {
    margin-bottom: 0;
  }

  .plan-radio-list {
    display: grid;
    gap: 8px;
    margin-top: 14px;
  }

  .plan-radio-circle {
    position: relative;
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-full);
    background: var(--standard-white);
  }

  .plan-radio input:checked + .plan-radio-circle {
    border-color: var(--primary-green);

    &::after {
      position: absolute;
      inset: 3px;
      border-radius: var(--radius-full);
      background: var(--PrimaryColor);
      content: '';
    }
  }

  .plan-custom-dates {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 12px;

    :deep(.p-datepicker) {
      position: relative;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: stretch;
      overflow: hidden;
      background: var(--gray-50-std);
      border: 1px solid var(--border-weak);
      border-radius: 14px;

      &:focus-within {
        background: var(--standard-white);
        border-color: var(--PrimaryColor);
        box-shadow: 0 0 0 3px var(--PrimaryColor-alpha-12);
      }
    }

    :deep(.p-inputtext) {
      min-width: 0;
      height: 100%;
      flex: 1 1 auto;
      padding-inline: 14px 8px;
      color: var(--gray-text) !important;
      background: transparent;
      border: 0 !important;
      border-radius: 14px !important;
      box-shadow: none !important;
      font-size: 14px !important;
    }

    :deep(.p-datepicker-dropdown) {
      position: static;
      width: 46px;
      height: 100%;
      flex: 0 0 46px;
      color: var(--PrimaryColor);
      background: var(--PrimaryColor-alpha-8);
      border: 0;
      border-inline-start: 1px solid var(--border-weak);
      border-radius: 0 !important;
    }
  }

  .filter-actions {
    gap: 12px;

    .btn {
      width: 100%;
      height: 50px;
      margin: 0 !important;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 700;
    }

    .btn-primary {
      color: var(--standard-white);
      background: var(--PrimaryColor);
      border: 1px solid var(--PrimaryColor);
      box-shadow: var(--shadow-sm);

      &:hover {
        background: var(--PrimaryColor-hover);
      }
    }

    .btn-cancel {
      color: var(--danger-alt);
      background: var(--danger-light);
      border: 1px solid var(--danger-border-light);
    }
  }

  :global(.light-datepicker-panel) {
    color-scheme: light;
    background: var(--BgWhite);
  }

  @media (max-width: 600px) {
    :global(.plan-filter-dialog.p-dialog) {
      border-radius: 20px;
    }

    :global(.plan-filter-dialog.p-dialog .p-dialog-header),
    :global(.plan-filter-dialog.p-dialog .p-dialog-footer) {
      padding-inline: 16px;
    }

    :global(.plan-filter-dialog.p-dialog .p-dialog-content) {
      padding-inline: 12px;
    }

    .filters.plan-filters {
      gap: 10px;
      padding-block: 12px;
    }

    .plan-filter-section {
      padding: 16px;
    }

    .plan-status-choices {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .filter-actions {
      grid-template-columns: minmax(0, 1.35fr) minmax(104px, 1fr);
    }
  }
</style>
