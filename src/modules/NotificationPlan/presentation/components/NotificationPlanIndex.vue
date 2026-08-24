<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import ToggleSwitch from 'primevue/toggleswitch';
  import AppTable, { type TableHeader } from '@/shared/HelpersComponents/AppTable.vue';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import Pagination from '@/shared/HelpersComponents/Pagination.vue';
  import NoItemContainer from '@/shared/HelpersComponents/NoItemContainer.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import EditIcon from '@/shared/icons/DropListIcons/EditIcon.vue';
  import DeletIcon from '@/shared/icons/DropListIcons/DeletIcon.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import NotificationPlanController from '../controllers/notification.plan.controller';
  import type NotificationPlanModel from '../../core/models/notification.plan.model';
  import IndexNotificationPlanParams from '../../core/params/index.notification.plan.params';
  import DeleteNotificationPlanParams from '../../core/params/delete.notification.plan.params';
  import ToggleNotificationPlanStatusParams from '../../core/params/toggle.notification.plan.status.params';

  const router = useRouter();
  const { t } = useI18n();
  const controller = NotificationPlanController.getInstance();
  const state = computed(() => controller.listState.value);
  const perPage = ref(10);
  const selectedStatus = ref<TitleInterface<number> | null>(null);
  const statusOptions = computed(() => [
    new TitleInterface({ id: -1, title: t('notification_plan.all_statuses') }),
    new TitleInterface({ id: 1, title: t('notification_plan.active') }),
    new TitleInterface({ id: 0, title: t('notification_plan.inactive') }),
  ]);
  const headers = computed<TableHeader[]>(() => [
    { key: 'title', label: t('notification_plan.columns.title') },
    { key: 'employees', label: t('notification_plan.columns.employees') },
    { key: 'actions', label: t('notification_plan.columns.actions') },
    { key: 'status', label: t('notification_plan.columns.status') },
  ]);

  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexNotificationPlanParams(
        '',
        page,
        perPage.value,
        selectedStatus.value && selectedStatus.value.id !== -1
          ? selectedStatus.value.id === 1
          : undefined,
      ),
    );
  const titles = (items: Array<{ title?: string }>) =>
    items
      .map(({ title }) => title)
      .filter(Boolean)
      .join(', ') || t('notification_plan.not_available');
  const actionTitles = (item: NotificationPlanModel) =>
    item.actions
      .map(({ label, name }) => label || name)
      .filter(Boolean)
      .join(', ') || t('notification_plan.not_available');
  const changeStatus = async (item: NotificationPlanModel, isActive: boolean) => {
    await controller.toggleStatus(new ToggleNotificationPlanStatusParams(item.id, isActive));
    await fetchItems(controller.pagination.value?.currentPage ?? 1);
  };
  const remove = async (id: number) => {
    await controller.delete(new DeleteNotificationPlanParams(id));
    await fetchItems();
  };
  const actionList = (item: NotificationPlanModel) => [
    {
      text: t('edit'),
      icon: EditIcon,
      link: `/notification-plans/edit/${item.id}`,
    },
    {
      text: t('delete'),
      icon: DeletIcon,
      action: () => remove(item.id),
    },
  ];

  onMounted(() => fetchItems());
</script>

<template>
  <section class="notification-plan-index">
    <header class="notification-plan-index__header">
      <div class="notification-plan-index__filter">
        <span>{{ $t('notification_plan.status_filter') }}</span>
        <UpdatedCustomInputSelect
          v-model="selectedStatus"
          :static-options="statusOptions"
          :placeholder="$t('notification_plan.all_statuses')"
          :reload="false"
          @update:model-value="fetchItems()"
        />
      </div>
      <button class="btn btn-primary" type="button" @click="router.push('/notification-plans/add')">
        {{ $t('notification_plan.add') }}
      </button>
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
        <AppTable :headers="headers" :items="data as NotificationPlanModel[]" show-index>
          <template #cell-employees="{ item }">{{ titles(item.employees) }}</template>
          <template #cell-hierarchies="{ item }">{{ titles(item.hierarchies) }}</template>
          <template #cell-actions="{ item }">{{ actionTitles(item) }}</template>
          <template #cell-status="{ item }">
            <label class="notification-plan-index__status">
              <ToggleSwitch
                :model-value="item.isActive"
                :aria-label="$t('notification_plan.columns.status')"
                @update:model-value="changeStatus(item, $event)"
              />
              <span>{{
                $t(item.isActive ? 'notification_plan.active' : 'notification_plan.inactive')
              }}</span>
            </label>
          </template>
          <template #actions="{ item }"><DropList :action-list="actionList(item)" /></template>
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
      <template #empty>
        <NoItemContainer
          :title="$t('notification_plan.empty')"
          :description="$t('notification_plan.empty_description')"
        />
      </template>
    </DataStatusBuilder>
  </section>
</template>

<style scoped lang="scss">
  .notification-plan-index {
    display: grid;
    gap: var(--xl-size-base);
  }

  .notification-plan-index__header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--xl-size-base);
  }

  .notification-plan-index__filter {
    width: min(100%, 550px);
    display: grid;
    gap: var(--xs-size);
  }

  .notification-plan-index__status {
    display: inline-flex;
    align-items: center;
    gap: var(--xs-size);
  }

  @media (max-width: 768px) {
    .notification-plan-index__header {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
