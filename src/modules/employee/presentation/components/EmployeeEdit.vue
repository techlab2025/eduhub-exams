<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AppButton from "@/shared/HelpersComponents/AppButton.vue";
import IconAccept from "@/shared/icons/IconAccept.vue";
import EmployeeController from "../controllers/employee.controller";
import type EditEmployeeParams from "../../core/params/edit.employee.params";
import ShowEmployeeParams from "../../core/params/show.employee.params";
import EmployeeForm from "./EmployeeForm.vue";

const controller = EmployeeController.getInstance();
const route = useRoute();
const formKey = route.fullPath;

const params = ref<EditEmployeeParams | null>(null);

/**
 * Update employee
 */
const saveEmployee = async () => {
  if (!params.value) {
    console.error("No employee parameters to save");
    return;
  }

  await controller.update(params.value, undefined, formKey);
};

const updateData = (updatedParams: EditEmployeeParams) => {
  params.value = updatedParams;
};

onMounted(async () => {
  await controller.fetchOne(new ShowEmployeeParams(Number(route.params.id)));
});
</script>

<template>
  <div class="employee-edit-page">
    <EmployeeForm
      :employee="controller.itemData.value!"
      :formKey="formKey"
      @updateData="updateData"
    />

    <div class="actions">
      <AppButton
        title="Update Employee"
        @click="saveEmployee"
        size="sm"
        icon="right"
        type="submit"
      >
        Update Employee
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
.employee-edit-page {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

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
