<script setup lang="ts">
  import { ref } from 'vue';
  import AppButton from '@/shared/HelpersComponents/AppButton.vue';
  import IconAccept from '@/shared/icons/IconAccept.vue';
  import { useRoute } from 'vue-router';
  import CountryStandaloneController from '../controllers/country.standalone.controller';
  import CountryForm from './CountryForm.vue';
  import type AddCountryParams from '../../core/params/add.country.params';

  const controller = CountryStandaloneController.getInstance();
  const route = useRoute();
  const formKey = route.fullPath;

  const params = ref<AddCountryParams | null>(null);

  const saveCountry = async () => {
    try {
      if (!params.value) {
        console.error('No country parameters to save');
        return;
      }

      await controller.create(params.value, undefined, formKey);
    } catch (error) {
      console.error('Error saving country:', error);
    }
  };

  const updateData = (updatedParams: AddCountryParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="country-add-page">
    <CountryForm :form-key="formKey" @update-data="updateData" />

    <AppButton :title="$t('Save')" size="sm" icon="right" type="submit" @click="saveCountry">
      {{ $t('Save') }}

      <template #icon>
        <IconAccept />
      </template>
    </AppButton>

    <div v-if="controller.errorMessage.value" class="error">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped>
  :deep(.input-file) {
    border: 1px solid #d9dbe9 !important;
    padding: 11px;
    border-radius: 20px !important;
    cursor: pointer;
  }
</style>
