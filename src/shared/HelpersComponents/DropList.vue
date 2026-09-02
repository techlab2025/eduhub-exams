<script lang="ts">
  interface DropListPopover {
    toggle(event: Event): void;
    hide(): void;
  }

  let activeDropListPopover: DropListPopover | null = null;
</script>

<script setup lang="ts">
  import { onBeforeUnmount, ref, type Component } from 'vue';
  import Popover from 'primevue/popover';
  import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue';
  import ActionsIcon from '../icons/ActionsIcon.vue';

  interface ActionItem {
    text: string;
    icon: Component;
    link?: string;
    action?: () => void;
    skipDeleteConfirmation?: boolean;
    danger?: boolean;
    toggleValue?: boolean;
  }

  defineEmits(['delete']);
  defineOptions({ inheritAttrs: false });

  const op = ref<DropListPopover | null>(null);

  const toggle = (event: Event) => {
    const currentPopover = op.value;
    if (!currentPopover) return;

    if (activeDropListPopover !== currentPopover) {
      activeDropListPopover?.hide();
      activeDropListPopover = currentPopover;
    }

    currentPopover.toggle(event);
  };

  const handleHide = () => {
    if (activeDropListPopover === op.value) activeDropListPopover = null;
  };

  onBeforeUnmount(handleHide);

  const runAction = (action: ActionItem) => {
    action.action?.();
    op.value?.hide();
  };

  const props = defineProps<{
    actionList: ActionItem[];
    showActions?: boolean;
    deleteDialogTitle?: string;
    deleteDialogMessage?: string;
    variant?: 'default' | 'student' | 'notification-plan';
  }>();
</script>

<template>
  <div class="list-trigger" @click="toggle">
    <slot name="icon">
      <ActionsIcon />
    </slot>
  </div>

  <Popover ref="op" @hide="handleHide">
    <div
      class="list-body"
      :class="{
        'student-list-body': props.variant === 'student',
        'notification-plan-list-body': props.variant === 'notification-plan',
      }"
    >
      <ul class="border-none">
        <li
          v-for="action in props.actionList"
          :key="action.text"
          class="list-item cursor-pointer"
          :class="{ 'list-item-danger': action.danger }"
        >
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <template v-if="props.variant === 'student'">
              <span class="student-action-icon"><component :is="action.icon" /></span>
              <span>{{ action.text }}</span>
            </template>
            <template v-else-if="props.variant === 'notification-plan'">
              <span class="notification-plan-action-icon"><component :is="action.icon" /></span>
              <span>{{ action.text }}</span>
            </template>
            <template v-else>
              <span>{{ action.text }}</span>
              <component :is="action.icon" />
            </template>
          </router-link>

          <button
            v-else-if="
              action.action &&
              (action.text != $t('delete') || action.skipDeleteConfirmation === true)
            "
            class="flex items-center gap-sm"
            @click="runAction(action)"
          >
            <template v-if="props.variant === 'student'">
              <span class="student-action-icon"><component :is="action.icon" /></span>
              <span>{{ action.text }}</span>
            </template>
            <template v-else-if="props.variant === 'notification-plan'">
              <span class="notification-plan-action-icon">
                <component :is="action.icon" />
              </span>
              <span>{{ action.text }}</span>
              <span
                v-if="action.toggleValue !== undefined"
                class="notification-plan-action-toggle"
                :class="{ checked: action.toggleValue }"
                aria-hidden="true"
              >
                <span></span>
              </span>
            </template>
            <template v-else>
              <span>{{ action.text }}</span>
              <component :is="action.icon" />
            </template>
          </button>

          <DeleteDialog
            v-else-if="action.text == $t('delete')"
            hasbtn
            :title="deleteDialogTitle"
            :message="deleteDialogMessage"
            @delete="action.action"
          >
            <template #btn>
              <template v-if="props.variant === 'student'">
                <span class="student-action-icon"><component :is="action.icon" /></span>
                <span>{{ action.text }}</span>
              </template>
              <template v-else-if="props.variant === 'notification-plan'">
                <span class="notification-plan-action-icon"><component :is="action.icon" /></span>
                <span>{{ action.text }}</span>
              </template>
              <template v-else>
                <span>{{ action.text }}</span>
                <component :is="action.icon" />
              </template>
            </template>
          </DeleteDialog>
        </li>
        <slot name="custom"></slot>
      </ul>
    </div>
  </Popover>
</template>

<style scoped lang="scss">
  // .student-list-body {
  //   min-width: 184px;
  //   overflow: hidden;
  //   background: var(--BgWhite);
  //   border: 1px solid var(--input-border-color);
  //   border-radius: 20px;
  //   box-shadow: var(--shadow);

  //   .list-item {
  //     min-width: 0;
  //     min-height: 47px;
  //     margin: 0;
  //     color: var(--title-card-color);
  //     font-family: var(--font-family);
  //     font-size: 15px;
  //     font-weight: 600;

  //     &:not(:last-child) {
  //       border-bottom: 1px solid var(--input-border-color);
  //     }

  //     a,
  //     button {
  //       min-height: 47px;
  //       padding: 12px 16px;
  //       justify-content: flex-start !important;
  //       gap: 10px;
  //     }

  //     &.list-item-danger {
  //       color: var(--danger-alt);
  //     }
  //   }
  // }

  // .student-action-icon {
  //   width: 20px;
  //   height: 20px;
  //   display: grid;
  //   flex: 0 0 20px;
  //   place-items: center;
  //   background: var(--PrimaryColor-alpha-8);
  //   border-radius: 6px;

  //   :deep(svg),
  //   :deep(img) {
  //     width: 14px;
  //     height: 14px;
  //     display: block;
  //   }
  // }

  .list-item-danger .student-action-icon {
    background: var(--danger-light);
  }

  .notification-plan-list-body {
    min-width: 184px;
    overflow: hidden;
    border: 1px solid var(--gray-200);
    border-radius: 14px;
    box-shadow: var(--shadow-lg);

    .list-item {
      min-height: 48px;
      margin: 0;
      color: var(--gray-700);
      font-size: 0.875rem;
      font-weight: 500;

      &:not(:last-child) {
        border-bottom: 1px solid var(--gray-200);
      }

      a,
      button {
        min-height: 48px;
        justify-content: flex-start !important;
        gap: 10px;
        padding: 10px 14px;
      }

      &.list-item-danger {
        color: var(--Red);
      }
    }
  }

  .notification-plan-action-icon {
    width: 20px;
    height: 20px;
    display: grid;
    flex: 0 0 20px;
    place-items: center;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }

  .notification-plan-action-toggle {
    width: 34px;
    height: 18px;
    display: flex;
    align-items: center;
    margin-inline-start: auto;
    padding: 2px;
    background: var(--gray-300);
    border-radius: var(--radius-full);

    > span {
      width: 14px;
      height: 14px;
      background: var(--BgWhite);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-fast);
    }

    &.checked {
      background: var(--PrimaryColor);

      > span {
        transform: translateX(16px);
      }
    }
  }

  :global([dir='rtl']) .notification-plan-action-toggle.checked > span {
    transform: translateX(-16px);
  }
</style>
