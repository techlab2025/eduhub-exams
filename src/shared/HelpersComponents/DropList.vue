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
  }>();
</script>

<template>
  <div class="list-trigger" @click="toggle">
    <slot name="icon">
      <ActionsIcon />
    </slot>
  </div>

  <Popover ref="op" @hide="handleHide">
    <div class="list-body">
      <ul class="border-none">
        <li v-for="action in props.actionList" :key="action.text" class="list-item cursor-pointer">
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <span>{{ action.text }}</span>
            <component :is="action.icon" />
          </router-link>

          <button
            v-else-if="action.action && action.text != $t('delete')"
            class="flex items-center gap-sm"
            @click="action.action"
          >
            <span>{{ action.text }}</span>
            <component :is="action.icon" />
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

<style scoped></style>
