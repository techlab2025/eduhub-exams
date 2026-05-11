<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import type EditSkillsParams from '../../core/params/edit.skills.params';
  import ShowSkillsParams from '../../core/params/show.skills.params';
  import SkillsController from '../controllers/skills.controller';
  import SkillsForm from './SkillsForm.vue';

  const controller = SkillsController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;
 
  const params = ref<EditSkillsParams | null>(null);

  /**
   * Update skill
   */
  const saveSkill = async () => {
    if (!params.value) {
      console.error('No skill parameters to save');
      return;
    }

    await controller.update(params.value, undefined);
  };

  const updateData = (updatedParams: EditSkillsParams) => {
    params.value = updatedParams;
  };

  onMounted(async () => {
    await controller.fetchOne(new ShowSkillsParams(Number(route.params.id)));
  });
</script>

<template>
  <div class="skills-edit-page">
    <SkillsForm :skill="controller.itemData.value!" :form-key="formKey" @update-data="updateData" />

    <div class="actions">
      <AppButton title="Update Skill" size="sm" icon="right" type="submit" @click="saveSkill">
        Update Skill
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
