<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import AppButton from "@/shared/HelpersComponents/AppButton.vue";
import IconAccept from "@/shared/icons/IconAccept.vue";
import DocumentController from "../controllers/document.controller";
import DocumentForm from "./DocumentForm.vue";
import type AddDocumentParams from "../../core/params/add.document.params";

const controller = DocumentController.getInstance();
const route = useRoute();
const formKey = route.fullPath;

const params = ref<AddDocumentParams | null>(null);

const saveDocument = async () => {
  if (!params.value) return;
  await controller.create(params.value, undefined, formKey);
};

const updateData = (updatedParams: AddDocumentParams) => {
  params.value = updatedParams;
};
</script>

<template>
  <div class="email-crud-example">
    <DocumentForm :formKey="formKey" @updateData="updateData" />

    <AppButton
      :title="$t('save_document')"
      @click="saveDocument"
      size="sm"
      icon="right"
      type="submit"
    >
      {{ $t("save_document") }}
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
.email-crud-example {
  padding: 20px;
  margin: 0 auto;
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
