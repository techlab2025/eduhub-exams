<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { createAdminPermissions } from '../../core/constants/admin.permissions';
  import type {
    PermissionActionItem,
    PermissionGroupItem,
    PermissionModuleItem,
  } from '../../core/models/permission.item';
  import type { PermissionCode } from '../../core/enums/permissions.enum';

  const props = withDefaults(defineProps<{ permissions?: string[]; disabled?: boolean }>(), {
    permissions: () => [],
    disabled: false,
  });
  const emit = defineEmits<{ 'update:permissions': [value: PermissionCode[]] }>();
  const permissionModules = ref(createAdminPermissions());
  const collapsedGroups = ref(new Set<string>());

  const getSelectedPermissions = (): PermissionCode[] =>
    permissionModules.value.flatMap((module) =>
      module.permissions.flatMap((group) => [
        ...(group.checked ? [group.code] : []),
        ...group.permissions.filter(({ checked }) => checked).map(({ code }) => code),
      ]),
    );
  const selectedCount = computed(() => getSelectedPermissions().length);
  const emitSelection = () => emit('update:permissions', getSelectedPermissions());

  const applyCheckedPermissions = (permissions: string[]) => {
    const selectedCodes = new Set(permissions);
    permissionModules.value.forEach((module) =>
      module.permissions.forEach((group) => {
        group.checked = selectedCodes.has(group.code);
        group.permissions.forEach((permission) => {
          permission.checked = selectedCodes.has(permission.code);
        });
      }),
    );
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
  const groupSelectedCount = (group: PermissionGroupItem) =>
    Number(group.checked) + group.permissions.filter(({ checked }) => checked).length;

  const setGroup = (group: PermissionGroupItem, checked: boolean) => {
    group.checked = checked;
    group.permissions.forEach((permission) => (permission.checked = checked));
    emitSelection();
  };
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
  const toggleGroup = (code: string) => {
    const next = new Set(collapsedGroups.value);
    next.has(code) ? next.delete(code) : next.add(code);
    collapsedGroups.value = next;
  };
</script>

<template>
  <section class="permission-configurator" :aria-label="$t('permission.configure')">
    <header class="permission-configurator__heading">
      <div>
        <h2>{{ $t('permission.configure') }}</h2>
        <p>{{ $t('permission.configure_description') }}</p>
      </div>
      <span>{{ $t('permission.selected_count', { count: selectedCount }) }}</span>
    </header>

    <div class="permission-cards">
      <section
        v-for="(module, moduleIndex) in permissionModules"
        :key="module.code"
        class="permission-module"
      >
        <header class="permission-module__header">
          <span class="permission-module__number">{{ moduleIndex + 1 }}</span>
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
            <header class="permission-group__header">
              <button
                type="button"
                class="permission-group__toggle"
                :aria-expanded="!collapsedGroups.has(group.code)"
                @click="toggleGroup(group.code)"
              >
                <span>{{ $t(group.labelKey) }}</span>
                <small>
                  {{ $t('permission.group_selected_count', { count: groupSelectedCount(group) }) }}
                </small>
              </button>
              <div class="permission-group__bulk-actions">
                <button type="button" :disabled="disabled" @click="setGroup(group, true)">
                  {{ $t('permission.select_all') }}
                </button>
                <button type="button" :disabled="disabled" @click="setGroup(group, false)">
                  {{ $t('permission.clear_all') }}
                </button>
                <button
                  class="permission-group__chevron"
                  type="button"
                  :aria-label="$t('permission.toggle_group')"
                  @click="toggleGroup(group.code)"
                >
                  <span :class="{ collapsed: collapsedGroups.has(group.code) }">⌄</span>
                </button>
              </div>
            </header>

            <div v-show="!collapsedGroups.has(group.code)" class="permission-group__body">
              <span class="permission-group__actions-label">
                {{ $t('permission.actions_label') }}
              </span>
              <button
                type="button"
                class="permission-pill"
                :class="{ 'permission-pill--selected': group.checked }"
                :disabled="disabled"
                role="checkbox"
                :aria-checked="group.checked"
                @click="toggleGroupPermission(group)"
              >
                <span class="permission-pill__checkbox" aria-hidden="true"></span>
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
                <span class="permission-pill__checkbox" aria-hidden="true"></span>
                {{ $t(permission.labelKey) }}
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .permission-configurator {
    display: grid;
    gap: var(--sm-size);
    min-width: 0;
  }

  .permission-configurator__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sm-size);

    h2 {
      margin: 0;
      color: var(--gray-900);
      font-size: var(--md-size);
    }

    p {
      margin: var(--xs-size-4) 0 0;
      color: var(--gray-500);
      font-size: var(--xs-size);
    }

    > span {
      flex: none;
      color: var(--PrimaryColor);
      font-size: var(--xs-size);
      font-weight: 600;
    }
  }

  .permission-cards,
  .permission-module,
  .permission-groups {
    display: grid;
    gap: var(--sm-size);
  }

  .permission-module {
    padding: var(--sm-size);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
  }

  .permission-module__header,
  .permission-module__check,
  .permission-group__header,
  .permission-group__bulk-actions,
  .permission-group__body,
  .permission-pill {
    display: flex;
    align-items: center;
  }

  .permission-module__header {
    gap: var(--xs-size);
    color: var(--PrimaryColor);
  }

  .permission-module__number {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    background: var(--PrimaryColor-alpha-10);
    font-weight: 700;
  }

  .permission-module__check {
    gap: var(--xs-size-4);
    font-weight: 600;

    input {
      width: 16px;
      height: 16px;
      accent-color: var(--PrimaryColor);
    }
  }

  .permission-group {
    overflow: hidden;
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
    background: var(--bg-section);
  }

  .permission-group__header {
    justify-content: space-between;
    gap: var(--sm-size);
    padding: var(--xs-size) var(--sm-size);
  }

  .permission-group__toggle {
    display: grid;
    gap: 2px;
    min-width: 0;
    text-align: start;

    span {
      color: var(--gray-900);
      font-weight: 600;
    }

    small {
      color: var(--PrimaryColor);
    }
  }

  .permission-group__bulk-actions {
    gap: var(--sm-size);

    button:not(.permission-group__chevron) {
      color: var(--PrimaryColor);
      font-size: var(--xs-size);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  .permission-group__chevron {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    color: var(--gray-500);

    span {
      transition: transform 160ms ease;
    }

    .collapsed {
      transform: rotate(180deg);
    }
  }

  .permission-group__body {
    flex-wrap: wrap;
    gap: var(--sm-size);
    padding: 0 var(--sm-size) var(--sm-size);
  }

  .permission-group__actions-label {
    flex-basis: 100%;
    color: var(--gray-500);
    font-size: var(--xs-size);
  }

  .permission-pill {
    gap: var(--xs-size-4);
    min-height: 30px;
    color: var(--gray-700);
    font-size: var(--xs-size);
  }

  .permission-pill__checkbox {
    position: relative;
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-weak);
    border-radius: 3px;
    background: var(--bg-card);
  }

  .permission-pill--selected .permission-pill__checkbox {
    border-color: var(--PrimaryColor);
    background: var(--PrimaryColor);

    &::after {
      position: absolute;
      inset: 2px 4px 4px;
      border: solid var(--BgWhite);
      border-width: 0 2px 2px 0;
      content: '';
      transform: rotate(45deg);
    }
  }

  .permission-pill:focus-visible,
  .permission-group__toggle:focus-visible,
  .permission-group__bulk-actions button:focus-visible {
    outline: 2px solid var(--PrimaryColor);
    outline-offset: 2px;
  }

  @media (max-width: 700px) {
    .permission-configurator__heading,
    .permission-group__header {
      align-items: stretch;
      flex-direction: column;
    }

    .permission-group__bulk-actions {
      justify-content: flex-end;
    }
  }
</style>
