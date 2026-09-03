<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import notificationMessageIcon from '@/assets/icons/notification-message.svg';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import IconArrowDown from '@/shared/icons/IconArrowDown.vue';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import EmployeeController from '@/modules/employee/presentation/controllers/employee.controller';
  import IndexEmployeeParams from '@/modules/employee/core/params/index.employee.params';
  import {
    NotificationPlanActions,
    type NotificationPlanActionDefinition,
  } from '../../core/constants/NotificationPlanActions';
  import type NotificationPlanModel from '../../core/models/notification.plan.model';
  import AddNotificationPlanParams from '../../core/params/add.notification.plan.params';
  import EditNotificationPlanParams from '../../core/params/edit.notification.plan.params';

  const props = defineProps<{ plan?: NotificationPlanModel; loading?: boolean }>();
  const emit = defineEmits<{
    updateData: [value: AddNotificationPlanParams | EditNotificationPlanParams];
  }>();
  const { t } = useI18n();

  interface MessageSegments {
    beforeExecutor: string;
    beforeAction: string;
    beforeFeature: string;
    afterFeature: string;
  }

  const firstSubFeature = NotificationPlanActions.flatMap(({ sub_feature }) => sub_feature)[0];
  const defaultMessageKey = firstSubFeature?.message ?? 'notification_plan.form.template_suffix';

  const createDefaultMessage = (messageKey = defaultMessageKey): MessageSegments => ({
    beforeExecutor: t('notification_plan.form.template_updated'),
    beforeAction: t('notification_plan.form.template_has'),
    beforeFeature: '',
    afterFeature: t(messageKey),
  });

  const title = ref('');
  const isActive = ref(true);
  const recipientType = ref<0 | 1>(0);
  const selectedEmployees = ref<TitleInterface<number>[]>([]);
  const hierarchyIdsText = ref('');
  const selectedActions = ref<number[]>([]);
  const subActions = ref<Record<number, number | null>>({});
  const expandedFeature = ref<string | null>(NotificationPlanActions[0]?.id ?? null);
  const expandedSubFeature = ref<string | null>(firstSubFeature?.id ?? null);
  const editingMessage = ref(false);
  const savedMessage = ref<MessageSegments>(createDefaultMessage());
  const draftMessage = ref<MessageSegments>(createDefaultMessage());
  const returnedMessage = ref('');

  const employeeController = EmployeeController.getInstance();
  const employeeParams = new IndexEmployeeParams({
    word: '',
    pageNumber: 1,
    perPage: 100,
    withPage: 0,
    status: null,
  });

  const actionContexts = NotificationPlanActions.flatMap((feature) =>
    feature.sub_feature.flatMap((subFeature) =>
      subFeature.actions.map((action) => ({ action, feature, subFeature })),
    ),
  );

  const selectedActionContext = computed(() => {
    const selectedAction = selectedActions.value[0] ?? props.plan?.actions[0]?.value;
    return actionContexts.find(({ action }) => action.action_id === selectedAction);
  });

  const selectedPlanAction = computed(() => {
    const selectedAction = selectedActions.value[0] ?? props.plan?.actions[0]?.value;
    return props.plan?.actions.find(({ value }) => value === selectedAction);
  });

  const getActionLabel = (action: NotificationPlanActionDefinition) =>
    props.plan?.actions.find(({ value }) => value === action.action_id)?.label ||
    t(action.action_title);

  const hasSelectedActions = (actions: readonly NotificationPlanActionDefinition[]) =>
    actions.some(({ action_id }) => selectedActions.value.includes(action_id));

  const lockedMessageValues = computed(() => [
    selectedPlanAction.value?.executorName ||
      selectedEmployees.value[0]?.title ||
      t('notification_plan.form.template_executor_value'),
    selectedPlanAction.value?.label ||
      (selectedActionContext.value
        ? t(selectedActionContext.value.action.action_title)
        : t('notification_plan.form.template_action_value')),
    selectedPlanAction.value?.featureName ||
      (selectedActionContext.value
        ? t(selectedActionContext.value.feature.feature_title)
        : t('notification_plan.form.template_feature_value')),
  ]);

  const composeMessage = (segments: MessageSegments) =>
    [
      segments.beforeExecutor,
      lockedMessageValues.value[0],
      segments.beforeAction,
      lockedMessageValues.value[1],
      segments.beforeFeature,
      lockedMessageValues.value[2],
      segments.afterFeature,
    ]
      .map((part) => part?.trim() ?? '')
      .filter(Boolean)
      .join(' ');

  const displayedMessage = computed(
    () => returnedMessage.value || composeMessage(savedMessage.value),
  );

  const parseReturnedMessage = (message: string): MessageSegments | null => {
    let remainder = message;
    const editableSegments: string[] = [];

    for (const lockedValue of lockedMessageValues.value) {
      const index = remainder.toLocaleLowerCase().indexOf(lockedValue.toLocaleLowerCase());
      if (index < 0) return null;
      editableSegments.push(remainder.slice(0, index).trim());
      remainder = remainder.slice(index + lockedValue.length);
    }

    return {
      beforeExecutor: editableSegments[0] ?? '',
      beforeAction: editableSegments[1] ?? '',
      beforeFeature: editableSegments[2] ?? '',
      afterFeature: remainder.trim(),
    };
  };

  const toggleFeature = (feature: string) => {
    expandedFeature.value = expandedFeature.value === feature ? null : feature;
  };

  const toggleSubFeature = (subFeature: string) => {
    expandedSubFeature.value = expandedSubFeature.value === subFeature ? null : subFeature;
  };

  const startEditingMessage = () => {
    draftMessage.value = parseReturnedMessage(returnedMessage.value) ?? { ...savedMessage.value };
    editingMessage.value = true;
  };

  const saveMessage = () => {
    savedMessage.value = { ...draftMessage.value };
    returnedMessage.value = '';
    editingMessage.value = false;
  };

  const cancelMessageEdit = () => {
    editingMessage.value = false;
  };

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

  const toggleAction = (action: number, enabled: boolean) => {
    const hadSelectedActions = selectedActions.value.length > 0;
    selectedActions.value = enabled
      ? Array.from(new Set([...selectedActions.value, action]))
      : selectedActions.value.filter((value) => value !== action);
    if (enabled && !hadSelectedActions) {
      const messageKey = actionContexts.find(
        ({ action: definition }) => definition.action_id === action,
      )?.subFeature.message;
      savedMessage.value = createDefaultMessage(messageKey);
      draftMessage.value = { ...savedMessage.value };
      returnedMessage.value = '';
    }
    if (!enabled) subActions.value[action] = null;
    if (!enabled) editingMessage.value = false;
    updateData();
  };

  const handleActionChange = (action: number, event: Event) => {
    toggleAction(action, (event.target as HTMLInputElement).checked);
  };

  const resetTriggers = () => {
    selectedActions.value = [];
    subActions.value = {};
    editingMessage.value = false;
    savedMessage.value = createDefaultMessage();
    draftMessage.value = { ...savedMessage.value };
    returnedMessage.value = '';
    updateData();
  };

  const resetStatus = () => {
    isActive.value = true;
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
      returnedMessage.value = plan.actions[0]?.displayedMessage ?? '';
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
    <header class="notification-plan-form__intro">
      <h1>
        {{
          $t(plan ? 'notification_plan.form.edit_heading' : 'notification_plan.form.create_heading')
        }}
      </h1>
      <p>{{ $t('notification_plan.form.description') }}</p>
    </header>

    <section class="notification-plan-card notification-plan-card--details">
      <label class="notification-plan-field">
        <span>{{ $t('notification_plan.form.title') }} <b aria-hidden="true">*</b></span>
        <input
          v-model="title"
          type="text"
          required
          :placeholder="$t('notification_plan.form.title_placeholder')"
        />
      </label>

      <div
        class="notification-plan-field notification-plan-field--recipients"
        role="group"
        aria-labelledby="notification-plan-recipients-label"
      >
        <label id="notification-plan-recipients-label">
          {{ $t('notification_plan.form.recipients') }} <b aria-hidden="true">*</b>
        </label>
        <UpdatedCustomInputSelect
          id="notification-plan-recipients"
          v-model="selectedEmployees"
          :controller="employeeController as any"
          :params="employeeParams"
          :placeholder="$t('notification_plan.form.select_employees')"
          :type="2"
          :reload="false"
          :has-header="true"
          required
        />
      </div>
    </section>

    <section class="notification-plan-card notification-plan-triggers">
      <header class="notification-plan-card__header">
        <h2>{{ $t('notification_plan.form.configure_triggers') }}</h2>
        <button class="notification-plan-reset" type="button" @click="resetTriggers">
          {{ $t('notification_plan.form.reset') }}
        </button>
      </header>

      <section
        v-for="feature in NotificationPlanActions"
        :key="feature.id"
        class="notification-plan-feature"
      >
        <button
          class="notification-plan-feature__header"
          type="button"
          :aria-expanded="expandedFeature === feature.id"
          @click="toggleFeature(feature.id)"
        >
          <strong>{{ $t(feature.feature_title) }}</strong>
          <span class="notification-plan-feature__chevron" aria-hidden="true">
            <IconArrowDown />
          </span>
        </button>

        <div v-if="expandedFeature === feature.id" class="notification-plan-feature__content">
          <h3 v-if="feature.sub_feature.length">
            {{ $t('notification_plan.form.sub_features', { feature: $t(feature.feature_title) }) }}
          </h3>

          <article
            v-for="(subFeature, subFeatureIndex) in feature.sub_feature"
            :key="subFeature.id"
            class="notification-plan-action"
          >
            <button
              class="notification-plan-action__header"
              type="button"
              :aria-expanded="expandedSubFeature === subFeature.id"
              @click="toggleSubFeature(subFeature.id)"
            >
              <span class="notification-plan-action__number">{{ subFeatureIndex + 1 }}</span>
              <span class="notification-plan-action__copy">
                <strong>{{ $t(subFeature.sub_feature_title) }}</strong>
                <small>{{ $t(subFeature.sub_feature_description) }}</small>
              </span>
              <span class="notification-plan-action__controls">
                <img
                  v-if="expandedSubFeature === subFeature.id && subFeature.actions.length"
                  :src="notificationMessageIcon"
                  alt=""
                  width="43"
                  height="43"
                />
                <span class="notification-plan-action__chevron" aria-hidden="true">
                  <IconArrowDown />
                </span>
              </span>
            </button>

            <div v-if="expandedSubFeature === subFeature.id" class="notification-plan-action__body">
              <template v-if="subFeature.actions.length">
                <div class="notification-plan-action__choices">
                  <label
                    v-for="action in subFeature.actions"
                    :key="action.action_id"
                    class="notification-plan-checkbox"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedActions.includes(action.action_id)"
                      @change="handleActionChange(action.action_id, $event)"
                    />
                    <span>{{ getActionLabel(action) }}</span>
                  </label>
                </div>

                <div
                  v-if="hasSelectedActions(subFeature.actions)"
                  class="notification-plan-template"
                >
                  <header class="notification-plan-template__header">
                    <span>
                      <strong>{{ $t('notification_plan.form.message_template') }}</strong>
                      <small>{{ $t('notification_plan.form.message_template_description') }}</small>
                    </span>
                    <button
                      v-if="!editingMessage"
                      class="notification-plan-template__edit"
                      type="button"
                      @click="startEditingMessage"
                    >
                      {{ $t('notification_plan.form.edit_message') }}
                    </button>
                  </header>

                  <template v-if="!editingMessage">
                    <span class="notification-plan-template__label">
                      {{ $t('notification_plan.form.displayed_message') }}
                    </span>
                    <div class="notification-plan-template__display">
                      {{ displayedMessage }}
                    </div>
                  </template>

                  <template v-else>
                    <span class="notification-plan-template__label">
                      {{ $t('notification_plan.form.message_template_label') }}
                    </span>
                    <div class="notification-plan-template__editor">
                      <input
                        v-model="draftMessage.beforeExecutor"
                        type="text"
                        :aria-label="$t('notification_plan.form.edit_text_before_executor')"
                      />
                      <span
                        class="notification-plan-template__token"
                        :title="$t('notification_plan.form.locked_system_value')"
                      >
                        <svg
                          aria-hidden="true"
                          width="13"
                          height="13"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" />
                          <path
                            d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                            stroke="currentColor"
                            stroke-linecap="round"
                          />
                        </svg>
                        {{ $t('notification_plan.form.template_executor') }}
                      </span>
                      <input
                        v-model="draftMessage.beforeAction"
                        type="text"
                        :aria-label="$t('notification_plan.form.edit_text_before_action')"
                      />
                      <span
                        class="notification-plan-template__token"
                        :title="$t('notification_plan.form.locked_system_value')"
                      >
                        {{ $t('notification_plan.form.template_action') }}
                      </span>
                      <input
                        v-model="draftMessage.beforeFeature"
                        class="notification-plan-template__short-input"
                        type="text"
                        :aria-label="$t('notification_plan.form.edit_text_before_feature')"
                      />
                      <span
                        class="notification-plan-template__token"
                        :title="$t('notification_plan.form.locked_system_value')"
                      >
                        {{ $t('notification_plan.form.template_feature') }}
                      </span>
                      <input
                        v-model="draftMessage.afterFeature"
                        class="notification-plan-template__suffix-input"
                        type="text"
                        :aria-label="$t('notification_plan.form.edit_text_after_feature')"
                      />
                    </div>
                    <footer class="notification-plan-template__actions">
                      <button
                        class="notification-plan-template__save"
                        type="button"
                        @click="saveMessage"
                      >
                        {{ $t('notification_plan.form.save_message') }}
                      </button>
                      <button
                        class="notification-plan-template__cancel"
                        type="button"
                        @click="cancelMessageEdit"
                      >
                        {{ $t('notification_plan.form.cancel') }}
                      </button>
                    </footer>
                  </template>
                </div>
              </template>

              <p v-else class="notification-plan-action__empty">
                {{ $t('notification_plan.form.no_actions_configured') }}
              </p>
            </div>
          </article>

          <p v-if="!feature.sub_feature.length" class="notification-plan-action__empty">
            {{ $t('notification_plan.form.no_actions_configured') }}
          </p>
        </div>
      </section>
    </section>

    <section class="notification-plan-card notification-plan-state">
      <header class="notification-plan-card__header">
        <h2>{{ $t('notification_plan.form.plan_status') }} <b aria-hidden="true">*</b></h2>
        <button class="notification-plan-reset" type="button" @click="resetStatus">
          {{ $t('notification_plan.form.reset') }}
        </button>
      </header>

      <div
        class="notification-plan-state__options"
        role="radiogroup"
        :aria-label="$t('notification_plan.form.plan_status')"
      >
        <label :class="{ selected: isActive }" class="notification-plan-radio-card">
          <span>
            <strong>{{ $t('notification_plan.active') }}</strong>
            <small>{{ $t('notification_plan.form.active_description') }}</small>
          </span>
          <input v-model="isActive" type="radio" :value="true" />
        </label>
        <label :class="{ selected: !isActive }" class="notification-plan-radio-card">
          <span>
            <strong>{{ $t('notification_plan.inactive') }}</strong>
            <small>{{ $t('notification_plan.form.inactive_description') }}</small>
          </span>
          <input v-model="isActive" type="radio" :value="false" />
        </label>
      </div>
    </section>
  </form>
</template>
