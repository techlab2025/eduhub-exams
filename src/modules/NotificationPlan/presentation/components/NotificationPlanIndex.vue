<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import Dialog from 'primevue/dialog';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import ShowIcon from '@/shared/icons/ShowIcon.vue';
  import DeactiveIcon from '@/shared/icons/Plan/DeactiveIcon.vue';
  import IndexPluseIcon from '@/shared/icons/IndexPluseIcon.vue';
  import IndexSearchIcon from '@/shared/icons/IndexSearchIcon.vue';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import EmployeeController from '@/modules/employee/presentation/controllers/employee.controller';
  import IndexEmployeeParams from '@/modules/employee/core/params/index.employee.params';
  import NotificationPlanController from '../controllers/notification.plan.controller';
  import { NotificationPlanActionEnum } from '../../core/enums/notification.plan.action.enum';
  import type NotificationPlanModel from '../../core/models/notification.plan.model';
  import IndexNotificationPlanParams from '../../core/params/index.notification.plan.params';
  import DeleteNotificationPlanParams from '../../core/params/delete.notification.plan.params';
  import ToggleNotificationPlanStatusParams from '../../core/params/toggle.notification.plan.status.params';

  const router = useRouter();
  const { locale, t } = useI18n();
  const controller = NotificationPlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const perPage = ref(10);
  const word = ref('');
  const questionsFeatureId = 1;
  const documentsFeatureId = 2;
  const filterDialogVisible = ref(false);
  const viewDialogVisible = ref(false);
  const selectedPlan = ref<NotificationPlanModel | null>(null);
  const recipientFilter = ref<TitleInterface<number> | null>(null);
  const featureFilter = ref<TitleInterface<number> | null>(null);
  const actionFilter = ref<TitleInterface<number> | null>(null);
  const statusFilters = ref<Array<'active' | 'inactive'>>([]);
  const appliedRecipientFilter = ref<TitleInterface<number> | null>(null);
  const appliedFeatureFilter = ref<TitleInterface<number> | null>(null);
  const appliedActionFilter = ref<TitleInterface<number> | null>(null);
  const appliedStatusFilters = ref<Array<'active' | 'inactive'>>([]);
  let searchTimer: ReturnType<typeof setTimeout> | undefined;

  const employeeController = EmployeeController.getInstance();
  const employeeParams = new IndexEmployeeParams({
    word: '',
    pageNumber: 1,
    perPage: 100,
    withPage: 0,
    status: null,
  });

  const featureOptions = computed(() => [
    new TitleInterface({
      id: questionsFeatureId,
      title: t('notification_plan.features.questions'),
    }),
    new TitleInterface({
      id: documentsFeatureId,
      title: t('notification_plan.features.documents'),
    }),
  ]);

  const actionOptions = computed(() => [
    new TitleInterface({
      id: NotificationPlanActionEnum.COURSE_ASSIGEND,
      title: t('notification_plan.actions.course_assigend'),
    }),
  ]);

  const headers = computed<TableHeader[]>(() => [
    {
      key: 'planId',
      label: t('notification_plan.columns.plan_id'),
      sortable: true,
      width: '120px',
    },
    { key: 'title', label: t('notification_plan.columns.title'), width: '220px' },
    {
      key: 'recipientCount',
      label: t('notification_plan.columns.recipients_count'),
      width: '170px',
    },
    {
      key: 'actionCount',
      label: t('notification_plan.columns.actions_count'),
      width: '150px',
    },
    { key: 'status', label: t('notification_plan.columns.status'), width: '120px' },
    { key: 'createdBy', label: t('notification_plan.columns.created_by'), width: '160px' },
    { key: 'createdAt', label: t('notification_plan.columns.created_at'), width: '140px' },
  ]);

  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexNotificationPlanParams(
        word.value.trim(),
        page,
        perPage.value,
        appliedStatusFilters.value.length === 1
          ? appliedStatusFilters.value[0] === 'active'
          : undefined,
      ),
    );

  const filterItems = (items: NotificationPlanModel[]) =>
    items.filter((item) => {
      const matchesRecipient =
        !appliedRecipientFilter.value ||
        [...item.employees, ...item.hierarchies].some(
          ({ id }) => id === appliedRecipientFilter.value?.id,
        );
      const matchesAction =
        !appliedActionFilter.value ||
        item.actions.some(({ value }) => value === appliedActionFilter.value?.id);
      const matchesFeature =
        !appliedFeatureFilter.value ||
        (appliedFeatureFilter.value.id === questionsFeatureId
          ? item.actions.length > 0
          : item.actions.length === 0);
      const matchesStatus =
        appliedStatusFilters.value.length !== 1 ||
        item.isActive === (appliedStatusFilters.value[0] === 'active');

      return matchesRecipient && matchesAction && matchesFeature && matchesStatus;
    });

  const planId = (id: number) => `NTP-${String(id).padStart(3, '0')}`;
  const recipientCount = (item: NotificationPlanModel) =>
    item.employees.length + item.hierarchies.length;
  const formatDate = (value: string) => {
    if (!value) return t('notification_plan.not_available');
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  const changeStatus = async (item: NotificationPlanModel) => {
    await controller.toggleStatus(new ToggleNotificationPlanStatusParams(item.id, !item.isActive));
    await fetchItems(controller.pagination.value?.currentPage ?? 1);
  };

  const remove = async (id: number) => {
    await controller.delete(new DeleteNotificationPlanParams(id));
    await fetchItems();
  };

  const viewPlan = (item: NotificationPlanModel) => {
    selectedPlan.value = item;
    viewDialogVisible.value = true;
  };

  const applyFilters = async () => {
    appliedRecipientFilter.value = recipientFilter.value;
    appliedFeatureFilter.value = featureFilter.value;
    appliedActionFilter.value = actionFilter.value;
    appliedStatusFilters.value = [...statusFilters.value];
    filterDialogVisible.value = false;
    await fetchItems();
  };

  const resetFilters = async () => {
    recipientFilter.value = null;
    featureFilter.value = null;
    actionFilter.value = null;
    statusFilters.value = [];
    appliedRecipientFilter.value = null;
    appliedFeatureFilter.value = null;
    appliedActionFilter.value = null;
    appliedStatusFilters.value = [];
    filterDialogVisible.value = false;
    await fetchItems();
  };

  const actionList = (item: NotificationPlanModel) => [
    {
      text: t('notification_plan.view'),
      icon: ShowIcon,
      action: () => viewPlan(item),
    },
    {
      text: t('edit'),
      icon: EditIcon,
      link: `/notification-plans/edit/${item.id}`,
    },
    {
      text: t(item.isActive ? 'notification_plan.deactivate' : 'notification_plan.activate'),
      icon: DeactiveIcon,
      action: () => changeStatus(item),
      toggleValue: item.isActive,
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => remove(item.id),
      danger: true,
    },
  ];

  watch(word, () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => fetchItems(), 350);
  });

  onMounted(() => fetchItems());
  onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer);
  });
</script>

<template>
  <section class="notification-plan-index">
    <header class="notification-plan-index__page-actions">
      <button
        class="btn btn-primary notification-plan-index__add"
        type="button"
        @click="router.push('/notification-plans/add')"
      >
        <IndexPluseIcon aria-hidden="true" />
        {{ $t('notification_plan.add') }}
      </button>
    </header>

    <div class="notification-plan-index__toolbar">
      <form class="notification-plan-index__search" role="search" @submit.prevent="fetchItems()">
        <IndexSearchIcon aria-hidden="true" />
        <input
          v-model="word"
          type="search"
          :placeholder="$t('notification_plan.search_placeholder')"
          :aria-label="$t('notification_plan.search_placeholder')"
        />
      </form>

      <FilterDialog
        v-model="filterDialogVisible"
        dialog-class="notification-plan-filter-dialog"
        width="28.125rem"
      >
        <template #content>
          <div class="notification-plan-filter">
            <section class="notification-plan-filter__section">
              <header>
                <h2>{{ $t('notification_plan.filter_options.recipient') }}</h2>
                <button
                  type="button"
                  :aria-label="
                    $t('notification_plan.reset_filter', {
                      field: $t('notification_plan.filter_options.recipient'),
                    })
                  "
                  @click="recipientFilter = null"
                >
                  <ReloadIcon />
                </button>
              </header>
              <UpdatedCustomInputSelect
                v-model="recipientFilter"
                :controller="employeeController as any"
                :params="employeeParams"
                :placeholder="$t('notification_plan.filter_options.select_recipient')"
                :reload="false"
                :has-header="true"
              />
            </section>

            <section class="notification-plan-filter__section">
              <header>
                <h2>{{ $t('notification_plan.filter_options.feature') }}</h2>
                <button
                  type="button"
                  :aria-label="
                    $t('notification_plan.reset_filter', {
                      field: $t('notification_plan.filter_options.feature'),
                    })
                  "
                  @click="featureFilter = null"
                >
                  <ReloadIcon />
                </button>
              </header>
              <UpdatedCustomInputSelect
                v-model="featureFilter"
                :static-options="featureOptions"
                :placeholder="$t('notification_plan.filter_options.select_feature')"
                :reload="false"
                :has-header="true"
              />
            </section>

            <section class="notification-plan-filter__section">
              <header>
                <h2>{{ $t('notification_plan.filter_options.action') }}</h2>
                <button
                  type="button"
                  :aria-label="
                    $t('notification_plan.reset_filter', {
                      field: $t('notification_plan.filter_options.action'),
                    })
                  "
                  @click="actionFilter = null"
                >
                  <ReloadIcon />
                </button>
              </header>
              <UpdatedCustomInputSelect
                v-model="actionFilter"
                :static-options="actionOptions"
                :placeholder="$t('notification_plan.filter_options.select_action')"
                :reload="false"
                :has-header="true"
              />
            </section>

            <section class="notification-plan-filter__section notification-plan-filter__status">
              <header>
                <h2>{{ $t('notification_plan.status_filter') }}</h2>
              </header>
              <div>
                <label>
                  <input v-model="statusFilters" type="checkbox" value="active" />
                  <span>{{ $t('notification_plan.active') }}</span>
                </label>
                <label>
                  <input v-model="statusFilters" type="checkbox" value="inactive" />
                  <span>{{ $t('notification_plan.inactive') }}</span>
                </label>
              </div>
            </section>
          </div>
        </template>
        <template #footer>
          <div class="notification-plan-filter__actions">
            <button class="btn btn-primary" type="button" @click="applyFilters">
              {{ $t('notification_plan.apply') }}
            </button>
            <button class="btn btn-cancel" type="button" @click="resetFilters">
              {{ $t('notification_plan.form.reset') }}
            </button>
          </div>
        </template>
      </FilterDialog>
    </div>

    <DataStatusBuilder
      :controller="state"
      :on-retry="
        async () => {
          await fetchItems();
        }
      "
    >
      <template #success="{ data }">
        <div class="notification-plan-index__table">
          <AppTable
            :headers="headers"
            :items="filterItems(data as NotificationPlanModel[])"
            selectable
            hoverable
          >
            <template #cell-planId="{ item }">
              <span class="notification-plan-index__plan-id">{{ planId(item.id) }}</span>
            </template>
            <template #cell-recipientCount="{ item }">{{ recipientCount(item) }}</template>
            <template #cell-actionCount="{ item }">{{ item.actions.length }}</template>
            <template #cell-status="{ item }">
              <button
                class="notification-plan-index__status"
                :class="{ active: item.isActive, inactive: !item.isActive }"
                type="button"
                :aria-label="
                  $t('notification_plan.toggle_status', {
                    status: $t(
                      item.isActive ? 'notification_plan.inactive' : 'notification_plan.active',
                    ),
                  })
                "
                @click.stop="changeStatus(item)"
              >
                {{ $t(item.isActive ? 'notification_plan.active' : 'notification_plan.inactive') }}
              </button>
            </template>
            <template #cell-createdBy="{ item }">
              {{ item.createdBy || $t('notification_plan.not_available') }}
            </template>
            <template #cell-createdAt="{ item }">{{ formatDate(item.createdAt) }}</template>
            <template #actions="{ item }">
              <DropList :action-list="actionList(item)" variant="notification-plan" />
            </template>
          </AppTable>
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
          :title="$t('notification_plan.empty')"
          :description="$t('notification_plan.empty_description')"
        />
      </template>
    </DataStatusBuilder>

    <Dialog
      v-model:visible="viewDialogVisible"
      modal
      :header="$t('notification_plan.view_title')"
      :pt="{ root: 'notification-plan-view-dialog' }"
    >
      <dl v-if="selectedPlan" class="notification-plan-view">
        <div>
          <dt>{{ $t('notification_plan.columns.plan_id') }}</dt>
          <dd>{{ planId(selectedPlan.id) }}</dd>
        </div>
        <div>
          <dt>{{ $t('notification_plan.columns.title') }}</dt>
          <dd>{{ selectedPlan.title }}</dd>
        </div>
        <div>
          <dt>{{ $t('notification_plan.columns.recipients_count') }}</dt>
          <dd>{{ recipientCount(selectedPlan) }}</dd>
        </div>
        <div>
          <dt>{{ $t('notification_plan.columns.actions_count') }}</dt>
          <dd>{{ selectedPlan.actions.length }}</dd>
        </div>
        <div>
          <dt>{{ $t('notification_plan.columns.status') }}</dt>
          <dd :class="{ active: selectedPlan.isActive, inactive: !selectedPlan.isActive }">
            {{
              $t(selectedPlan.isActive ? 'notification_plan.active' : 'notification_plan.inactive')
            }}
          </dd>
        </div>
        <div>
          <dt>{{ $t('notification_plan.columns.created_by') }}</dt>
          <dd>{{ selectedPlan.createdBy || $t('notification_plan.not_available') }}</dd>
        </div>
        <div>
          <dt>{{ $t('notification_plan.columns.created_at') }}</dt>
          <dd>{{ formatDate(selectedPlan.createdAt) }}</dd>
        </div>
      </dl>
    </Dialog>
  </section>
</template>

<style scoped lang="scss">
  .notification-plan-index {
    min-width: 0;
    display: grid;
    gap: 20px;
    padding-bottom: 32px;
  }

  .notification-plan-index__page-actions {
    display: flex;
    justify-content: flex-end;
  }

  .notification-plan-index__add {
    min-height: 46px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-inline: 22px;
    border-radius: var(--radius-full);
  }

  .notification-plan-index__toolbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .notification-plan-index__search {
    width: min(100%, 390px);
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-inline: 16px;
    color: var(--gray-500);
    background: var(--BgWhite);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-full);
    transition: var(--transition-fast);

    &:focus-within {
      border-color: var(--PrimaryColor);
      box-shadow: 0 0 0 3px var(--PrimaryColor-light);
    }

    input {
      min-width: 0;
      flex: 1;
      color: var(--gray-900);
      background: transparent;
      border: 0;
      outline: 0;

      &::placeholder {
        color: var(--gray-400);
      }

      &::-webkit-search-cancel-button {
        cursor: pointer;
      }
    }
  }

  .notification-plan-index__toolbar :deep(.fillter-button) {
    min-width: 132px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding-inline: 18px;
    color: var(--gray-900);
    background: var(--BgWhite);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-full);
  }

  .notification-plan-filter {
    display: grid;
  }

  .notification-plan-filter__section {
    display: grid;
    gap: 12px;
    padding-block: 18px;
    border-bottom: 1px solid var(--gray-200);

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      h2 {
        margin: 0;
        color: var(--gray-700);
        font-size: 0.875rem;
        font-weight: 600;
      }

      button {
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        padding: 0;
        color: var(--gray-500);
        background: transparent;
        border: 0;
        border-radius: var(--radius-full);
        cursor: pointer;

        &:hover {
          color: var(--PrimaryColor);
          background: var(--PrimaryColor-alpha-8);
        }
      }
    }

    :deep(.input-select) {
      min-height: 48px;
      border-color: var(--gray-200) !important;
      border-radius: var(--radius-full) !important;
    }

    :deep(.p-select-label) {
      display: flex;
      align-items: center;
      padding-inline: 14px;
    }
  }

  .notification-plan-filter__status {
    border-bottom: 0;

    > div {
      display: flex;
      flex-wrap: wrap;
      gap: 22px;
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--gray-700);
      cursor: pointer;
    }

    input {
      width: 17px;
      height: 17px;
      margin: 0;
      accent-color: var(--PrimaryColor);
    }

    label:last-child span {
      color: var(--warning);
    }

    label:first-child span {
      color: var(--PrimaryColor);
    }
  }

  .notification-plan-filter__actions {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(120px, 1fr);
    gap: 14px;

    button {
      min-height: 48px;
      border-radius: var(--radius-full);
    }
  }

  .notification-plan-index__table {
    overflow: hidden;
    border-radius: 14px;

    :deep(.app-table-wrapper) {
      border-radius: 14px 14px 0 0;
    }

    :deep(.app-table thead tr th) {
      padding: 18px 16px;
      background: var(--gray-50);
      border-bottom: 0;
      text-transform: none;
      letter-spacing: 0;
    }

    :deep(.app-table thead tr th .th-content span) {
      color: var(--gray-900);
      font-size: 0.875rem;
    }

    :deep(.app-table tbody tr td) {
      height: 72px;
      padding: 16px;
      color: var(--gray-700);
      font-size: 0.875rem;
    }
  }

  .notification-plan-index__plan-id {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .notification-plan-index__status {
    padding: 0;
    background: transparent;
    border: 0;
    font: inherit;
    cursor: pointer;

    &.active {
      color: var(--PrimaryColor);
    }

    &.inactive {
      color: var(--warning);
    }
  }

  :deep(.pagination-wrapper) {
    margin-top: 8px;
  }

  .notification-plan-view {
    display: grid;
    gap: 0;
    margin: 0;

    div {
      display: grid;
      grid-template-columns: minmax(120px, 0.65fr) minmax(0, 1fr);
      gap: 18px;
      padding-block: 13px;
      border-bottom: 1px solid var(--gray-200);
    }

    dt {
      color: var(--gray-500);
    }

    dd {
      margin: 0;
      color: var(--gray-900);
      font-weight: 600;

      &.active {
        color: var(--PrimaryColor);
      }

      &.inactive {
        color: var(--warning);
      }
    }
  }

  :global(.notification-plan-filter-dialog.p-dialog) {
    max-width: calc(100vw - 24px);
    overflow: hidden;
    background: var(--BgWhite) !important;
    border: 1px solid var(--gray-200);
    border-radius: 20px;
    box-shadow: var(--shadow-xl);
  }

  :global(.notification-plan-filter-dialog.p-dialog .p-dialog-header) {
    padding: 22px 22px 10px;
    background: var(--BgWhite);
  }

  :global(.notification-plan-filter-dialog.p-dialog .filter-title) {
    margin: 0;
    color: var(--gray-900);
    font-size: 1.125rem;
    font-weight: 700;
  }

  :global(.notification-plan-filter-dialog.p-dialog .p-dialog-content) {
    padding: 0 22px;
    background: var(--BgWhite);
  }

  :global(.notification-plan-filter-dialog.p-dialog .p-dialog-footer) {
    padding: 10px 22px 22px;
    background: var(--BgWhite);
  }

  :global(.notification-plan-view-dialog.p-dialog) {
    width: min(32rem, calc(100vw - 24px));
    background: var(--BgWhite) !important;
    border: 1px solid var(--gray-200);
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    .notification-plan-index__toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .notification-plan-index__search {
      width: 100%;
    }

    .notification-plan-index__toolbar :deep(.fillter-button) {
      width: 100%;
    }

    .notification-plan-filter__actions {
      grid-template-columns: 1fr;
    }
  }
</style>
