<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import { isDataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import PermissionSelector from './PermissionSelector.vue';
  import PermissionController from '../controllers/permission.controller';
  import ShowEmployeePermissionsParams from '../../core/params/show.employee.permissions.params';
  import StoreEmployeePermissionsParams from '../../core/params/store.employee.permissions.params';
  import type { PermissionCode } from '../../core/enums/permissions.enum';

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const controller = PermissionController.getInstance();
  const employeeId = computed(() => Number(route.params.id));
  const employeeName = computed(() => String(route.query.name ?? t('employee')));
  const selectedPermissions = ref<PermissionCode[]>([]);
  const saving = ref(false);

  const loadPermissions = async () => {
    const result = await controller.fetchOne(new ShowEmployeePermissionsParams(employeeId.value), {
      useStaticData: false,
    });
    if (isDataSuccess(result)) {
      selectedPermissions.value = (result.data?.permissions ?? []) as PermissionCode[];
    }
  };

  const savePermissions = async () => {
    saving.value = true;
    try {
      const result = await controller.storeEmployeePermissions(
        new StoreEmployeePermissionsParams(employeeId.value, selectedPermissions.value),
        { useStaticData: false },
      );
      if (result && isDataSuccess(result)) await router.push({ name: 'Employees' });
    } finally {
      saving.value = false;
    }
  };

  onMounted(loadPermissions);
</script>

<template>
  <main class="employee-permissions-page">
    <header class="employee-permissions-page__navigation">
      <button class="permission-back" type="button" @click="router.push({ name: 'Employees' })">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        {{ $t('permission.back') }}
      </button>
      <div class="employee-permissions-page__identity">
        <strong>{{ $t('permission.page_title') }}</strong>
        <span>{{ employeeName }}</span>
      </div>
      <span aria-hidden="true"></span>
    </header>

    <DataStatusBuilder :controller="controller.itemState.value" :on-retry="loadPermissions">
      <template #success>
        <PermissionSelector
          :permissions="selectedPermissions"
          :disabled="saving"
          @update:permissions="selectedPermissions = $event"
        />
        <div class="employee-permissions-page__actions">
          <span>{{ $t('permission.selected_count', { count: selectedPermissions.length }) }}</span>
          <button class="btn btn-primary" type="button" :disabled="saving" @click="savePermissions">
            {{ saving ? $t('permission.saving') : $t('permission.apply') }}
          </button>
        </div>
      </template>
    </DataStatusBuilder>
  </main>
</template>

<style scoped lang="scss">
  .employee-permissions-page {
    display: grid;
    gap: var(--xl-size-base);
  }

  .employee-permissions-page__navigation,
  .employee-permissions-page__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--xl-size-base);
  }

  .employee-permissions-page__navigation {
    min-height: 58px;
    padding: var(--xs-size) var(--sm-size);
    border-radius: var(--radius-lg);
    background: var(--bg-section);

    > span {
      width: 72px;
    }
  }

  .permission-back {
    display: inline-flex;
    align-items: center;
    gap: var(--xs-size-4);
    color: var(--gray-700);
    font-weight: 600;
  }

  .employee-permissions-page__identity {
    display: grid;
    justify-items: center;

    span {
      color: var(--gray-500);
      font-size: var(--xs-size);
    }
  }

  .employee-permissions-page__actions {
    position: sticky;
    bottom: 0;
    margin-top: var(--xl-size-base);
    padding: var(--sm-size) var(--xl-size-base);
    border-top: 1px solid var(--border-weak);
    background: var(--bg-card);
    z-index: 2;

    span {
      color: var(--gray-500);
    }

    .btn {
      min-width: 160px;
    }
  }

  @media (max-width: 600px) {
    .employee-permissions-page__actions {
      align-items: stretch;
      flex-direction: column;
    }

    .employee-permissions-page__identity {
      justify-items: end;
      text-align: end;
    }

    .employee-permissions-page__navigation > span {
      display: none;
    }

    .employee-permissions-page__actions .btn {
      width: 100%;
    }
  }
</style>
