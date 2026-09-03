<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import NotificationPlanEditIcon from '@/icons/NotificationPlanActions/NotificationPlanEditIcon.vue';
  import NotificationPlanStatusIcon from '@/icons/NotificationPlanActions/NotificationPlanStatusIcon.vue';
  import NotificationPlanDeleteIcon from '@/icons/NotificationPlanActions/NotificationPlanDeleteIcon.vue';
  import IconCheck from '@/shared/icons/IconCheck.vue';
  import notificationMessageIcon from '@/assets/icons/notification-message.svg';
  import NotificationPlanController from '../controllers/notification.plan.controller';
  import NotificationPlanDialog from './NotificationPlanDialog.vue';
  import { NotificationPlanActions } from '../../core/constants/NotificationPlanActions';
  import { StatusNotificationPlanEnum } from '../../core/enums/status.notification.plan.enum';
  import DeleteNotificationPlanParams from '../../core/params/delete.notification.plan.params';
  import ShowNotificationPlanParams from '../../core/params/show.notification.plan.params';
  import ToggleNotificationPlanStatusParams from '../../core/params/toggle.notification.plan.status.params';
  import NotificationPlanDetailsSkeleton from './NotificationPlanDetailsSkeleton.vue';

  interface ConfiguredFeature {
    id: string;
    title: string;
    actions: Array<{ id: number; title: string }>;
    message: string;
  }

  const route = useRoute();
  const router = useRouter();
  const { locale, t } = useI18n();
  const controller = NotificationPlanController.getInstance();
  const plan = computed(() => controller.itemData.value);
  const deleteDialogVisible = ref(false);
  const statusDialogVisible = ref(false);
  const statusLoading = ref(false);
  const deleteLoading = ref(false);

  const isActive = computed(() => plan.value?.status === StatusNotificationPlanEnum.active);
  const nextStatus = computed(() =>
    isActive.value ? StatusNotificationPlanEnum.inactive : StatusNotificationPlanEnum.active,
  );

  const configuredFeatures = computed<ConfiguredFeature[]>(() => {
    const currentPlan = plan.value;
    if (!currentPlan) return [];

    return NotificationPlanActions.flatMap((feature) => {
      const definitions = feature.sub_feature.flatMap(({ actions }) => actions);
      const actions = definitions
        .filter((definition) =>
          currentPlan.actions.some(({ action_ids }) => action_ids.includes(definition.action_id)),
        )
        .map((definition) => ({
          id: definition.action_id,
          title: t(definition.action_title),
        }));

      if (!actions.length) return [];

      const actionIds = new Set<number>(actions.map(({ id }) => id));
      const message =
        currentPlan.actions.find(({ action_ids }) =>
          action_ids.some((actionId) => actionIds.has(actionId)),
        )?.message ?? '';

      return [
        {
          id: feature.id,
          title: t(feature.feature_title),
          actions,
          message,
        },
      ];
    });
  });

  const refreshPlan = () =>
    controller.fetchOne(new ShowNotificationPlanParams(Number(route.params.id)));

  const changeStatus = async () => {
    if (!plan.value) return;
    statusLoading.value = true;
    try {
      const result = await controller.toggleStatus(
        new ToggleNotificationPlanStatusParams(plan.value.id, nextStatus.value),
      );
      if (result.hasError) return;
      statusDialogVisible.value = false;
      await refreshPlan();
    } finally {
      statusLoading.value = false;
    }
  };

  const remove = async () => {
    if (!plan.value) return;
    deleteLoading.value = true;
    try {
      const result = await controller.delete(new DeleteNotificationPlanParams(plan.value.id));
      if (!result || result.hasError) return;
      deleteDialogVisible.value = false;
      await router.replace({ name: 'Notification Plans' });
    } finally {
      deleteLoading.value = false;
    }
  };

  const actionList = computed(() => {
    if (!plan.value) return [];

    return [
      {
        text: t('edit'),
        icon: NotificationPlanEditIcon,
        link: `/notification-plans/edit/${plan.value.id}`,
      },
      {
        text: t(isActive.value ? 'notification_plan.deactivate' : 'notification_plan.activate'),
        icon: NotificationPlanStatusIcon,
        action: () => {
          statusDialogVisible.value = true;
        },
        toggleValue: isActive.value,
      },
      {
        text: t('delete'),
        icon: NotificationPlanDeleteIcon,
        action: () => {
          deleteDialogVisible.value = true;
        },
        skipDeleteConfirmation: true,
        danger: true,
      },
    ];
  });

  const planId = (id: number) => `NTP-${String(id).padStart(3, '0')}`;
  const displayValue = (value: string) => value || t('notification_plan.not_available');
  const formatDateTime = (value: string) => {
    if (!value) return t('notification_plan.not_available');
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-EG' : 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
      .format(date)
      .replace(/\b(am|pm)\b/gi, (period) => period.toUpperCase());
  };

  onMounted(refreshPlan);
</script>

<template>
  <DataStatusBuilder
    :controller="controller.itemState.value"
    :on-retry="async () => void (await refreshPlan())"
    use-skeleton
  >
    <template #loader>
      <NotificationPlanDetailsSkeleton />
    </template>

    <template #success>
      <main v-if="plan" class="notification-plan-details">
        <!-- <header class="notification-plan-details__page-heading">
          <h1>{{ $t('notification_plan.details.page_title') }}</h1>
        </header> -->

        <section class="notification-plan-details__summary">
          <div>
            <div class="notification-plan-details__title-line">
              <h2>{{ plan.plan_title }}</h2>
              <span
                class="notification-plan-details__status"
                :class="{ 'is-active': isActive, 'is-inactive': !isActive }"
              >
                <span aria-hidden="true">•</span>
                {{ $t(isActive ? 'notification_plan.active' : 'notification_plan.inactive') }}
              </span>
            </div>
            <p>
              {{ planId(plan.id) }} ·
              {{
                $t('notification_plan.details.updated_by', { name: displayValue(plan.updated_by) })
              }}
            </p>
          </div>

          <DropList :action-list="actionList" variant="notification-plan" />
        </section>

        <div class="notification-plan-details__layout">
          <div class="notification-plan-details__content">
            <section class="notification-plan-details__recipients notification-plan-details__card">
              <header>
                <h2>{{ $t('notification_plan.details.recipients.title') }}</h2>
                <p>{{ $t('notification_plan.details.recipients.description') }}</p>
              </header>
              <div class="notification-plan-details__recipient-list">
                <span v-for="employee in plan.employees" :key="employee.id">
                  {{ employee.name }}
                </span>
                <span v-if="!plan.employees.length">
                  {{ $t('notification_plan.not_available') }}
                </span>
              </div>
            </section>

            <div class="notification_border">
              <section class="notification-plan-details__triggers-heading">
                <h2>{{ $t('notification_plan.details.triggers.title') }}</h2>
                <p>{{ $t('notification_plan.details.triggers.description') }}</p>
              </section>
  
              <div v-if="configuredFeatures.length" class="notification-plan-details__features">
                <article
                  v-for="feature in configuredFeatures"
                  :key="feature.id"
                  class="notification-plan-details__feature"
                >
                  <header>
                    <h3>{{ feature.title }}</h3>
                    <img :src="notificationMessageIcon" alt="" aria-hidden="true" />
                  </header>
                  <div class="notification-plan-details__feature-body">
                    <div class="notification-plan-details__action-list">
                      <span v-for="action in feature.actions" :key="action.id">
                        <IconCheck aria-hidden="true" />
                        {{ action.title }}
                      </span>
                    </div>
                    <div v-if="feature.message" class="notification-plan-details__message">
                      <strong>{{ $t('notification_plan.details.message_template') }}</strong>
                      <p>{{ feature.message }}</p>
                    </div>
                  </div>
                </article>
              </div>
              <p v-else class="notification-plan-details__empty-triggers">
                {{ $t('notification_plan.details.triggers.empty') }}
              </p>
            </div>
          </div>

          <aside class="notification-plan-details__record notification-plan-details__card">
            <h2>{{ $t('notification_plan.details.record.title') }}</h2>
            <dl>
              <div>
                <dt>{{ $t('notification_plan.details.record.created_by') }}</dt>
                <dd>{{ displayValue(plan.created_by) }}</dd>
              </div>
              <div>
                <dt>{{ $t('notification_plan.details.record.created_at') }}</dt>
                <dd>{{ formatDateTime(plan.created_at) }}</dd>
              </div>
              <div>
                <dt>{{ $t('notification_plan.details.record.updated_by') }}</dt>
                <dd>{{ displayValue(plan.updated_by) }}</dd>
              </div>
              <div>
                <dt>{{ $t('notification_plan.details.record.updated_at') }}</dt>
                <dd>{{ formatDateTime(plan.updated_at) }}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <NotificationPlanDialog
          v-model="statusDialogVisible"
          :variant="isActive ? 'deactivate' : 'activate'"
          :loading="statusLoading"
          @confirm="changeStatus"
        />
        <NotificationPlanDialog
          v-model="deleteDialogVisible"
          variant="delete"
          :loading="deleteLoading"
          @confirm="remove"
        />
      </main>
    </template>
  </DataStatusBuilder>
</template>
