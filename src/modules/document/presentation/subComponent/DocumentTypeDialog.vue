<script lang="ts" setup>
  import { ref } from 'vue';
  import Dialog from 'primevue/dialog';
  import IndexAddIcon from '@/shared/icons/IndexAddIcon.vue';
  import ToggleSwitch from 'primevue/toggleswitch';
  import EditeIcon from '@/shared/icons/DocaumentType/EditeIcon.vue';
  import DeleteIcon from '@/shared/icons/DocaumentType/DeleteIcon.vue';
  import DocumentTypeIcon from '@/shared/icons/DocaumentType/DocumentTypeIcon.vue';
  import AddDocumentDocumentParams from '../../core/params/documntType/add.document.type.params';
  import DocumentTypeController from '../controllers/DocumentType/document.type.controller';

  const visible = ref(false);
  const isMaster = ref<boolean>();
  const DocumentTypeName = ref<string>('');
  const SelectedDocumentType = ref<number>();
  const data = ref([
    {
      id: 1,
      type: 'Books',
      docsNumber: 20,
      status: false,
    },
    {
      id: 2,
      type: 'exams',
      docsNumber: 10,
      status: true,
    },
    {
      id: 3,
      type: 'Textbooks',
      docsNumber: 12,
      status: false,
    },
  ]);
  const ToggleStatus = (id: number) => {
    SelectedDocumentType.value = id;
  };
  const ToggleIsMaster = () => {
    // console.log('ToggleIsMaster');
  };

  const SavenDocumentType = async () => {
    visible.value = false;
    const addDocumentDocumentParams = new AddDocumentDocumentParams({
      isMaster: isMaster.value || false,
      documentTypeId: SelectedDocumentType.value || 0,
      title: DocumentTypeName.value || '',
    });
    const documentTypeController = DocumentTypeController.getInstance();
    await documentTypeController.create(addDocumentDocumentParams);
  };
</script>

<template>
  <button class="btn btn-primary" @click="visible = true">
    <IndexAddIcon />
    <span> document type</span>
  </button>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :pt="{
      root: 'add-document-type-dialog',
      header: 'dialog-header',
      content: 'dialog-body',
    }"
    :style="{ width: '35rem' }"
  >
    <template #header>
      <div class="header-container">
        <DocumentTypeIcon />
        <div class="header-text">
          <h4>Add New Document Type</h4>
          <p>Manage and organize your document categories</p>
        </div>
      </div>
    </template>
    <div class="document-type-content">
      <div v-for="item in data" :key="item.id" class="document-type-row">
        <div class="item-title">
          <span class="item-small-title">doc type</span>
          <span class="item-main-title">{{ item.type }}</span>
        </div>
        <div class="item-statics">
          <span class="item-small-title">doc number</span>
          <span class="item-main-title">{{ item.docsNumber }}</span>
        </div>
        <div class="item-status">
          <ToggleSwitch v-model="item.status" @update:model-value="ToggleStatus(item.id!)" />
        </div>
        <div class="item-actions">
          <EditeIcon />
          <DeleteIcon />
        </div>
      </div>
      <div class="input-wrapper">
        <label for="doc-name">document type name</label>
        <input
          id="doc-name"
          v-model="DocumentTypeName"
          type="text"
          class="input"
          placeholder="Enter document type (e.g. Books, Notes, Worksheets)"
        />
      </div>
      <div class="is-master">
        <span>Is Master Type?</span>
        <ToggleSwitch v-model="isMaster" @update:model-value="ToggleIsMaster" />
      </div>
      <div class="btns">
        <button class="btn btn-primary" @click="SavenDocumentType">save</button>
        <button class="btn btn-secondary" @click="visible = false">cancel</button>
      </div>
    </div>
  </Dialog>
</template>
