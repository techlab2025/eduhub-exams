<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AppButton from "@/shared/HelpersComponents/AppButton.vue";
import IconAccept from "@/shared/icons/IconAccept.vue";
import DocumentController from "../controllers/document.controller";
import DocumentForm from "./DocumentForm.vue";
import ShowDocumentParams from "../../core/params/show.document.params";
import type EditDocumentParams from "../../core/params/edit.document.params";
import type AddDocumentParams from "../../core/params/add.document.params";
import EditDocumentParamsClass from "../../core/params/edit.document.params";

const controller = DocumentController.getInstance();
const route = useRoute();
const formKey = route.fullPath;

const params = ref<EditDocumentParams | null>(null);

const saveDocument = async () => {
  if (!params.value) return;
  await controller.update(params.value, undefined, formKey);
};

const updateData = (updatedParams: AddDocumentParams) => {
  params.value = new EditDocumentParamsClass(
    Number(route.params.id),
    updatedParams.title,
    updatedParams.subject_id,
    updatedParams.stage_id,
    updatedParams.unit_ids,
    updatedParams.document_type_id,
    updatedParams.isAllUnits,
  );
};

onMounted(async () => {
  await controller.fetchOne(new ShowDocumentParams(Number(route.params.id)));
});
</script>

<template>
  <div class="email-crud-example">
    <DocumentForm
      :document="controller.itemData.value!"
      :formKey="formKey"
      @updateData="updateData"
    />

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
