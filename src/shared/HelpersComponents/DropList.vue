<script setup lang="ts">
  import { ref, defineProps, watch, computed } from 'vue';
  import Popover from 'primevue/popover';
  import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue';
  import ActionsIcon from '../icons/ActionsIcon.vue';
  import PermissionHandler from '@/base/Presentation/Utils/permission_handler';
  import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';

  interface ActionItem {
    text: string;
    icon: any;
    link?: string;
    action?: () => void;
    permission?: PermissionsEnum[];
  }

  const emit = defineEmits(['delete']);
  defineOptions({ inheritAttrs: false });

  const op = ref();
  const ActionIconsToggle = ref(false);

  const toggle = (event: Event) => {
    op.value.toggle(event);
  };

  const { actionList = [], showActions = true } = defineProps<{
    actionList: ActionItem[];
    showActions?: boolean;
  }>();

  // ✅ Filter actions by permission
  const permittedActions = computed(() =>
    showActions
      ? actionList.filter((a) =>
          a.permission ? PermissionHandler.Instance.handle(a.permission) : true,
        )
      : [],
  );

  watch(ActionIconsToggle, (newVal) => {
    ActionIconsToggle.value = newVal;
  });
</script>

<template>
  <div class="list-trigger" @click="toggle">
    <ActionsIcon />
  </div>

  <Popover ref="op">
    <div class="list-body">
      <ul class="border-none">
        <li v-for="action in permittedActions" :key="action.text" class="list-item cursor-pointer">
          <router-link v-if="action.link" :to="action.link" class="flex items-center gap-[5px]">
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </router-link>

          <button
            v-else-if="action.action && action.text != $t('delete')"
            class="flex items-center gap-sm"
            @click="action.action"
          >
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </button>

          <DeleteDialog v-else-if="action.text == $t('delete')" @delete="action.action" />
        </li>
        <slot name="custom"></slot>
      </ul>
    </div>
  </Popover>
</template>

<style scoped></style>
