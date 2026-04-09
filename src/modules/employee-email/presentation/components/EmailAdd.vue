<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EmailController, EmailParams } from "@/modules/employee-email";

import EmailForm from "./EmailForm.vue";
import AppButton from "@/shared/HelpersComponents/AppButton.vue";
import IconAccept from "@/shared/icons/IconAccept.vue";
import HandleFilesUpload from "@/shared/FormInputs/HandleFilesUpload.vue";
import Sys from "@/assets/images/app/system-failed.png";
import { useRoute } from "vue-router";
// Controller instance
const controller = EmailController.getInstance();
const route = useRoute();
const formKey = route.fullPath;
// Form state
const params = ref<EmailParams | null>(null);
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

    // if (paramsToSave.employeeId) {
    //   await controller.update(paramsToSave, undefined, formKey);
    // } else {
    await controller.create(paramsToSave, undefined, formKey);
    // router.push({ name: "Employee Emails" });
    // }

    // // Refresh list and reset form
    // if (controller.isItemSuccess()) {
    //   await controller.fetchList();
    //   params.value = null; // Reset form
    // }
  } catch (error) {
    console.error("Error saving email:", error);
  }
};

const updateData = (updatedParams: EmailParams) => {
  params.value = updatedParams;
  // saveEmail();
};

const UploadedFiles = ref<string[]>([]);
const handleFilesChange = (files: any) => {
  UploadedFiles.value = files.map((f: any) => f);
  console.log(UploadedFiles.value);
};
</script>

<template>
  <div class="email-crud-example">
    <EmailForm
      :formKey="formKey"
      :email="controller.itemData.value!"
      @updateData="updateData"
    />

    <AppButton
      title="Save Email"
      @click="saveEmail"
      size="sm"
      icon="right"
      type="submit"
    >
      Save Email

      <template #icon>
        <IconAccept />
      </template>
    </AppButton>

    <HandleFilesUpload
      :label="$t('contract')"
      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
      :max-files="2"
      :multiple="false"
      @change="handleFilesChange"
      className="input-file"
      :index="1"
      :file="[Sys, Sys]"
    />

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
