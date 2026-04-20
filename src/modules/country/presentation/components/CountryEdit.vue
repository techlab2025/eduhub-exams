<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import CountryController from '../controllers/country.controller';
  import type EditCountryParams from '../../core/params/edit.country.params';
  import CountryForm from './CountryForm.vue';
  import ShowCountryParams from '../../core/params/show.country.params';

  // Controller instance
  const controller = CountryController.getInstance();

  // Form state
  const params = ref<EditCountryParams | null>(null);
  /**
   * Save (create or update) email
   */
  const saveEmail = async () => {
    if (!params.value) {
      console.error('No email parameters to save');
      return;
    }

    await controller.update(params.value);
  };

  const updateData = (updatedParams: EditCountryParams) => {
    params.value = updatedParams;
    // saveEmail();
  };

  const route = useRoute();
  onMounted(async () => {
    await controller.fetchOne(new ShowCountryParams(Number(route.params.id)));
  });
</script>

<template>
  <div class="email-crud-example">
    <CountryForm :country="controller.itemData.value!" @update-data="updateData" />

    <button type="button" @click="saveEmail">Save Email</button>

    <!-- Error Display -->
    <div v-if="controller.errorMessage.value" class="error">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped>
  .email-crud-example {
    padding: 20px;
    /* max-width: 800px; */
    margin: 0 auto;
  }

  .email-list {
    margin-bottom: 30px;
  }

  .email-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .email-type {
    color: #666;
    font-size: 0.9em;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  .email-form {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  .email-form input,
  .email-form select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-actions {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 12px;
  }

  button:hover {
    background-color: #0056b3;
  }

  .error {
    margin-top: 20px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }
</style>
