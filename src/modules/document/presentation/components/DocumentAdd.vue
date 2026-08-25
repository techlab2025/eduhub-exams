<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import DocumentController from '../controllers/document.controller';
  import DocumentForm from './DocumentForm.vue';
  import type AddDocumentParams from '../../core/params/add.document.params';

  const controller = DocumentController.getInstance();
  const route = useRoute();
  const router = useRouter();

  const formKey = route.fullPath;

  const params = ref<AddDocumentParams | null>(null);
  const loading = ref(false);
  const documentFormRef = ref<{ validate: () => Promise<boolean> } | null>(null);

  const saveDocument = async () => {
    const isFormValid = await documentFormRef.value?.validate?.();
    if (isFormValid === false) return;
    if (!params.value) return;
    loading.value = true;
    try {
      console.log(params, 'params');
      const res = await controller.create(params.value, undefined, formKey);
      if (!res?.error?.displayMessage) {
        router.push({ name: 'Documents' });
      }
    } finally {
      loading.value = false;
    }
  };

  const updateData = (updatedParams: AddDocumentParams) => {
    params.value = updatedParams;
  };
</script>

<template>
  <div class="document-crud-example">
    <DocumentForm
      ref="documentFormRef"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
    />

    <!-- <AppButton :title="$t('save_document')" size="sm" icon="right" type="submit" @click="saveDocument">
      {{ $t('save_document') }}
      <template #icon>
        <IconAccept />
      </template>
</AppButton> -->
    <div class="actions" :class="{ disabled: loading }">
      <button class="btn btn-primary w-full" type="submit" @click="saveDocument">
        <span v-if="loading" class="loader"></span>
        <span v-else>
          {{ $t('save_document') }}
        </span>
      </button>
    </div>

    <div v-if="controller.errorMessage.value" class="error">
      {{ controller.errorMessage.value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .document-crud-example {
    margin: 0 auto;
  }

  .actions {
    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.7;
    }
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
