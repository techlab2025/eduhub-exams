<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import AdminController from '../controllers/admin.controller';
  import EditAdminParams from '../../core/params/edit.admin.params';
  import type AddAdminParams from '../../core/params/add.admin.params';
  import ShowAdminParams from '../../core/params/show.admin.params';
  import AdminForm from './AdminForm.vue';

  const controller = AdminController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<EditAdminParams | null>(null);

  const saveAdmin = async () => {
    if (!params.value) {
      console.error('No admin parameters to save');
      return;
    }

    await controller.update(params.value, undefined, formKey);
  };

  const updateData = (updatedParams: AddAdminParams) => {
    params.value = new EditAdminParams({
      id: Number(route.params.id),
      name: updatedParams.name,
      email: updatedParams.email,
      phone: updatedParams.phone,
      password: updatedParams.password,
    });
  };

  onMounted(async () => {
    await controller.fetchOne(new ShowAdminParams(Number(route.params.id)));
  });
</script>

<template>
  <div class="admin-edit-page">
    <AdminForm :admin="controller.itemData.value!" :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <AppButton
        :title="$t('update_admin')"
        size="sm"
        icon="right"
        type="submit"
        @click="saveAdmin"
      >
        {{ $t('update_admin') }}
        <template #icon>
          <IconAccept />
        </template>
      </AppButton>
    </div>

    <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .actions {
    margin-top: 24px;
    display: flex;
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
