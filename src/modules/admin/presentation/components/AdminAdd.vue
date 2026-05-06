<script setup lang="ts">
  import { ref } from 'vue';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import { useRoute } from 'vue-router';
  import AdminController from '../controllers/admin.controller';
  import AdminForm from './AdminForm.vue';
  import type AddAdminParams from '../../core/params/add.admin.params';

  const controller = AdminController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddAdminParams | null>(null);

  const saveAdmin = async () => {
    try {
      if (!params.value) {
        console.error('No admin parameters to save');
        return;
      }

      await controller.create(params.value, undefined, formKey);
    } catch (error) {
      console.error('Error saving admin:', error);
    }
  };

  const updateData = (updatedParams: AddAdminParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="admin-add-page">
    <AdminForm :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <AppButton
        :title="$t('save_admin')"
        size="sm"
        icon="right"
        type="submit"
        class="save-admin"
        @click="saveAdmin"
      >
        {{ $t('save_admin') }}
        <template #icon>
          <IconAccept />
        </template>
      </AppButton>
      <button class="btn btn-cancel">{{ $t('cancel') }}</button>
    </div>

    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
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

  .save-admin {
    width: 60%;
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
