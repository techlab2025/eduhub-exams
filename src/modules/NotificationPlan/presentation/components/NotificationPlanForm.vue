<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import ToggleSwitch from 'primevue/toggleswitch';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import EmployeeController from '@/modules/employee/presentation/controllers/employee.controller';
  import IndexEmployeeParams from '@/modules/employee/core/params/index.employee.params';
  import { NotificationPlanActionEnum } from '../../core/enums/notification.plan.action.enum';
  import type NotificationPlanModel from '../../core/models/notification.plan.model';
  import AddNotificationPlanParams from '../../core/params/add.notification.plan.params';
  import EditNotificationPlanParams from '../../core/params/edit.notification.plan.params';

  const props = defineProps<{ plan?: NotificationPlanModel; loading?: boolean }>();
  const emit = defineEmits<{
    updateData: [value: AddNotificationPlanParams | EditNotificationPlanParams];
  }>();
  const { t } = useI18n();

  const title = ref('');
  const isActive = ref(true);
  const recipientType = ref<0 | 1>(0);
  const selectedEmployees = ref<TitleInterface<number>[]>([]);
  const hierarchyIdsText = ref('');
  const selectedActions = ref<number[]>([]);
  const subActions = ref<Record<number, number | null>>({});

  const employeeController = EmployeeController.getInstance();
  const employeeParams = new IndexEmployeeParams({
    word: '',
    pageNumber: 1,
    perPage: 100,
    withPage: 0,
    status: null,
  });

  const actionDefinitions = computed(() => [
    {
      value: NotificationPlanActionEnum.COURSE_ASSIGEND,
      label: t('notification_plan.actions.course_assigend'),
    },
  ]);

  const hierarchyIds = computed(() =>
    hierarchyIdsText.value
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value > 0),
  );

  const getSubActionValue = (value: unknown): number | null => {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object') {
      const map = value as Record<string, unknown>;
      const id = Number(map.value ?? map.id);
      return Number.isFinite(id) ? id : null;
    }
    return null;
  };

  const toggleAction = (action: number, enabled: boolean) => {
    selectedActions.value = enabled
      ? Array.from(new Set([...selectedActions.value, action]))
      : selectedActions.value.filter((value) => value !== action);
    if (!enabled) subActions.value[action] = null;
    updateData();
  };

  const updateData = () => {
    const values = selectedActions.value.map((action) => ({
      action,
      sub_action: subActions.value[action] ?? null,
    }));
    const employeeIds =
      recipientType.value === 0 ? selectedEmployees.value.map(({ id }) => id) : [];
    const positionIds = recipientType.value === 1 ? hierarchyIds.value : [];

    emit(
      'updateData',
      props.plan
        ? new EditNotificationPlanParams(
            props.plan.id,
            title.value.trim(),
            values,
            employeeIds,
            positionIds,
            isActive.value,
            recipientType.value,
          )
        : new AddNotificationPlanParams(
            title.value.trim(),
            values,
            employeeIds,
            positionIds,
            isActive.value,
            recipientType.value,
          ),
    );
  };

  const validate = () =>
    Boolean(
      title.value.trim() &&
      selectedActions.value.length &&
      (recipientType.value === 0 ? selectedEmployees.value.length : hierarchyIds.value.length),
    );
  defineExpose({ validate });

  watch(
    () => props.plan,
    (plan) => {
      if (!plan) return;
      title.value = plan.title;
      isActive.value = plan.isActive;
      recipientType.value = plan.heirarchy;
      selectedEmployees.value = plan.employees.map(
        (employee) => new TitleInterface({ id: employee.id, title: employee.title }),
      );
      hierarchyIdsText.value = plan.hierarchies.map(({ id }) => id).join(', ');
      selectedActions.value = plan.actions.map(({ value }) => value);
      subActions.value = Object.fromEntries(
        plan.actions.map((action) => [action.value, getSubActionValue(action.subAction)]),
      );
    },
    { immediate: true },
  );

  watch([title, isActive, recipientType, selectedEmployees, hierarchyIdsText], updateData, {
    deep: true,
    immediate: true,
  });
</script>

<template>
  <form class="notification-plan-form" :class="{ 'is-loading': loading }" @submit.prevent>
    <div class="notification-plan-form__top-row">
      <label class="notification-plan-field">
        <span>{{ $t('notification_plan.form.title') }}</span>
        <input
          v-model="title"
          type="text"
          :placeholder="$t('notification_plan.form.title_placeholder')"
        />
      </label>
      <label class="notification-plan-status">
        <ToggleSwitch v-model="isActive" :aria-label="$t('notification_plan.form.active')" />
        <span>{{ $t('notification_plan.form.active') }}</span>
      </label>
    </div>

    <section class="notification-plan-section">
      <h2><span aria-hidden="true">*</span> {{ $t('notification_plan.form.actions') }}</h2>
      <div class="notification-plan-actions">
        <div
          v-for="action in actionDefinitions"
          :key="action.value"
          class="notification-plan-action"
        >
          <div class="notification-plan-action__toggle">
            <ToggleSwitch
              :model-value="selectedActions.includes(action.value)"
              :aria-label="action.label"
              @update:model-value="toggleAction(action.value, $event)"
            />
            <span>{{ action.label }}</span>
          </div>
          <!-- <UpdatedCustomInputSelect
            :model-value="subActionOptions.find((option) => option.id === subActions[action.value])"
            :static-options="subActionOptions"
            :placeholder="$t('notification_plan.form.select_sub_action')"
            :reload="false"
            @update:model-value="setSubAction(action.value, $event as TitleInterface<number>)"
          /> -->
        </div>
      </div>
    </section>

    <section class="notification-plan-section notification-plan-recipients">
      <div class="notification-plan-section__heading">
        <div>
          <h2>
            <span aria-hidden="true">*</span> {{ $t('notification_plan.form.choose_recipients') }}
          </h2>
          <p>{{ $t('notification_plan.form.choose_recipients_description') }}</p>
        </div>
        <span class="notification-plan-section__badge">{{
          $t('notification_plan.form.assignment_type')
        }}</span>
      </div>

      <!-- <div class="recipient-types">
        <label :class="{ selected: recipientType === 1 }">
          <input v-model="recipientType" type="radio" :value="1" />
          <strong>{{ $t('notification_plan.form.positions') }}</strong>
          <small>{{ $t('notification_plan.form.positions_description') }}</small>
        </label>
        <label :class="{ selected: recipientType === 0 }">
          <input v-model="recipientType" type="radio" :value="0" />
          <strong>{{ $t('notification_plan.form.employees') }}</strong>
          <small>{{ $t('notification_plan.form.employees_description') }}</small>
        </label>
      </div> -->

      <UpdatedCustomInputSelect
        v-model="selectedEmployees"
        :label="$t('notification_plan.form.employees')"
        :controller="employeeController as any"
        :params="employeeParams"
        :placeholder="$t('notification_plan.form.select_employees')"
        :type="2"
      />
    </section>
  </form>
</template>

<style scoped lang="scss">
  .notification-plan-form {
    display: grid;
    gap: var(--xl-size-base);

    &.is-loading {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  .notification-plan-form__top-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
    gap: var(--xl-size-base);
  }

  .notification-plan-field {
    display: grid;
    gap: var(--xs-size);

    input {
      min-height: 48px;
      padding-inline: var(--xl-size-base);
      background: var(--bg-main);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-full);
    }
  }

  .notification-plan-status {
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: var(--xs-size);
    align-self: end;
    padding-inline: var(--xl-size-base);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-full);
  }

  .notification-plan-section {
    display: grid;
    gap: var(--xl-size-base);
    padding: var(--xl-size-base);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);

    h2 {
      margin: 0;
      font-size: 1rem;

      span {
        color: var(--danger-color);
      }
    }
  }

  .notification-plan-actions {
    display: grid;
    gap: var(--xs-size);
  }

  .notification-plan-action {
    min-height: 48px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(220px, 0.35fr);
    gap: var(--xl-size-base);
    align-items: center;
    padding: var(--xs-size) var(--xl-size-base);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
  }

  .notification-plan-action__toggle {
    display: flex;
    align-items: center;
    gap: var(--xs-size);
  }

  .notification-plan-section__heading {
    display: flex;
    justify-content: space-between;
    gap: var(--xl-size-base);

    p {
      margin-block: var(--xs-size) 0;
      color: var(--text-secondary);
    }
  }

  .notification-plan-section__badge {
    align-self: start;
    padding: 6px 10px;
    background: var(--color-light-gray);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
  }

  .recipient-types {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--xs-size);

    label {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px var(--xs-size);
      padding: var(--xl-size-base);
      border: 1px solid var(--border-weak);
      border-radius: var(--radius-md);
      cursor: pointer;

      &.selected {
        background: var(--color-light-gray);
      }

      input {
        grid-row: 1 / 3;
      }

      small {
        color: var(--text-secondary);
      }
    }
  }

  @media (max-width: 768px) {
    .notification-plan-form__top-row,
    .recipient-types,
    .notification-plan-action {
      grid-template-columns: 1fr;
    }
  }
</style>
