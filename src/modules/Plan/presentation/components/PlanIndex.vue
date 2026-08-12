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
  import DeactiveIcon from '@/shared/icons/Plan/DeactiveIcon.vue';
  import ArchiveIcon from '@/shared/icons/Plan/ArchiveIcon.vue';
  import PlanEditIcon from '@/shared/icons/Plan/PlanEditIcon.vue';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';
  import PlanViewIcon from '@/shared/icons/Plan/PlanViewIcon.vue';
  import PlanPriceIcon from '@/shared/icons/Plan/PlanPriceIcon.vue';

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
  const hasTrial = ref<boolean | null>(null);
  const filterDialogVisible = ref(false);
  const deactivateDialogVisible = ref(false);
  const archiveDialogVisible = ref(false);
  const selectedPlanId = ref<number | null>(null);
  const statusLoading = ref(false);
  const listMode = ref<PlanStatusEnum>(PlanStatusEnum.ACTIVE);
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
        hasTrial: hasTrial.value ?? undefined,
        status:
          listMode.value === PlanStatusEnum.Archived
            ? PlanStatusEnum.Archived
            : status.value
              ? (status.value.id as PlanStatusEnum)
              : PlanStatusEnum.ACTIVE,
        duration: durationType.value?.id || undefined,
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
      icon: PlanViewIcon,
      link: `/plans/${item.id}`,
    },
    {
      text: t('edit_price'),
      icon: PlanPriceIcon,
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
    hasTrial.value = null;
    durationType.value = undefined;
    fromDate.value = null;
    toDate.value = null;
    status.value = null;
    lastUpdated.value = null;
    await applyFilters();
  };
  const setListMode = async (mode: PlanStatusEnum) => {
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
        <FilterDialog
          v-model="filterDialogVisible"
          dialog-class="plan-filter-dialog"
          width="40rem"
        >
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
                  label="duration"
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
                    :class="`plan-status-choice-${option.id}`"
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

              <div class="filter-actions">
                <button class="btn btn-primary" @click="applyFilters">{{ $t('apply') }}</button>
                <button class="btn btn-cancel" @click="resetFilters">{{ $t('reset') }}</button>
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

  :global(.plan-filter-dialog) {
    max-width: calc(100vw - 24px);
    border-radius: 24px 0 0 24px;
    background: var(--standard-white) !important;
    box-shadow: 0 4px 2px var(--black-alpha-10);

    .p-dialog-header {
      padding: 24px 20px 0;
    }

    .p-dialog-content {
      padding: 24px 20px;
    }

    .filter-title {
      margin: 0;
      color: var(--standard-black);
      font-family: var(--font-family);
      font-size: 20px;
      line-height: normal;
    }
  }

  .filters.plan-filters {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .plan-filter-section {
    padding-block: 20px;
    border-bottom: 1px solid var(--input-border-color);

    &:first-child {
      padding-top: 0;
    }

    h2 {
      margin: 0;
      color: var(--title-header-color);
      font-family: var(--font-family);
      font-size: 18px;
      font-weight: 600;
      line-height: 26px;
    }
  }

  .plan-filter-select {
    :deep(.input-label) {
      color: var(--title-header-color) !important;
      font-size: 16px !important;
      font-weight: 600 !important;
    }

    :deep(.input-select) {
      height: 56px;
      margin-top: 4px;
      border: 1px solid var(--input-border-color);
      border-radius: var(--radius-full);
      background: var(--standard-white);
    }

    :deep(.p-select-label) {
      display: flex;
      align-items: center;
      padding-inline: 16px;
      color: var(--gray-400);
      font-size: 16px;
    }

    :deep(.reload-icon) {
      margin-inline: 0;
    }
  }

  .plan-filter-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .plan-filter-reset {
    display: grid;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--gray-text);
    cursor: pointer;
    place-items: center;

    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }

  .plan-price-filter {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .plan-price-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;

    label {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 4px;
      color: var(--title-header-color);
      font-size: 16px;
    }

    input {
      width: 100%;
      height: 56px;
      padding-inline: 16px;
      border: 1px solid var(--input-border-color);
      border-radius: var(--radius-full);
      outline: none;

      &:focus {
        border-color: var(--primary-green);
      }
    }
  }

  .plan-choice-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .plan-trial-choices {
    max-width: 277px;
  }

  .plan-choice,
  .plan-radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--standard-black);
    font-size: 16px;
    cursor: pointer;

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
    border-radius: 5px;
    background: var(--standard-white);
  }

  .plan-choice input:checked + .plan-choice-box {
    border-color: var(--primary-green);
    background: var(--primary-green);

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
    border-bottom: 0;
  }

  .plan-radio-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 16px;
  }

  .plan-radio-circle {
    position: relative;
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    border: 1px solid var(--gray-300);
    border-radius: 50%;
    background: var(--standard-white);
  }

  .plan-radio input:checked + .plan-radio-circle {
    border-color: var(--primary-green);

    &::after {
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background: var(--primary-green);
      content: '';
    }
  }

  .plan-custom-dates {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .plan-filters .filter-actions {
    display: grid;
    grid-template-columns: minmax(0, 250px) minmax(0, 144px);
    gap: 16px;
    padding-top: 12px;

    .btn {
      width: 100%;
      height: 56px;
      margin: 0 !important;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 16px;
    }

    .btn-cancel {
      border: 1px solid var(--background-btn-hard-color);
      background: var(--background-btn-outline-color);
      color: var(--btn-red);
    }
  }

  :global(.light-datepicker-panel) {
    color-scheme: light;
    background: var(--BgWhite);
  }

  @media (max-width: 520px) {
    :global(.plan-filter-dialog) {
      border-radius: var(--radius-xl);
    }

    .plan-status-choices {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .plan-filters .filter-actions {
      grid-template-columns: minmax(0, 1fr) minmax(110px, 0.58fr);
    }
  }
</style>
