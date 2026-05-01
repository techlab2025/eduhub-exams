<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AppButton from '@/shared/HelpersComponents/AppButton.vue';
import IconAccept from '@/shared/icons/IconAccept.vue';
import DocumentController from '../controllers/document.controller';
import DocumentForm from './DocumentForm.vue';
import type AddDocumentParams from '../../core/params/add.document.params';

const controller = DocumentController.getInstance();
const route = useRoute();
const formKey = route.fullPath;

const params = ref<AddDocumentParams | null>(null);

const saveDocument = async () => {
  if (!params.value) return;
  console.log(params, "params")
  await controller.create(params.value, undefined, formKey);
};

const updateData = (updatedParams: AddDocumentParams) => {
  params.value = updatedParams;
};
</script>

<template>
  <div class="document-crud-example">
    <DocumentForm :form-key="formKey" @update-data="updateData" />

    <!-- <AppButton :title="$t('save_document')" size="sm" icon="right" type="submit" @click="saveDocument">
      {{ $t('save_document') }}
      <template #icon>
        <IconAccept />
      </template>
</AppButton> -->
    <button class="btn btn-primary w-full" type="submit" @click="saveDocument">Save document</button>

    <div v-if="controller.errorMessage.value" class="error">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped>
.document-crud-example {
  margin: 0 auto;
}

.error {
  margin-top: 20px;
  padding: 10px;
  background-color: var(--danger-light);
  color: var(--danger-dark);
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
