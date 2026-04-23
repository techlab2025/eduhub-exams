<script setup lang="ts">
import { ref } from "vue";
import AppButton from "@/shared/HelpersComponents/AppButton.vue";
import IconAccept from "@/shared/icons/IconAccept.vue";
import { useRoute } from "vue-router";
import UnitController from "../controllers/unit.controller";
import type AddUnitParams from "../../core/params/add.unit.params";
import UnitForm from "./UnitForm.vue";

// Controller instance
const controller = UnitController.getInstance();
const route = useRoute();
const formKey = route.fullPath;
// Form state
const params = ref<AddUnitParams | null>(null);
/**
 * Save (create or update) email
 */
const saveEmail = async () => {
  try {
    if (!params.value) {
      console.error("No email parameters to save");
      return;
    }

    const paramsToSave = params.value;

    await controller.create(paramsToSave, undefined, formKey);
  } catch (error) {
    console.error("Error saving email:", error);
  }
};

const updateData = (updatedParams: AddUnitParams) => {
  params.value = updatedParams;
  // saveEmail();
};
</script>

<template>
  <div class="email-crud-example">
    <UnitForm
      :formKey="formKey"
      :unit="controller.itemData.value!"
      @updateData="updateData"
    />

    <AppButton
      title="Save Email"
      @click="saveEmail"
      size="sm"
      icon="right"
      type="submit"
    >
      Save Unit

      <template #icon>
        <IconAccept />
      </template>
    </AppButton>

    <!-- Error Display -->
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
  border: 1px solid var(--border-weak);
  border-radius: 4px;
  background-color: var(--bg-section);
}

.email-form input,
.email-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid var(--border-weak);
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
  margin-top: 10px;
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
