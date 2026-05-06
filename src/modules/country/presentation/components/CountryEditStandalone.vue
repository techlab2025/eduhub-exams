<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import CountryStandaloneController from '../controllers/country.standalone.controller';
  import EditCountryParams from '../../core/params/edit.country.params';
  import type AddCountryParams from '../../core/params/add.country.params';
  import CountryForm from './CountryForm.vue';
  import ShowCountryParams from '../../core/params/show.country.params';

  const controller = CountryStandaloneController.getInstance();

  const params = ref<EditCountryParams | null>(null);

  const saveCountry = async () => {
    if (!params.value) {
      console.error('No country parameters to save');
      return;
    }

    await controller.update(params.value);
  };

  const updateData = (updatedParams: AddCountryParams) => {
    params.value = new EditCountryParams({
      id: Number(route.params.id),
      title: updatedParams.title,
      code: updatedParams.code,
      flag: updatedParams.flag,
    });
  };

  const route = useRoute();
  onMounted(async () => {
    await controller.fetchOne(new ShowCountryParams(Number(route.params.id)));
  });
</script>

<template>
  <div class="country-edit-page">
    <CountryForm :country="controller.itemData.value!" @update-data="updateData" />

    <button type="button" @click="saveCountry">{{ $t('Save') }}</button>

    <div v-if="controller.errorMessage.value" class="error">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>
