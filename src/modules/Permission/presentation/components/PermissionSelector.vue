<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { createAdminPermissions } from '../../core/constants/admin.permissions';
  import type {
    PermissionActionItem,
    PermissionGroupItem,
    PermissionModuleItem,
  } from '../../core/models/permission.item';
  import type { PermissionCode } from '../../core/enums/permissions.enum';

  const props = withDefaults(
    defineProps<{
      permissions?: string[];
      disabled?: boolean;
    }>(),
    { permissions: () => [], disabled: false },
  );

  const emit = defineEmits<{
    'update:permissions': [value: PermissionCode[]];
  }>();

  const permissionModules = ref(createAdminPermissions());

  const getSelectedPermissions = (): PermissionCode[] =>
    permissionModules.value.flatMap((module) =>
      module.permissions.flatMap((group) => [
        ...(group.checked ? [group.code] : []),
        ...group.permissions.filter(({ checked }) => checked).map(({ code }) => code),
      ]),
    );

  const emitSelection = () => emit('update:permissions', getSelectedPermissions());

  const applyCheckedPermissions = (permissions: string[]) => {
    const selectedCodes = new Set(permissions);
    permissionModules.value.forEach((module) => {
      module.permissions.forEach((group) => {
        group.checked = selectedCodes.has(group.code);
        group.permissions.forEach((permission) => {
          permission.checked = selectedCodes.has(permission.code);
        });
      });
    });
  };

  watch(() => props.permissions, applyCheckedPermissions, { immediate: true });

  const isModuleFullyChecked = (module: PermissionModuleItem) =>
    module.permissions.every(
      (group) => group.checked && group.permissions.every(({ checked }) => checked),
    );

  const isModulePartiallyChecked = (module: PermissionModuleItem) =>
    module.permissions.some(
      (group) => group.checked || group.permissions.some(({ checked }) => checked),
    ) && !isModuleFullyChecked(module);

  const toggleGroupPermission = (group: PermissionGroupItem) => {
    group.checked = !group.checked;
    emitSelection();
  };

  const toggleModule = (module: PermissionModuleItem, checked: boolean) => {
    module.permissions.forEach((group) => {
      group.checked = checked;
      group.permissions.forEach((permission) => (permission.checked = checked));
    });
    emitSelection();
  };

  const togglePermission = (permission: PermissionActionItem) => {
    permission.checked = !permission.checked;
    emitSelection();
  };
</script>

<template>
  <div class="permission-cards">
    <section v-for="module in permissionModules" :key="module.code" class="permission-module">
      <header class="permission-module__header">
        <label class="permission-module__check">
          <input
            type="checkbox"
            :checked="isModuleFullyChecked(module)"
            :indeterminate="isModulePartiallyChecked(module)"
            :disabled="disabled"
            @change="toggleModule(module, ($event.target as HTMLInputElement).checked)"
          />
          <span>{{ $t(module.labelKey) }}</span>
        </label>
      </header>

      <div class="permission-groups">
        <article v-for="group in module.permissions" :key="group.code" class="permission-group">
          <h2 class="permission-group__title">{{ $t(group.labelKey) }}</h2>

          <div class="permission-group__body">
            <button
              type="button"
              class="permission-pill"
              :class="{ 'permission-pill--selected': group.checked }"
              :disabled="disabled"
              role="checkbox"
              :aria-checked="group.checked"
              @click="toggleGroupPermission(group)"
            >
              {{ $t('permission.actions.all') }}
            </button>
            <button
              v-for="permission in group.permissions"
              :key="permission.code"
              type="button"
              class="permission-pill"
              :class="{ 'permission-pill--selected': permission.checked }"
              :disabled="disabled"
              role="checkbox"
              :aria-checked="permission.checked"
              @click="togglePermission(permission)"
            >
              {{ $t(permission.labelKey) }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
  .permission-cards {
    display: grid;
    gap: var(--sm-size);
  }

  .permission-module {
    display: grid;
    gap: var(--sm-size);
  }

  .permission-module__header {
    padding: var(--xl-size-base);
    border-radius: var(--radius-lg);
    background: var(--bg-section);
  }

  .permission-module__check {
    display: inline-flex;
    align-items: center;
    gap: var(--xs-size-4);
    cursor: pointer;
    font-size: var(--sm-size);

    input {
      width: 16px;
      height: 16px;
      accent-color: var(--PrimaryColor);
    }
  }

  .permission-groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--xs-size);
    max-height: min(62vh, 680px);
    overflow-y: auto;
    padding-inline-end: var(--xs-size-4);
    scrollbar-color: var(--PrimaryColor) var(--bg-section);
  }

  .permission-group {
    min-width: 0;
    padding: var(--xs-size);
    border-radius: var(--radius-lg);
    background: var(--bg-section);
  }

  .permission-group__title {
    margin-bottom: var(--xs-size);
    padding-bottom: var(--xs-size-4);
    border-bottom: 1px solid var(--border-weak);
    color: var(--gray-900);
    font-size: var(--md-size);
  }

  .permission-group__body {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--xs-size-4);
  }

  .permission-pill {
    min-height: 34px;
    padding: var(--xs-size-4) var(--xs-size);
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: var(--radius-full);
    background: var(--bg-card);
    color: var(--gray-900);
    font-size: var(--xs-size);
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: var(--transition-fast);

    &:hover:not(:disabled) {
      border-color: var(--PrimaryColor);
      color: var(--PrimaryColor);
    }

    &:focus-visible {
      outline: 2px solid var(--PrimaryColor);
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .permission-pill--selected {
    border-color: var(--PrimaryColor);
    background: var(--PrimaryColor);
    color: var(--BgWhite);

    &:hover:not(:disabled) {
      color: var(--BgWhite);
    }
  }

  @media (max-width: 1100px) {
    .permission-groups {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 700px) {
    .permission-groups,
    .permission-group__body {
      grid-template-columns: 1fr;
    }
  }
</style>
