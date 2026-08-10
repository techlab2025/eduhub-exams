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
  import EducationClassificationController from '@/modules/EducationClassification/presentation/controllers/educationClassification.controller';
  import IndexEducationClassificationParams from '@/modules/EducationClassification/core/params/index.educationClassification.params';
  import PlanController from '@/modules/Plan/presentation/controllers/plan.controller';
  import { IndexPlanParams } from '@/modules/Plan/core/params/plan.params';
  import type SubscriptionModel from '../../core/models/subscription.model';
  import { SubscriptionStatusEnum } from '../../core/models/subscription.model';
  import {
    DeleteSubscriptionParams,
    IndexSubscriptionParams,
  } from '../../core/params/subscription.params';
  import SubscriptionController from '../controllers/subscription.controller';

  const { t } = useI18n();
  const router = useRouter();
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
  const dateValue = (date: Date | null) => date?.toISOString().slice(0, 10);
  const statusOptions = computed(() => [
    { id: Number(SubscriptionStatusEnum.ACTIVE), title: t('active') },
    { id: Number(SubscriptionStatusEnum.EXPIRED), title: t('expired') },
    { id: Number(SubscriptionStatusEnum.CANCELLED), title: t('cancelled') },
  ]);
  const stats = computed(() => [
    { label: t('total_subscribers'), value: controller.stats.value?.totalSubscribers ?? 0 },
    { label: t('active_subscriptions'), value: controller.stats.value?.activeSubscriptions ?? 0 },
    {
      label: t('cancelled_subscriptions'),
      value: controller.stats.value?.cancelledSubscriptions ?? 0,
    },
    { label: t('expired_subscriptions'), value: controller.stats.value?.expiredSubscriptions ?? 0 },
  ]);
  const headers = computed<TableHeader[]>(() => [
    { key: 'student', label: t('student') },
    { key: 'plan', label: t('plan') },
    { key: 'totalPrice', label: t('total_paid') },
    { key: 'subscriptionDate', label: t('subscription_date') },
    { key: 'expireDate', label: t('expire_date') },
    { key: 'status', label: t('status') },
  ]);
  const fetchItems = (page = 1) =>
    controller.fetchList(
      new IndexSubscriptionParams(word.value, page, perPage.value, {
        educationTypeId: education.value ? Number(education.value.id) : undefined,
        planId: plan.value ? Number(plan.value.id) : undefined,
        status: status.value ? (String(status.value.id) as SubscriptionStatusEnum) : undefined,
        paidFrom: paidFrom.value,
        paidTo: paidTo.value,
        subscriptionDateFrom: dateValue(subscribeFrom.value),
        subscriptionDateTo: dateValue(subscribeTo.value),
        expireDateFrom: dateValue(expireFrom.value),
        expireDateTo: dateValue(expireTo.value),
      }),
    );
  const remove = async (id: number) => {
    if (!window.confirm(t('confirm_delete'))) return;
    await controller.delete(new DeleteSubscriptionParams(id));
    await Promise.all([fetchItems(), controller.fetchStats()]);
  };
  const applyFilters = async () => {
    filterDialogVisible.value = false;
    await fetchItems();
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
  onMounted(() => Promise.all([fetchItems(), controller.fetchStats()]));
</script>

<template>
  <section>
    <div class="stat-grid">
      <article v-for="card in stats" :key="card.label">
        <span>{{ card.label }}</span
        ><strong>{{ card.value }}</strong>
      </article>
    </div>
    <header class="index-header">
      <input
        v-model="word"
        class="search-input"
        :placeholder="$t('search')"
        @input="fetchItems()"
      />
      <FilterDialog v-model="filterDialogVisible">
        <template #content>
          <div class="filters">
            <UpdatedCustomInputSelect
              v-model="education"
              :label="$t('education_type')"
              :placeholder="$t('select_education_type')"
              :controller="educationController"
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
            />
            <UpdatedCustomInputSelect
              v-model="plan"
              :label="$t('plan')"
              :placeholder="$t('select_plan')"
              :controller="planController"
              :params="new IndexPlanParams('', 1, 100)"
            />
            <UpdatedCustomInputSelect
              v-model="status"
              :label="$t('status')"
              :placeholder="$t('select_status')"
              :static-options="statusOptions"
            />
            <input v-model.number="paidFrom" type="number" :placeholder="$t('paid_from')" /><input
              v-model.number="paidTo"
              type="number"
              :placeholder="$t('paid_to')"
            />
            <DatePicker
              v-model="subscribeFrom"
              :placeholder="$t('subscription_from')"
              show-icon
              panel-class="light-datepicker-panel"
            /><DatePicker
              v-model="subscribeTo"
              :placeholder="$t('subscription_to')"
              show-icon
              panel-class="light-datepicker-panel"
            />
            <DatePicker
              v-model="expireFrom"
              :placeholder="$t('expiry_from')"
              show-icon
              panel-class="light-datepicker-panel"
            /><DatePicker
              v-model="expireTo"
              :placeholder="$t('expiry_to')"
              show-icon
              panel-class="light-datepicker-panel"
            />
            <div class="filter-actions">
              <button class="btn btn-cancel" @click="resetFilters">{{ $t('reset') }}</button>
              <button class="btn btn-primary" @click="applyFilters">{{ $t('apply') }}</button>
            </div>
          </div>
        </template>
      </FilterDialog>
    </header>
    <DataStatusBuilder
      :controller="state"
      :on-retry="
        async () => {
          await fetchItems();
        }
      "
      ><template #success="{ data }"
        ><AppTable :headers="headers" :items="data as SubscriptionModel[]" show-index>
          <template #cell-student="{ item }">{{ item.student.name }}</template
          ><template #cell-plan="{ item }">{{ item.plan.title }}</template
          ><template #cell-status="{ item }">{{
            $t(`subscription_status_${item.status}`)
          }}</template>
          <template #actions="{ item }"
            ><div class="row-actions">
              <button class="btn" @click="router.push(`/subscriptions/${item.id}`)">
                {{ $t('view') }}</button
              ><button class="btn btn-cancel" @click="remove(item.id)">{{ $t('delete') }}</button>
            </div></template
          > </AppTable
        ><Pagination
          v-if="controller.pagination.value"
          :pagination="controller.pagination.value"
          @change-page="fetchItems"
          @count-per-page="
            (count) => {
              perPage = count;
              fetchItems();
            }
          " /></template
    ></DataStatusBuilder>
  </section>
</template>

<style scoped lang="scss">
  .stat-grid,
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--xs-size);
    margin-bottom: var(--xl-size-base);
  }

  .index-header,
  .filter-actions {
    display: flex;
    gap: var(--xs-size);
    justify-content: space-between;
  }

  .filter-actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }

  .stat-grid article,
  .filters {
    padding: var(--xl-size-base);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .stat-grid article {
    display: grid;
    gap: var(--xs-size);
  }

  .stat-grid strong {
    font-size: var(--xl-size);
    color: var(--PrimaryColor);
  }

  .filters input {
    min-height: 44px;
    padding: var(--xs-size);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
    background: var(--BgWhite);
  }

  .row-actions {
    display: flex;
    gap: var(--xs-size);
  }

  :global(.light-datepicker-panel) {
    color-scheme: light;
    background: var(--BgWhite);
  }
</style>
