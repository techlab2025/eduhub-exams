<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppButton from '@/shared/HelpersComponents/AppButton.vue';
import IconAccept from '@/shared/icons/IconAccept.vue';
import PlacementController from '../controllers/placement.controller';
import type EditPlacementParams from '../../core/params/edit.placement.params';
import ShowPlacementParams from '../../core/params/show.placement.params';
import PlacementsForm from './PlacementsForm.vue';

const controller = PlacementController.getInstance();
const route = useRoute();
const formKey = route.fullPath;

const params = ref<EditPlacementParams | null>(null);

/**
 * Update placement
 */
const savePlacement = async () => {
  if (!params.value) {
    console.error('No placement parameters to save');
    return;
  }

  await controller.update(params.value, undefined, formKey);
};

const updateData = (updatedParams: EditPlacementParams) => {
  params.value = updatedParams;
};

onMounted(async () => {
  await controller.fetchOne(new ShowPlacementParams(Number(route.params.id)));
});
</script>

<template>
  <div class="placement-edit-page">
    <PlacementsForm
      :placement="controller.itemData.value!"
      :form-key="formKey"
      @update-data="updateData"
    />

    <div class="actions">
      <AppButton title="Update Placement" size="sm" icon="right" type="submit" @click="savePlacement">
        Update Placement
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
