<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { isDataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import PermissionSelector from '@/modules/Permission/presentation/components/PermissionSelector.vue';
  import RoleController from '../controllers/role.controller';
  import ShowRoleParams from '../../core/params/show.role.params';
  import StoreRoleParams from '../../core/params/store.role.params';
  import UpdateRoleParams from '../../core/params/update.role.params';

  type RoleFormMode = 'add' | 'edit' | 'show';
  const props = withDefaults(defineProps<{ mode?: RoleFormMode }>(), { mode: 'add' });
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const controller = RoleController.getInstance();
  const roleId = computed(() => Number(route.params.id));
  const roleName = ref('');
  const selectedPermissions = ref<string[]>([]);
  const loading = ref(false);
  const submitted = ref(false);
  const isReadonly = computed(() => props.mode === 'show');
  const pageTitle = computed(() => t(`role.${props.mode}_title`));

  const loadRole = async () => {
    if (props.mode === 'add' || !roleId.value) return;
    loading.value = true;
    const result = await controller.fetchOne(new ShowRoleParams(roleId.value));
    loading.value = false;
    if (!isDataSuccess(result) || !result.data) return;
    roleName.value = result.data.roleName;
    selectedPermissions.value = [...result.data.permissions];
  };

  const saveRole = async () => {
    submitted.value = true;
    if (!roleName.value.trim() || isReadonly.value) return;
    loading.value = true;
    const params =
      props.mode === 'edit'
        ? new UpdateRoleParams(roleId.value, roleName.value, selectedPermissions.value)
        : new StoreRoleParams(roleName.value, selectedPermissions.value);
    const result =
      props.mode === 'edit'
        ? await controller.update(params, { useJson: true })
        : await controller.create(params, { useJson: true });
    loading.value = false;
    if (result && isDataSuccess(result)) await router.push({ name: 'Roles' });
  };

  onMounted(loadRole);
</script>

<template>
  <main class="role-form-page" :aria-busy="loading">
    <header class="role-form-page__header">
      <div>
        <h1>{{ pageTitle }}</h1>
        <p>{{ $t('role.form_description') }}</p>
      </div>
      <router-link class="role-form-page__back" :to="{ name: 'Roles' }">
        {{ $t('role.back_to_roles') }}
      </router-link>
    </header>

    <section class="role-form-page__name-card">
      <label for="role-name">{{ $t('role.name') }} <span aria-hidden="true">*</span></label>
      <input
        id="role-name"
        v-model="roleName"
        type="text"
        :placeholder="$t('role.name_placeholder')"
        :readonly="isReadonly"
        :disabled="loading"
        :aria-invalid="submitted && !roleName.trim()"
      />
      <small v-if="submitted && !roleName.trim()" role="alert">
        {{ $t('role.name_required') }}
      </small>
    </section>

    <section class="role-form-page__permissions-card">
      <PermissionSelector
        :permissions="selectedPermissions"
        :disabled="loading || isReadonly"
        @update:permissions="selectedPermissions = $event"
      />
    </section>

    <footer class="role-form-page__actions">
      <router-link class="btn role-form-page__cancel" :to="{ name: 'Roles' }">
        {{ isReadonly ? $t('role.actions.back') : $t('role.actions.cancel') }}
      </router-link>
      <router-link
        v-if="isReadonly"
        class="btn btn-primary"
        :to="{ name: 'Edit Role', params: { id: roleId } }"
      >
        {{ $t('role.actions.edit') }}
      </router-link>
      <button v-else class="btn btn-primary" type="button" :disabled="loading" @click="saveRole">
        {{ loading ? $t('role.saving') : $t(`role.${props.mode}_action`) }}
      </button>
    </footer>
  </main>
</template>

<style scoped lang="scss">
  .role-form-page {
    --role-heading-font: 'Demi';

    display: grid;
    gap: 24px;
    // max-width: 1036px;
    margin-inline: auto;
    color: var(--Gray-6);
    font-family: 'Medium', sans-serif;
  }

  .role-form-page__header,
  .role-form-page__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .role-form-page__header {
    padding: 16px 24px;
    border: 1px solid var(--sidebar-group-text-color);
    border-radius: 20px;
    background: var(--background-color-soft-light);

    h1,
    p {
      margin: 0;
    }

    h1 {
      color: var(--title-card-color);
      font-family: var(--role-heading-font);
      font-size: 24px;
      font-weight: 600;
    }

    p {
      margin-top: 10px;
      color: var(--gray-5);
      font-size: 16px;
    }
  }

  .role-form-page__back {
    color: var(--PrimaryColor);
    font-family: var(--role-heading-font);
    font-weight: 600;
  }

  .role-form-page__name-card {
    display: grid;
    gap: 8px;
    padding: 20px 16px;
    border-radius: 20px;
    background: #fafafa;
    border: 1px solid #d0d0d0;

    label {
      color: var(--Gray-6);
      font-family: var(--role-heading-font);
      font-weight: 600;

      span {
        color: var(--danger-color);
      }
    }

    input {
      min-height: 44px;
      padding-inline: 16px;
      border: 1px solid var(--sidebar-group-text-color);
      border-radius: 14px;
      background: white;
      color: var(--title-card-color);
      font-family: 'Medium', sans-serif;
      outline: none;

      &:focus {
        border-color: var(--PrimaryColor);
        box-shadow: 0 0 0 3px var(--PrimaryColor-alpha-10);
      }

      &[readonly] {
        background: var(--background-color-soft-light);
      }
    }

    small {
      color: var(--danger-color);
    }
  }

  .role-form-page__actions {
    position: sticky;
    bottom: 0;
    justify-content: flex-end;
    padding: 16px;
    border-top: 1px solid var(--sidebar-group-text-color);
    background: var(--BgWhite);
    z-index: 2;

    .btn {
      min-width: 150px;
      border-radius: var(--radius-full);
      text-align: center;
    }
  }

  .role-form-page__cancel {
    border: 1px solid var(--sidebar-group-text-color);
    color: var(--Gray-6);
  }

  @media (max-width: 600px) {
    .role-form-page__header,
    .role-form-page__actions {
      align-items: stretch;
      flex-direction: column;
    }

    .role-form-page__actions .btn {
      width: 100%;
    }
  }
</style>
