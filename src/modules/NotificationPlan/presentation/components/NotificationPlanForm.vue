<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import notificationMessageIcon from '@/assets/icons/notification-message.svg';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import IconArrowDown from '@/shared/icons/IconArrowDown.vue';
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

  interface MessageSegments {
    beforeExecutor: string;
    beforeAction: string;
    beforeFeature: string;
    afterFeature: string;
  }

  const createDefaultMessage = (): MessageSegments => ({
    beforeExecutor: t('notification_plan.form.template_updated'),
    beforeAction: t('notification_plan.form.template_has'),
    beforeFeature: '',
    afterFeature: t('notification_plan.form.template_suffix'),
  });

  const title = ref('');
  const isActive = ref(true);
  const recipientType = ref<0 | 1>(0);
  const selectedEmployees = ref<TitleInterface<number>[]>([]);
  const hierarchyIdsText = ref('');
  const selectedActions = ref<number[]>([]);
  const subActions = ref<Record<number, number | null>>({});
  const expandedFeature = ref<'questions' | 'documents' | null>('questions');
  const expandedSubFeature = ref<string | null>('question-control');
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

  const actionDefinitions = computed(() => [
    {
      value: NotificationPlanActionEnum.COURSE_ASSIGEND,
      label:
        props.plan?.actions.find(
          ({ value }) => value === NotificationPlanActionEnum.COURSE_ASSIGEND,
        )?.label || t('notification_plan.actions.course_assigend'),
      description: t('notification_plan.form.trigger_item_description'),
    },
  ]);

  const subFeatureDefinitions = computed(() => [
    {
      id: 'question-control',
      title: t('notification_plan.form.question_control'),
      number: 1,
      hasActions: true,
    },
    {
      id: 'generate-questions',
      title: t('notification_plan.form.generate_questions'),
      number: 2,
      hasActions: false,
    },
    {
      id: 'question-batches',
      title: t('notification_plan.form.question_batches'),
      number: 3,
      hasActions: false,
    },
  ]);

  const lockedMessageValues = computed(() => [
    props.plan?.actions[0]?.executorName ||
      selectedEmployees.value[0]?.title ||
      t('notification_plan.form.template_executor_value'),
    actionDefinitions.value[0]?.label || t('notification_plan.form.template_action_value'),
    props.plan?.actions[0]?.featureName || t('notification_plan.form.template_feature_value'),
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

  const toggleFeature = (feature: 'questions' | 'documents') => {
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
    selectedActions.value = enabled
      ? Array.from(new Set([...selectedActions.value, action]))
      : selectedActions.value.filter((value) => value !== action);
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

      <section class="notification-plan-feature">
        <button
          class="notification-plan-feature__header"
          type="button"
          :aria-expanded="expandedFeature === 'questions'"
          @click="toggleFeature('questions')"
        >
          <strong>{{ $t('notification_plan.form.trigger_group') }}</strong>
          <span class="notification-plan-feature__chevron" aria-hidden="true">
            <IconArrowDown />
          </span>
        </button>

        <div v-if="expandedFeature === 'questions'" class="notification-plan-feature__content">
          <h3>{{ $t('notification_plan.form.sub_features') }}</h3>

          <article
            v-for="subFeature in subFeatureDefinitions"
            :key="subFeature.id"
            class="notification-plan-action"
          >
            <button
              class="notification-plan-action__header"
              type="button"
              :aria-expanded="expandedSubFeature === subFeature.id"
              @click="toggleSubFeature(subFeature.id)"
            >
              <span class="notification-plan-action__number">{{ subFeature.number }}</span>
              <span class="notification-plan-action__copy">
                <strong>{{ subFeature.title }}</strong>
                <small>{{ $t('notification_plan.form.trigger_item_description') }}</small>
              </span>
              <span class="notification-plan-action__controls">
                <img
                  v-if="expandedSubFeature === subFeature.id && subFeature.hasActions"
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
              <template v-if="subFeature.hasActions">
                <div class="notification-plan-action__choices">
                  <label
                    v-for="action in actionDefinitions"
                    :key="action.value"
                    class="notification-plan-checkbox"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedActions.includes(action.value)"
                      @change="handleActionChange(action.value, $event)"
                    />
                    <span>{{ action.label }}</span>
                  </label>
                </div>

                <div v-if="selectedActions.length" class="notification-plan-template">
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
        </div>
      </section>

      <section class="notification-plan-feature">
        <button
          class="notification-plan-feature__header"
          type="button"
          :aria-expanded="expandedFeature === 'documents'"
          @click="toggleFeature('documents')"
        >
          <strong>{{ $t('notification_plan.form.documents') }}</strong>
          <span class="notification-plan-feature__chevron" aria-hidden="true">
            <IconArrowDown />
          </span>
        </button>
        <div v-if="expandedFeature === 'documents'" class="notification-plan-feature__content">
          <p class="notification-plan-action__empty">
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

<style scoped lang="scss">
  .notification-plan-form {
    display: grid;
    gap: 24px;
    color: var(--gray-900);

    &.is-loading {
      pointer-events: none;
      opacity: 0.65;
    }
  }

  .notification-plan-form__intro {
    display: grid;
    gap: 4px;

    h1,
    p {
      margin: 0;
    }

    h1 {
      font-family: 'Bold';
      font-weight: 700;
      font-size: 24px;
    }

    p {
      color: var(--gray-600);
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 700;
    }
  }

  .notification-plan-card {
    display: grid;
    gap: 18px;
    padding: 18px;
    background: var(--background-color-soft-light);
    border: 1px solid var(--gray-300);
    border-radius: 24px;

    label {
      font-family: var(--font-family);
    }
  }

  .notification-plan-card--details {
    gap: 20px;
  }

  .notification-plan-field {
    display: grid;
    gap: 10px;
    color: var(--gray-800);
    font-size: 0.875rem;
    font-weight: 600;

    b {
      color: var(--Red);
    }

    > input {
      width: 100%;
      min-height: 52px;
      padding-inline: 18px;
      color: var(--gray-900);
      background: var(--BgWhite);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-full);
      outline: none;
      transition: var(--transition-fast);

      &:focus {
        border-color: var(--PrimaryColor);
        box-shadow: 0 0 0 3px var(--PrimaryColor-light);
      }

      &::placeholder {
        color: var(--gray-400);
      }
    }
  }

  .notification-plan-field--recipients {
    :deep(.p-multiselect) {
      min-height: 52px;
      border-color: var(--gray-200) !important;
      border-radius: var(--radius-full) !important;
    }

    :deep(.p-multiselect-label) {
      min-height: 50px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px !important;
    }
  }

  .notification-plan-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    h2 {
      margin: 0;
      font-weight: 700;
      font-family: 'bold';
      font-size: 18px;

      b {
        color: var(--Red);
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  .notification-plan-reset {
    padding: 0;
    color: var(--Red);
    background: transparent;
    border: 0;
    font-size: 0.75rem;
    text-decoration: underline;
    cursor: pointer;
  }

  .notification-plan-feature {
    overflow: hidden;
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 16px;
  }

  .notification-plan-feature__header {
    width: 100%;
    min-height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    color: var(--gray-900);
    text-align: start;
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--gray-200);
    cursor: pointer;

    svg {
      color: var(--gray-500);
    }
  }

  .notification-plan-feature__chevron {
    display: flex;
    transition: var(--transition-fast);
  }

  .notification-plan-feature__header[aria-expanded='true'] .notification-plan-feature__chevron {
    transform: rotate(180deg);
  }

  .notification-plan-feature__content {
    display: grid;
    gap: 12px;
    padding: 14px;

    h3 {
      margin: 0;
      color: var(--PrimaryColor);
      font-size: 0.875rem;
      font-weight: 700;
    }
  }

  .notification-plan-action {
    overflow: hidden;
    background: var(--BgWhite);
    border: 1px solid var(--gray-100);
    border-radius: 14px;
  }

  .notification-plan-action__header {
    width: 100%;
    min-height: 68px;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    padding: 12px;
    color: inherit;
    text-align: start;
    background: transparent;
    border: 0;
    cursor: pointer;
  }

  .notification-plan-action__number {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    color: var(--PrimaryColor);
    background: var(--success-green-light-std);
    border-radius: 8px;
    font-weight: 700;
  }

  .notification-plan-action__copy {
    min-width: 0;
    display: grid;
    gap: 3px;

    small {
      color: var(--gray-500);
      font-size: 0.75rem;
      font-weight: 400;
    }
  }

  .notification-plan-action__chevron {
    display: flex;
    transition: var(--transition-fast);
  }

  .notification-plan-action__controls {
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      flex: 0 0 43px;
    }
  }

  .notification-plan-action__header[aria-expanded='true'] .notification-plan-action__chevron {
    transform: rotate(180deg);
  }

  .notification-plan-action__body {
    display: grid;
    gap: 14px;
    padding: 0 12px 12px;
  }

  .notification-plan-action__choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .notification-plan-checkbox {
    min-height: 46px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    cursor: pointer;

    input {
      width: 16px;
      height: 16px;
      margin: 0;
      accent-color: var(--PrimaryColor);
    }
  }

  .notification-plan-template {
    display: grid;
    gap: 10px;
    padding: 16px;
    background: var(--success-green-light-std);
    border-radius: 14px;

    small,
    .notification-plan-template__label {
      color: var(--gray-500);
      font-size: 0.75rem;
    }
  }

  .notification-plan-template__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;

    > span {
      display: grid;
      gap: 4px;
    }
  }

  .notification-plan-template__edit,
  .notification-plan-template__save {
    min-width: 142px;
    min-height: 38px;
    padding-inline: 18px;
    color: var(--PrimaryColor);
    background: var(--BgWhite);
    border: 1px solid var(--PrimaryColor);
    border-radius: var(--radius-full);
    font-weight: 600;
    cursor: pointer;
  }

  .notification-plan-template__label {
    margin-top: 8px;
    font-weight: 600;
  }

  .notification-plan-template__display {
    min-height: 52px;
    display: flex;
    align-items: center;
    padding: 12px;
    color: var(--gray-900);
    background: var(--BgWhite);
    border: 1px solid var(--gray-200);
    border-radius: 10px;
    font-size: 0.8rem;
  }

  .notification-plan-template__editor {
    min-height: 64px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;
    padding: 10px;
    background: var(--BgWhite);
    border: 1px solid var(--gray-200);
    border-radius: 10px;

    input {
      min-width: 88px;
      min-height: 34px;
      flex: 1 1 105px;
      padding: 6px 8px;
      color: var(--gray-900);
      background: transparent;
      border: 1px dashed var(--gray-300);
      border-radius: 6px;
      outline: none;

      &:focus {
        border-color: var(--PrimaryColor);
        box-shadow: 0 0 0 2px var(--PrimaryColor-alpha-12);
      }
    }

    .notification-plan-template__short-input {
      min-width: 54px;
      flex-basis: 54px;
    }

    .notification-plan-template__suffix-input {
      min-width: 210px;
      flex-grow: 3;
    }
  }

  .notification-plan-template__token {
    min-height: 34px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 7px;
    color: var(--PrimaryColor);
    background: var(--success-green-light-std);
    border: 1px solid var(--PrimaryColor);
    border-radius: 5px;
    white-space: nowrap;
    user-select: none;
  }

  .notification-plan-template__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 4px;
  }

  .notification-plan-template__cancel {
    min-width: 142px;
    min-height: 38px;
    padding-inline: 18px;
    color: var(--gray-900);
    background: var(--BgWhite);
    border: 1px solid transparent;
    border-radius: var(--radius-full);
    font-weight: 600;
    cursor: pointer;
  }

  .notification-plan-action__empty {
    margin: 0;
    padding: 12px;
    color: var(--gray-500);
    text-align: center;
    background: var(--BgWhite);
    border-radius: 10px;
    font-size: 0.8rem;
  }

  .notification-plan-state {
    gap: 16px;
  }

  .notification-plan-state__options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .notification-plan-radio-card {
    min-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    cursor: pointer;
    transition: var(--transition-fast);

    &.selected {
      border-color: var(--PrimaryColor);
    }

    > span {
      display: grid;
      gap: 3px;
    }

    small {
      color: var(--gray-400);
      font-size: 0.75rem;
      font-weight: 400;
    }

    input {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--PrimaryColor);
    }
  }

  @media (max-width: 768px) {
    .notification-plan-form {
      gap: 16px;
    }

    .notification-plan-card {
      padding: 14px;
      border-radius: 18px;
    }

    .notification-plan-state__options {
      grid-template-columns: 1fr;
    }

    .notification-plan-action__choices {
      grid-template-columns: 1fr;
    }

    .notification-plan-action__header {
      grid-template-columns: 36px minmax(0, 1fr) auto;
    }

    .notification-plan-action__number {
      width: 36px;
      height: 36px;
    }

    .notification-plan-template__header {
      align-items: stretch;
      flex-direction: column;
    }

    .notification-plan-template__edit,
    .notification-plan-template__actions button {
      width: 100%;
    }

    .notification-plan-template__actions {
      flex-direction: column;
    }
  }
</style>
