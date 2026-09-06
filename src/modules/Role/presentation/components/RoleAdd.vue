<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import RoleController from '../controllers/role.controller';
  import StoreRoleParams from '../../core/params/store.role.params';
  import RoleForm from './RoleForm.vue';
  import {
    ValidationHandler,
    type ValidationError,
  } from '@/base/Presentation/Utils/new_validator.ts';
  import { RoleValidationsHandler } from '../../core/validations/RoleValidations.ts';
  import RoleFeedbackDialog from './RoleFeedbackDialog.vue';

  const controller = RoleController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<StoreRoleParams | null>(null);
  const loading = ref(false);
  const dialogVisible = ref(false);
  const dialogVariant = ref<
    'title-required' | 'permissions-required' | 'duplicate-title' | 'save-error'
  >('title-required');
  const dialogMessage = ref('');

  const showSaveError = (message: string) => {
    dialogVariant.value = /already|duplicate|taken|موجود|مكرر/i.test(message)
      ? 'duplicate-title'
      : 'save-error';
    dialogMessage.value = message;
    dialogVisible.value = true;
  };

  /**
   * Save new role
   */
  const errors = ref<ValidationError[]>([]);
  const saveRole = async () => {
    const submittedParams = params.value ?? new StoreRoleParams({}, []);
    errors.value = ValidationHandler(RoleValidationsHandler(submittedParams));
    if (errors.value.length > 0) {
      dialogVariant.value = errors.value.some((error) => error.key === 'title')
        ? 'title-required'
        : 'permissions-required';
      dialogMessage.value = '';
      dialogVisible.value = true;
      return;
    }

    loading.value = true;
    try {
      if (!params.value) {
        console.error('No role parameters to save');
        return;
      }

      const result = await controller.create(params.value);
      if (result?.hasError) {
        showSaveError(result.error?.displayMessage ?? '');
        return;
      }
      if (result?.data) {
        router.push({ name: 'Roles' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error saving role:', error);
      showSaveError(error instanceof Error ? error.message : '');
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: StoreRoleParams) => {
    params.value = updatedParams;
  };

  const router = useRouter();
</script>

<template>
  <div class="employee-add-page">
    <RoleForm
      ref="RoleFormRef"
      :form-key="formKey"
      :loading="loading"
      :errors="errors"
      @update-data="updateData"
    />

    <div class="actions">
      <button class="btn btn-primary w-full" type="submit" @click="saveRole">
        <span v-if="loading" class="loader"></span>
        <span v-else>
          {{ $t('save_role') }}
        </span>
      </button>
      <router-link to="/roles" class="btn btn-cancel">
        {{ $t(`cancel`) }}
      </router-link>
    </div>

    <RoleFeedbackDialog v-model="dialogVisible" :variant="dialogVariant" :message="dialogMessage" />
  </div>
</template>

<style scoped lang="scss">
  .loader {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 8px solid;
    border-color: var(--standard-black) transparent;
    animation: l1 1s infinite;
  }

  @keyframes l1 {
    to {
      transform: rotate(0.5turn);
    }
  }

  @keyframes l7 {
    to {
      transform: rotate(0.5turn);
    }
  }

  .btn-cancel {
    background-color: var(--background-btn-outline-color);
    color: var(--danger-color);
    border: 1px solid rgba(245, 194, 192, 1);
    border-radius: 50px;
    width: 20%;

    @media (max-width: 768px) {
      width: 50%;
    }
  }

  .btn-draft {
    background-color: var(--PrimaryColor-alpha-10);
    color: var(--PrimaryColor);
    border: 1px solid var(--PrimaryColor-alpha-10);
    border-radius: 50px;
    width: 20%;

    @media (max-width: 768px) {
      width: 50%;
    }
  }

  .save-emp {
    width: 60%;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .actions {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
</style>
