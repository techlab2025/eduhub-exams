<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import RoleController from '../controllers/role.controller';
  import type StoreRoleParams from '../../core/params/store.role.params';
  import RoleForm from './RoleForm.vue';
  import ShowRoleParams from '../../core/params/show.role.params.ts';

  const controller = RoleController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  const roleId = computed(() => Number(route.params.id));
  const params = ref<StoreRoleParams | null>(null);
  const loading = ref(false);
  const RoleFormRef = ref<{ validate: () => boolean | Promise<boolean> } | null>(null);

  const saveRole = async () => {
    const isFormValid = await RoleFormRef.value?.validate?.();
    if (isFormValid === false) return;

    loading.value = true;
    try {
      if (!params.value) {
        console.error('No role parameters to save');
        return;
      }

      const result = await controller.update(params.value, undefined, formKey);
      if (result?.data) {
        router.push({ name: 'Roles' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error saving Role:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: StoreRoleParams) => {
    params.value = updatedParams;
  };

  const ShowRole = async () => {
    const ShowROleParams = new ShowRoleParams(roleId.value);
    await controller.fetchOne(ShowROleParams);
  };
  const router = useRouter();
  onMounted(ShowRole);
</script>

<template>
  <div class="employee-add-page">
    <RoleForm
      ref="RoleFormRef"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
      @save-role="saveRole"
      :data="controller.itemState.value?.data!"
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

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .loader {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 8px solid;
    border-color: #000 #0000;
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

  .error-toast {
    margin-top: 20px;
    padding: 12px 16px;
    background-color: var(--error-light);
    color: var(--error-dark);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
  }
</style>
