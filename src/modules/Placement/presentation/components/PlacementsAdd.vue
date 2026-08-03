<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import { useRoute } from 'vue-router';
  import placementController from '../controllers/placement.controller';
  import { useI18n } from 'vue-i18n';
  import PlacementForm from './PlacementsForm.vue';
  import type AddPlacementParams from '../../core/params/add.placement.params';
  import ShowPlacementParams from '../../core/params/show.placement.params';
  const { t } = useI18n();
  const controller = placementController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
  const params = ref<AddPlacementParams | null>(null);

  const showState = computed(() => controller.itemState.value);
  onMounted(() => {
    const params = new ShowPlacementParams(Number(route.params.id));
    controller.fetchOne(params);
  });

  const savePlacement = async () => {
    try {
      if (!params.value) {
        console.error('No placement parameters to save');
        return;
      }

      await controller.create(params.value, undefined, formKey);
    } catch (error) {
      console.error('Error saving placement:', error);
    }
  };

  const updateData = (updatedParams: AddPlacementParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="placement-add-page">
    <PlacementForm  :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <AppButton
        :title="$t(`Save Placement`)"
        size="sm"
        icon="right"
        type="submit"
        class="save-placement"
        @click="savePlacement"
      >
        {{ t(`Save`) }}
        <template #icon>
          <IconAccept />
        </template>
      </AppButton>
    </div>

    <!-- Error Display -->
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
    width: 100%;
  }

  .actions {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 16px;
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
