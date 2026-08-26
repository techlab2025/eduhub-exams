<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import IconArrowDown from '@/shared/icons/IconArrowDown.vue';
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
  const collapsedModules = ref(new Set<string>());
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
  const toggleModuleCollapsed = (code: string) => {
    const next = new Set(collapsedModules.value);
    next.has(code) ? next.delete(code) : next.add(code);
    collapsedModules.value = next;
  };
</script>

<template>
  <section class="permission-configurator" :aria-label="$t('permission.configure')">
    <header class="permission-configurator__heading">
      <div class="permission-configurator__title-row">
        <h2>{{ $t('permission.configure') }}</h2>
        <span>{{ $t('permission.selected_count', { count: selectedCount }) }}</span>
      </div>
      <p>{{ $t('permission.configure_description') }}</p>
    </header>

    <div class="permission-cards">
      <section
        v-for="(module, moduleIndex) in permissionModules"
        :key="module.code"
        class="permission-module"
      >
        <header class="permission-module__header">
          <div class="permission-module__title">
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
          </div>
          <button
            type="button"
            class="permission-module__chevron"
            :aria-label="$t('permission.toggle_group')"
            :aria-expanded="!collapsedModules.has(module.code)"
            @click="toggleModuleCollapsed(module.code)"
          >
            <IconArrowDown />
          </button>
        </header>

        <div v-show="!collapsedModules.has(module.code)" class="permission-groups">
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
                  <IconArrowDown :class="{ collapsed: collapsedGroups.has(group.code) }" />
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
    --permission-heading-font: 'Demi';

    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--sidebar-group-text-color);
    border-radius: 20px;
    background: var(--background-color-soft-light);
    font-family: 'Medium', sans-serif;
  }

  .permission-configurator__heading {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;

    p {
      margin: 0;
      color: var(--gray-5);
      font-size: 16px;
      line-height: 1;
    }
  }

  .permission-configurator__title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    h2 {
      margin: 0;
      color: var(--title-card-color);
      font-family: var(--permission-heading-font);
      font-size: 24px;
      font-weight: 600;
      line-height: 1;
    }

    span {
      flex: none;
      min-height: 36px;
      padding: 6px 10px;
      border: 1px solid var(--PrimaryColor-alpha-10);
      border-radius: var(--radius-full);
      background: var(--badge-bg);
      color: var(--PrimaryColor);
      font-size: 16px;
      line-height: 1.5;
    }
  }

  .permission-cards {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .permission-module {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px;
    border-radius: 20px;
    background: var(--BgWhite);
  }

  .permission-module__header,
  .permission-module__title,
  .permission-module__check,
  .permission-group__header,
  .permission-group__bulk-actions,
  .permission-group__body,
  .permission-pill {
    display: flex;
    align-items: center;
  }

  .permission-module__header {
    justify-content: space-between;
    gap: 16px;
    color: var(--PrimaryColor);
  }

  .permission-module__title {
    gap: 10px;
    min-width: 0;
  }

  .permission-module__number {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    flex: none;
    border-radius: 6px;
    background: var(--PrimaryColor-alpha-8);
    font-family: var(--permission-heading-font);
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
  }

  .permission-module__check {
    position: relative;
    font-family: var(--permission-heading-font);
    font-size: 20px;
    font-weight: 600;
    line-height: 1;

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }

  .permission-module__chevron,
  .permission-group__chevron {
    display: grid;
    flex: none;
    place-items: center;
    width: 28px;
    height: 28px;
    color: var(--Gray-6);

    :deep(svg) {
      width: 15px;
      height: 8px;
      transition: transform 160ms ease;
    }

    :deep(path) {
      fill: var(--Gray-6);
    }
  }

  .permission-module__chevron[aria-expanded='true'] :deep(svg) {
    transform: rotate(180deg);
  }

  .permission-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .permission-group {
    overflow: hidden;
    border: 1px solid var(--sidebar-group-text-color);
    border-radius: 14px;
    background: var(--background-color-soft-light);
  }

  .permission-group__header {
    justify-content: space-between;
    gap: 16px;
    min-height: 64px;
    padding: 12px 23px 14px;
  }

  .permission-group__toggle {
    display: grid;
    gap: 8px;
    min-width: 0;
    text-align: start;

    span {
      color: var(--title-card-color);
      font-family: var(--permission-heading-font);
      font-size: 18px;
      font-weight: 600;
      line-height: 1;
    }

    small {
      color: var(--PrimaryColor);
      font-size: 14px;
      line-height: 1;
    }
  }

  .permission-group__bulk-actions {
    gap: 0;

    button:not(.permission-group__chevron) {
      min-height: 31px;
      padding-inline: 24px;
      color: var(--PrimaryColor);
      font-family: var(--permission-heading-font);
      font-size: 16px;
      font-weight: 600;
      line-height: 1;

      + button:not(.permission-group__chevron) {
        border-inline-start: 1px solid var(--sidebar-group-text-color);
      }
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  .permission-group__chevron {
    margin-inline-start: 28px;

    :deep(.collapsed) {
      transform: rotate(180deg);
    }
  }

  .permission-group__body {
    flex-wrap: wrap;
    column-gap: 52px;
    row-gap: 16px;
    margin: 0 23px;
    padding: 12px 0 14px;
    border-top: 1px solid var(--sidebar-group-text-color);
  }

  .permission-group__actions-label {
    flex-basis: 100%;
    color: var(--Gray-6);
    font-family: var(--permission-heading-font);
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
  }

  .permission-pill {
    gap: 10px;
    min-height: 18px;
    color: var(--Gray-6);
    font-size: 16px;
    line-height: normal;
  }

  .permission-pill__checkbox {
    position: relative;
    flex: none;
    width: 16.5px;
    height: 16.5px;
    border: 0.75px solid var(--sidebar-group-text-color);
    border-radius: 5px;
    background: var(--BgWhite);
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
  .permission-module__chevron:focus-visible,
  .permission-group__toggle:focus-visible,
  .permission-group__bulk-actions button:focus-visible {
    outline: 2px solid var(--PrimaryColor);
    outline-offset: 2px;
  }

  @media (max-width: 700px) {
    .permission-group__header {
      align-items: stretch;
      flex-direction: column;
    }

    .permission-group__bulk-actions {
      justify-content: flex-end;
    }

    .permission-group__chevron {
      margin-inline-start: 8px;
    }
  }

  @media (max-width: 480px) {
    .permission-configurator {
      padding: 12px;
    }

    .permission-module {
      padding-inline: 12px;
    }

    .permission-group__header {
      padding-inline: 16px;
    }

    .permission-group__body {
      column-gap: 24px;
      margin-inline: 16px;
    }
  }
</style>
