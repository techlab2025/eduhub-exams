<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import PermissionSelector from '@/modules/Permission/presentation/components/PermissionSelector.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import StoreRoleParams from '../../core/params/store.role.params';
  import UpdateRoleParams from '../../core/params/update.role.params';
  import type RoleModel from '../../core/models/role.model';
  import { TranslationFromLidtToObject } from '@/base/Presentation/Utils/translation_handle_from_list_to_object';
  import { ValidationHandler } from '@/base/Presentation/Utils/new_validator';
  import { RoleValidationsHandler } from '../../core/validations/RoleValidations';
  import ValidationErrorsHandlerComponent from '@/shared/HelpersComponents/ValidationErrorsHandlerComponent.vue';
  import ValidationErrorScroller, {
    type ValidationError,
    type ValidationRefs,
  } from '@/base/Presentation/Utils/ValidationErrorScroller';

  const emit = defineEmits(['update-data']);
  const props = defineProps<{
    data?: RoleModel;
  }>();

  const route = useRoute();
  const roleId = computed(() => Number(route.params.id));

  const titleRef = ref<HTMLElement | null>(null);
  const permissionsRef = ref<HTMLElement | null>(null);

  const refs: ValidationRefs = {
    title: {
      ref: titleRef,
      block: 'start',
    },

    permissions: {
      ref: permissionsRef,
      block: 'end',
    },
  };
  const errors = ref<ValidationError[]>([]);
  const title = ref<Record<string, string>>({});
  const selectedPermissions = ref<string[]>([]);
  const loading = ref(false);

  const saveRole = async () => {
    errors.value = ValidationHandler(
      RoleValidationsHandler(new StoreRoleParams(title.value, selectedPermissions.value)),
    );

    new ValidationErrorScroller(errors.value, refs).scrollToError();

    const params = route?.params?.id
      ? new UpdateRoleParams(roleId.value, title.value, selectedPermissions.value)
      : new StoreRoleParams(title.value, selectedPermissions.value);
    emit('update-data', params);
  };

  const permissionsList = computed(() => {
    return props.data?.permissions;
  });
  const updateTitle = (data: Record<string, string>) => {
    title.value = data;
    saveRole();
  };
  const updatePermission = (data: string[]) => {
    selectedPermissions.value = data;
    saveRole();
  };
  watch(
    () => props.data,
    async (data) => {
      if (!data) return;
      title.value = await TranslationFromLidtToObject(
        props.data?.titleTranslations ?? [],
        'display_name',
      );
    },
    { immediate: true },
  );
</script>

<template>
  <main class="role-form-page" :aria-busy="loading" ref="titleRef">
    <section class="role-form-page__name-card" :aria-disabled="loading" :inert="loading">
      <MultiLangInput
        field-key="title"
        :label="$t('role.name')"
        :languages="['en', 'ar']"
        :model-value="title"
        type="title"
        @update:model-value="updateTitle($event)"
      />
      <ValidationErrorsHandlerComponent :validations="errors" validationKey="title" />
    </section>

    <section class="role-form-page__permissions-card" ref="permissionsRef">
      <PermissionSelector
        :permissions="permissionsList"
        :disabled="loading"
        @update:permissions="updatePermission($event)"
      />
      <ValidationErrorsHandlerComponent :validations="errors" validationKey="permissions" />
    </section>
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
