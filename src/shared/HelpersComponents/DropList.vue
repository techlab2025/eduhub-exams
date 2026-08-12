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

  const props = defineProps<{
    actionList: ActionItem[];
    showActions?: boolean;
    deleteDialogTitle?: string;
    deleteDialogMessage?: string;
    variant?: 'default' | 'student';
  }>();
</script>

<template>
  <div class="list-trigger" @click="toggle">
    <slot name="icon">
      <ActionsIcon />
    </slot>
  </div>

  <Popover ref="op" @hide="handleHide">
    <div class="list-body" :class="{ 'student-list-body': props.variant === 'student' }">
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
            @click="action.action"
          >
            <template v-if="props.variant === 'student'">
              <span class="student-action-icon"><component :is="action.icon" /></span>
              <span>{{ action.text }}</span>
            </template>
            <template v-else>
              <span>{{ action.text }}</span>
              <component :is="action.icon" />
            </template>
          </button>

          <DeleteDialog
            v-else-if="action.text == $t('delete')"
            :title="deleteDialogTitle"
            :message="deleteDialogMessage"
            @delete="action.action"
          />
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
</style>
