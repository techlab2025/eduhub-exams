<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  EmailController,
  EmailParams,
  EmailType,
} from "@/modules/employee-email";

import EmailForm from "./EmailForm.vue";
import { useRoute } from "vue-router";
import ShowEmailParams from "../../core/params/show.email.params";

// Controller instance
const controller = EmailController.getInstance();

// Form state
const params = ref<EmailParams | null>(null);
/**
 * Save (create or update) email
 */
const saveEmail = async () => {
  if (!params.value) {
    console.error("No email parameters to save");
    return;
  }

  const paramsToSave = params.value;

  if (paramsToSave.type) {
    await controller.update(paramsToSave);
  }
};

const updateData = (updatedParams: EmailParams) => {
  params.value = updatedParams;
  // saveEmail();
};

const route = useRoute();
onMounted(async () => {
  await controller.fetchOne(new ShowEmailParams(Number(route.params.id)));
});
</script>

<template>
  <div class="email-crud-example">
    <EmailForm :email="controller.itemData.value!" @updateData="updateData" />

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
  max-width: 800px;
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
