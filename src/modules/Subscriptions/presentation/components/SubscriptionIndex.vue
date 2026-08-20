<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import DatePicker from 'primevue/datepicker';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import PlanViewIcon from '@/shared/icons/Plan/PlanViewIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';
  import CloseCircleIcon from '@/assets/icons/Subscription/close-circle.svg';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import { debounce } from '@/base/Presentation/Utils/debouced';
  import EducationClassificationController from '@/modules/EducationClassification/presentation/controllers/educationClassification.controller';
  import IndexEducationClassificationParams from '@/modules/EducationClassification/core/params/index.educationClassification.params';
  import PlanController from '@/modules/Plan/presentation/controllers/plan.controller';
  import IndexPlanParams from '@/modules/Plan/core/params/index.plan.params';
  import type SubscriptionModel from '../../core/models/subscription.model';
  import {
    SubscriptionStatusEnum,
    type SubscriptionStatusEnum as SubscriptionStatus,
  } from '../../core/enums/subscription.status.enum';
  import { DeleteSubscriptionParams } from '../../core/params/delete.subscription.params';
  import { IndexSubscriptionParams } from '../../core/params/index.subscription.params';
  import SubscriptionController from '../controllers/subscription.controller';
  import SubscriptionDetailsDialog from '../subComponents/SubscriptionDetailsDialog.vue';
  import SubscriptionBulkDeleteWarningDialog from '../subComponents/SubscriptionBulkDeleteWarningDialog.vue';
  import SubscriptionDeleteWarningDialog from '../subComponents/SubscriptionDeleteWarningDialog.vue';
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';

  const { t } = useI18n();
  const controller = SubscriptionController.getInstance();
  const educationController = EducationClassificationController.getInstance();
  const planController = PlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const word = ref('');
  const perPage = ref(10);
  const education = ref<TitleInterface<number> | null>(null);
  const plan = ref<TitleInterface<number> | null>(null);
  const status = ref<TitleInterface<number> | null>(null);
  const paidFrom = ref<number>();
  const paidTo = ref<number>();
  const subscribeFrom = ref<Date | null>(null);
  const subscribeTo = ref<Date | null>(null);
  const expireFrom = ref<Date | null>(null);
  const expireTo = ref<Date | null>(null);
  const filterDialogVisible = ref(false);
  const bulkDeleteWarningDialogVisible = ref(false);
  const deleteWarningDialogVisible = ref(false);
  const detailsDialogVisible = ref(false);
  const selectedSubscriptionId = ref<number | null>(null);
  const hasQuickFilters = computed(() => Boolean(education.value || plan.value || status.value));

  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const statusOptions = computed(() => [
    // { id: Number(SubscriptionStatusEnum.PENDING), title: t('subscription_status_0') },
    { id: Number(SubscriptionStatusEnum.ACTIVE), title: t('active') },
    { id: Number(SubscriptionStatusEnum.EXPIRED), title: t('expired') },
    { id: Number(SubscriptionStatusEnum.CANCELLED), title: t('cancelled') },
  ]);
  const stats = computed(() => [
    { label: t('all_subscriptions'), value: controller.stats.value?.totalSubscribertions ?? 0 },
    { label: t('active'), value: controller.stats.value?.activeSubscriptions ?? 0 },
    { label: t('cancelled'), value: controller.stats.value?.cancelledSubscriptions ?? 0 },
    { label: t('expired'), value: controller.stats.value?.expiredSubscriptions ?? 0 },
  ]);
  const headers = computed<TableHeader[]>(() => [
    { key: 'id', label: t('ID'), sortable: true, width: '9%' },
    { key: 'student', label: t('student_name'), sortable: true, width: '18%' },
    { key: 'plan', label: t('plan_name'), sortable: true, width: '18%' },
    { key: 'numberOfSubjects', label: t('number_of_subjects'), width: '11%' },
    { key: 'totalPrice', label: t('total_paid'), width: '12%' },
    { key: 'subscriptionDate', label: t('subscribe_date'), width: '15%' },
    { key: 'expireDate', label: t('expire_date'), width: '15%' },
    { key: 'status', label: t('status'), width: '11%' },
  ]);

  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexSubscriptionParams(word.value, page, perPage.value, {
        educationTypeId: education.value ? Number(education.value.id) : undefined,
        planId: plan.value ? Number(plan.value.id) : undefined,
        status: status.value ? (Number(status.value.id) as SubscriptionStatus) : undefined,
        paidFrom: paidFrom.value,
        paidTo: paidTo.value,
        subscriptionDateFrom: dateValue(subscribeFrom.value),
        subscriptionDateTo: dateValue(subscribeTo.value),
        expireDateFrom: dateValue(expireFrom.value),
        expireDateTo: dateValue(expireTo.value),
      }),
    );
  const search = debounce(() => fetchItems(1));
  const remove = async (id: number) => {
    await controller.delete(new DeleteSubscriptionParams(id));
    await Promise.all([fetchItems(), controller.fetchStats()]);
  };
  const openDetails = (id: number) => {
    selectedSubscriptionId.value = id;
    detailsDialogVisible.value = true;
  };
  const actionList = (item: SubscriptionModel) => {
    const deleteBlocked = item.status === SubscriptionStatusEnum.ACTIVE;

    return [
      {
        text: t('view'),
        icon: PlanViewIcon,
        action: () => openDetails(item.id),
      },
      {
        text: t('delete'),
        icon: DeletIcon,
        action: deleteBlocked
          ? () => {
              deleteWarningDialogVisible.value = true;
            }
          : () => remove(item.id),
        skipDeleteConfirmation: deleteBlocked,
      },
    ];
  };
  const applyFilters = async () => {
    filterDialogVisible.value = false;
    await fetchItems(1);
  };
  const resetFilters = async () => {
    education.value = null;
    plan.value = null;
    status.value = null;
    paidFrom.value = undefined;
    paidTo.value = undefined;
    subscribeFrom.value = null;
    subscribeTo.value = null;
    expireFrom.value = null;
    expireTo.value = null;
    await applyFilters();
  };
  const removeQuickFilter = async (filter: 'education' | 'plan' | 'status') => {
    if (filter === 'education') education.value = null;
    if (filter === 'plan') plan.value = null;
    if (filter === 'status') status.value = null;
    await fetchItems(1);
  };
  const clearQuickFilters = async () => {
    education.value = null;
    plan.value = null;
    status.value = null;
    await fetchItems(1);
  };

  onMounted(() => Promise.all([fetchItems(), controller.fetchStats()]));

  const selectedRows = ref<SubscriptionModel[]>([]);
  const updateSelectedRows = (rows: SubscriptionModel[]) => {
    selectedRows.value = rows;
  };
  const DeleteItems = async () => {
    if (selectedRows.value.some((item) => item.status === SubscriptionStatusEnum.ACTIVE)) {
      bulkDeleteWarningDialogVisible.value = true;
      return;
    }

    selectedRows.value.forEach((item) => {
      remove(item.id);
    });
  };
</script>

<template>
  <section class="subscription-page">
    <div class="stat-grid">
      <article v-for="card in stats" :key="card.label">
        <span>{{ card.label }}</span>
        <strong>{{ card.value }}</strong>
      </article>
    </div>

    <div class="quick-filters">
      <div class="quick-filter">
        <UpdatedCustomInputSelect
          v-model="education"
          has-header
          :placeholder="$t('education_type')"
          :controller="educationController"
          :reload="false"
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
          @update:model-value="fetchItems(1)"
        />
      </div>
      <div class="quick-filter">
        <UpdatedCustomInputSelect
          v-model="plan"
          has-header
          :placeholder="$t('plan_name')"
          :controller="planController"
          :reload="false"
          :params="new IndexPlanParams('', 1, 100)"
          @update:model-value="fetchItems(1)"
        />
      </div>
      <div class="quick-filter">
        <UpdatedCustomInputSelect
          v-model="status"
          has-header
          :placeholder="$t('status')"
          :static-options="statusOptions"
          :reload="false"
          @update:model-value="fetchItems(1)"
        />
      </div>

      <div v-if="hasQuickFilters" class="selected-filter-summary">
        <div class="selected-filter-list">
          <div v-if="education" class="selected-filter-chip">
            <span class="selected-filter-label">{{ $t('education_type') }}:</span>
            <span>{{ education.title }}</span>
            <button
              type="button"
              :aria-label="`${$t('remove')} ${$t('education_type')}`"
              @click="removeQuickFilter('education')"
            >
              <img :src="CloseCircleIcon" alt="" />
            </button>
          </div>
          <div v-if="plan" class="selected-filter-chip">
            <span class="selected-filter-label">{{ $t('plan_name') }}:</span>
            <span>{{ plan.title }}</span>
            <button
              type="button"
              :aria-label="`${$t('remove')} ${$t('plan_name')}`"
              @click="removeQuickFilter('plan')"
            >
              <img :src="CloseCircleIcon" alt="" />
            </button>
          </div>
          <div v-if="status" class="selected-filter-chip">
            <span class="selected-filter-label">{{ $t('status') }}:</span>
            <span>{{ status.title }}</span>
            <button
              type="button"
              :aria-label="`${$t('remove')} ${$t('status')}`"
              @click="removeQuickFilter('status')"
            >
              <img :src="CloseCircleIcon" alt="" />
            </button>
          </div>
        </div>
        <button type="button" class="clear-filter-button" @click="clearQuickFilters">
          {{ $t('clear_all') }}
        </button>
      </div>
    </div>

    <header class="index-header">
      <label class="subscription-search">
        <IndexSearchIcon />
        <input
          v-model="word"
          type="search"
          :placeholder="$t('search_subscriptions_placeholder')"
          @input="search"
        />
      </label>

      <FilterDialog
        v-model="filterDialogVisible"
        dialog-class="subscription-filter-dialog"
        width="40rem"
      >
        <template #content>
          <div class="subscription-filters">
            <section class="subscription-filter-section subscription-filter-select">
              <UpdatedCustomInputSelect
                v-model="education"
                has-header
                :placeholder="$t('select_education_type')"
                :controller="educationController"
                :reload="false"
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
              >
                <template #Header>
                  <div class="subscription-filter-heading">
                    <h2>{{ $t('education_type') }}</h2>
                    <button
                      type="button"
                      :aria-label="`${$t('reset')} ${$t('education_type')}`"
                      @click="education = null"
                    >
                      <ReloadIcon />
                    </button>
                  </div>
                </template>
              </UpdatedCustomInputSelect>
            </section>

            <section class="subscription-filter-section subscription-filter-select">
              <UpdatedCustomInputSelect
                v-model="plan"
                has-header
                :placeholder="$t('select_plan')"
                :controller="planController"
                :reload="false"
                :params="new IndexPlanParams('', 1, 100)"
              >
                <template #Header>
                  <div class="subscription-filter-heading">
                    <h2>{{ $t('plan_name') }}</h2>
                    <button
                      type="button"
                      :aria-label="`${$t('reset')} ${$t('plan_name')}`"
                      @click="plan = null"
                    >
                      <ReloadIcon />
                    </button>
                  </div>
                </template>
              </UpdatedCustomInputSelect>
            </section>

            <section class="subscription-filter-section">
              <h2>{{ $t('total_paid') }}</h2>
              <div class="subscription-filter-field-row">
                <label>
                  <span>{{ $t('from') }}</span>
                  <input v-model.number="paidFrom" type="number" placeholder="......." />
                </label>
                <label>
                  <span>{{ $t('to') }}</span>
                  <input v-model.number="paidTo" type="number" placeholder="......." />
                </label>
              </div>
            </section>

            <section class="subscription-filter-section">
              <div class="subscription-filter-heading">
                <h2>{{ $t('status') }}</h2>
                <button
                  type="button"
                  :aria-label="`${$t('reset')} ${$t('status')}`"
                  @click="status = null"
                >
                  <ReloadIcon />
                </button>
              </div>
              <div class="subscription-status-options">
                <label
                  v-for="option in statusOptions"
                  :key="option.id"
                  :class="`subscription-status-option-${option.id} ${option.title}`"
                >
                  <input v-model="status" type="radio" :value="option" />
                  <span class="subscription-filter-checkbox"></span>
                  <span>{{ option.title }}</span>
                </label>
              </div>
            </section>

            <section class="subscription-filter-section">
              <h2>{{ $t('subscribe_date') }}</h2>
              <div class="subscription-filter-field-row subscription-date-row">
                <label>
                  <span>{{ $t('from') }}</span>
                  <DatePicker
                    v-model="subscribeFrom"
                    :placeholder="$t('date_format_placeholder')"
                    show-icon
                    panel-class="light-datepicker-panel"
                  />
                </label>
                <label>
                  <span>{{ $t('to') }}</span>
                  <DatePicker
                    v-model="subscribeTo"
                    :placeholder="$t('date_format_placeholder')"
                    show-icon
                    panel-class="light-datepicker-panel"
                  />
                </label>
              </div>
            </section>

            <section class="subscription-filter-section subscription-expire-section">
              <h2>{{ $t('expire_date') }}</h2>
              <div class="subscription-filter-field-row subscription-date-row">
                <label>
                  <span>{{ $t('from') }}</span>
                  <DatePicker
                    v-model="expireFrom"
                    :placeholder="$t('date_format_placeholder')"
                    show-icon
                    panel-class="light-datepicker-panel"
                  />
                </label>
                <label>
                  <span>{{ $t('to') }}</span>
                  <DatePicker
                    v-model="expireTo"
                    :placeholder="$t('date_format_placeholder')"
                    show-icon
                    panel-class="light-datepicker-panel"
                  />
                </label>
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
    </header>

    <div class="subscription-table-card">
      <DataStatusBuilder
        :controller="state"
        :on-retry="
          async () => {
            await fetchItems();
          }
        "
      >
        <template #success="{ data }">
          <AppTable
            :headers="headers"
            :items="data as SubscriptionModel[]"
            row-key="id"
            :selectable="true"
            @selection-change="updateSelectedRows"
            
          >
            <template #cell-student="{ item }">{{ item.student.name }}</template>
            <template #cell-plan="{ item }">{{ item.plan.title }}</template>
            <template #cell-status="{ item }">
              <span class="subscription-status" :class="`subscription-status-${item.status}`">
                {{ $t(`subscription_status_${item.status}`) }}
              </span>
            </template>
            <template #actions="{ item }">
              <DropList
                :action-list="actionList(item)"
                :delete-dialog-title="$t('subscription_confirm_delete')"
                :delete-dialog-message="$t('subscription_confirm_delete_message')"
              />
            </template>
          </AppTable>
          <div v-if="selectedRows.length > 0" class="items-deleted">
            <div class="num-type">
              <h6>{{ selectedRows.length }} subscription details</h6>
            </div>
            <div class="num-deleted" @click="DeleteItems">
              <h6>delete {{ selectedRows.length }} item</h6>
            </div>
          </div>
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
        <template #empty>
          <NoItemContainer
            :title="'No subscriptions yet'"
            :description="'No students have signed up for your plans yet. Subscriptions will appear here once the first student joins.'"
          />
        </template>
      </DataStatusBuilder>
    </div>
    <SubscriptionBulkDeleteWarningDialog v-model="bulkDeleteWarningDialogVisible" />
    <SubscriptionDeleteWarningDialog v-model="deleteWarningDialogVisible" />
    <SubscriptionDetailsDialog
      v-model="detailsDialogVisible"
      :subscription-id="selectedSubscriptionId"
    />
  </section>
</template>

<style scoped lang="scss">
  .Active {
    span {
      color: #18a957;
    }
  }

  .Expired {
    span {
      color: #d64545;
    }
  }

  .Cancelled {
    span {
      color: #d99100;
    }
  }

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

  .subscription-page {
    display: grid;
    gap: 16px;
    color: var(--Black);
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;

    article {
      min-height: 64px;
      padding: 12px 16px;
      display: grid;
      align-content: space-between;
      gap: 8px;
      background: var(--gray-50-std);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    span {
      color: var(--SecondText);
      font-size: 14px;
      font-weight: 500;
    }

    strong {
      color: var(--Black);
      font-size: 18px;
      font-weight: 600;
    }
  }

  .quick-filters {
    min-height: 64px;
    padding: 12px 16px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 16px;
    row-gap: 8px;
    align-items: center;
    background: var(--gray-50-std);
    border-radius: var(--radius-xl);
  }

  .quick-filter {
    min-width: 0;
  }

  .quick-filter :deep(.input-select) {
    min-height: 48px;
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);
    background: var(--BgWhite);
    box-shadow: none;
  }

  .quick-filter :deep(.p-select-label) {
    padding: 13px 16px;
    color: var(--Black);
    font-size: 14px;
    font-weight: 600;
  }

  .quick-filter :deep(.p-select-dropdown) {
    width: 44px;
  }

  .selected-filter-summary {
    grid-column: 1 / -1;
    min-height: 40px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: var(--PrimaryColor-alpha-8);
    border-radius: var(--radius-lg);
  }

  .selected-filter-list {
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .selected-filter-chip {
    min-height: 28px;
    padding: 5px 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--Black);
    background: var(--BgWhite);
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 500;

    .selected-filter-label {
      color: var(--primary-green);
    }

    button {
      width: 16px;
      height: 16px;
      padding: 0;
      display: grid;
      flex: 0 0 16px;
      place-items: center;
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    img {
      width: 16px;
      height: 16px;
      display: block;
    }
  }

  .clear-filter-button {
    flex: 0 0 auto;
    padding: 2px 0;
    color: var(--primary-green);
    background: transparent;
    border: 0;
    border-bottom: 1px solid currentColor;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
  }

  .index-header {
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .subscription-search {
    width: min(300px, 100%);
    height: 42px;
    padding-inline: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--gray-500-std);
    background: var(--BgWhite);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);

    input {
      width: 100%;
      min-width: 0;
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
    }
  }

  .index-header :deep(.fillter-button) {
    min-width: 100px;
    min-height: 42px;
    padding-inline: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--Black);
    background: var(--BgWhite);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);
  }

  .subscription-table-card {
    min-width: 0;
    overflow: hidden;
    background: var(--BgWhite);
    border-radius: 10px;
  }

  .subscription-table-card :deep(.app-table) {
    min-width: 920px;
  }

  .subscription-table-card :deep(.app-table thead tr th) {
    height: 56px;
    padding: 12px 16px;
    color: var(--Black);
    background: var(--color-light-gray);
    border-bottom: 0;
    font-size: 14px;
    text-transform: none;
    letter-spacing: 0;
  }

  .subscription-table-card :deep(.app-table thead tr th .th-content) {
    justify-content: flex-start;
    gap: 4px;
  }

  .subscription-table-card :deep(.app-table thead tr th .th-content span) {
    font-size: 14px;
    text-transform: capitalize;
  }

  .subscription-table-card :deep(.app-table tbody tr) {
    height: 64px;
    background: var(--BgWhite);
  }

  .subscription-table-card :deep(.app-table tbody tr td) {
    padding: 12px 16px;
    color: var(--Gray-6);
    font-size: 14px;
    font-weight: 500;
  }

  .subscription-table-card :deep(.app-table .th-checkbox),
  .subscription-table-card :deep(.app-table .td-checkbox) {
    width: 48px;
    padding-inline: 16px 4px;
  }

  .subscription-table-card :deep(.app-table .th-actions),
  .subscription-table-card :deep(.app-table .td-actions) {
    width: 52px;
    padding-inline: 8px 16px;
  }

  .subscription-status {
    font-weight: 500;
  }

  .subscription-status-0 {
    color: var(--in-active-color);
  }

  .subscription-status-1 {
    color: var(--primary-green);
  }

  .subscription-status-2 {
    color: var(--danger-alt);
  }

  .subscription-status-3 {
    color: var(--in-active-color);
  }

  .subscription-table-card :deep(.pagination-wrapper) {
    min-height: 64px;
    margin: 0;
    padding: 12px 0;
    font-size: 14px;
  }

  .subscription-table-card :deep(.pagination-wrapper .show-results),
  .subscription-table-card :deep(.pagination-wrapper .count-per-page) {
    font-size: 14px;
  }

  .subscription-table-card :deep(.pagination-wrapper .pagination) {
    gap: 8px;
  }

  .subscription-table-card :deep(.pagination-wrapper .pagination-item) {
    width: 28px;
    height: 28px;
    padding: 5px;
    display: grid;
    place-items: center;
    border-radius: var(--radius-full);
    font-size: 14px;
  }

  .subscription-table-card :deep(.pagination-wrapper .pagination-btn) {
    min-height: 28px;
    padding: 5px 13px;
    border-radius: var(--radius-full);
    font-size: 12px;
  }

  :global(.subscription-filter-dialog.p-dialog) {
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

  :global(.subscription-filter-dialog.p-dialog .p-dialog-header) {
    flex: 0 0 auto;
    padding: 22px 24px 18px;
    background: linear-gradient(135deg, var(--standard-white), var(--PrimaryColor-alpha-4));
    border-bottom: 1px solid var(--border-weak);
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-header-actions) {
    display: flex;
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-close-button) {
    width: 36px;
    height: 36px;
    color: var(--gray-500);
    border-radius: var(--radius-full);
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-close-button:hover) {
    color: var(--PrimaryColor);
    background: var(--PrimaryColor-alpha-8);
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-content) {
    min-height: 0;
    flex: 1 1 auto;
    padding: 0 20px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--gray-50-std);
    scrollbar-color: var(--gray-300) transparent;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-content::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-content::-webkit-scrollbar-thumb) {
    background: var(--gray-300);
    border-radius: var(--radius-full);
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-content::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.subscription-filter-dialog.p-dialog .p-dialog-footer) {
    flex: 0 0 auto;
    padding: 16px 24px 20px;
    background: var(--standard-white);
    border-top: 1px solid var(--border-weak);
    box-shadow: var(--shadow-sm);
  }

  :global(.subscription-filter-dialog.p-dialog .filter-title) {
    margin: 0;
    color: var(--gray-900);
    font-family: var(--font-family);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
  }

  .subscription-filters {
    display: grid;
    gap: 12px;
    padding-block: 18px;
    font-family: var(--font-family);
  }

  .subscription-filter-section {
    min-width: 0;
    padding: 18px;
    background: var(--standard-white);
    border: 1px solid var(--border-weak);
    border-radius: 18px;
    box-shadow: var(--shadow-sm);

    h2 {
      margin: 0 0 14px;
      color: var(--gray-800);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .subscription-filter-heading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    h2 {
      margin: 0;
    }

    button {
      width: 32px;
      height: 32px;
      padding: 0;
      display: grid;
      place-items: center;
      color: var(--gray-500);
      background: var(--gray-50-std);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-full);
      cursor: pointer;

      &:hover {
        color: var(--PrimaryColor);
        background: var(--PrimaryColor-alpha-8);
        border-color: var(--PrimaryColor-alpha-30);
      }
    }
  }

  .subscription-filter-select {
    :deep(.input-label) {
      width: 100%;
    }

    :deep(.input-select) {
      height: 52px;
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
      color: var(--gray-text);
      font-size: 14px;
    }

    :deep(.p-select-dropdown) {
      width: 48px;
    }
  }

  .subscription-filter-field-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;

    label {
      min-width: 0;
      display: flex;
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

  .subscription-status-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    gap: 10px;

    label {
      min-width: 0;
      min-height: 46px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
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
    }

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
    }
  }

  .subscription-filter-checkbox {
    position: relative;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    background: var(--standard-white);
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-full);
  }

  .subscription-status-options input:checked + .subscription-filter-checkbox {
    background: var(--standard-white);
    border-color: currentColor;

    &::after {
      position: absolute;
      width: 8px;
      height: 8px;
      top: 4px;
      left: 4px;
      background: currentColor;
      border-radius: var(--radius-full);
      content: '';
    }
  }

  .subscription-status-option-1 {
    color: var(--primary-green);
  }

  .subscription-status-option-0 {
    color: var(--in-active-color);
  }

  .subscription-status-option-2 {
    color: var(--danger-alt);
  }

  .subscription-status-option-3 {
    color: var(--in-active-color);
  }

  .subscription-date-row {
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

  .subscription-expire-section {
    margin-bottom: 0;
  }

  .filter-actions {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(120px, 1fr);
    gap: 12px;
    width: 100%;

    button {
      width: 100%;
      height: 50px;
      margin: 0 !important;
      border-radius: var(--radius-full);
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

  @media (max-width: 900px) {
    .stat-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .quick-filters {
      grid-template-columns: 1fr;
    }

    .selected-filter-summary {
      align-items: flex-start;
    }
  }

  @media (max-width: 600px) {
    .stat-grid {
      grid-template-columns: 1fr;
    }

    .index-header {
      align-items: stretch;
    }

    .subscription-search {
      flex: 1;
    }

    .subscription-filter-field-row {
      grid-template-columns: 1fr;
    }

    .subscription-status-options {
      grid-template-columns: 1fr;
    }

    :global(.subscription-filter-dialog.p-dialog) {
      border-radius: 20px;
    }

    :global(.subscription-filter-dialog.p-dialog .p-dialog-header),
    :global(.subscription-filter-dialog.p-dialog .p-dialog-footer) {
      padding-inline: 16px;
    }

    :global(.subscription-filter-dialog.p-dialog .p-dialog-content) {
      padding-inline: 12px;
    }

    .subscription-filters {
      gap: 10px;
      padding-block: 12px;
    }

    .subscription-filter-section {
      padding: 16px;
    }

    .filter-actions {
      grid-template-columns: minmax(0, 1.35fr) minmax(104px, 1fr);
    }
  }
</style>
