<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import IndexAddIcon from '@/shared/icons/IndexAddIcon.vue';
import ToggleSwitch from 'primevue/toggleswitch';
import EditeIcon from '@/shared/icons/DocaumentType/EditeIcon.vue';
import DeleteIcon from '@/shared/icons/DocaumentType/DeleteIcon.vue';
import DocumentTypeIcon from '@/shared/icons/DocaumentType/DocumentTypeIcon.vue';
import DocumentTypeController from '../controllers/DocumentType/document.type.controller';
import IndexDocumentTypeParams from '../../core/params/documntType/index.document.type.params';
import { useRoute } from 'vue-router';
import DeleteDocumentTypeParams from '../../core/params/documntType/delete.document.type.params';
import MultiLangInput from '@/shared/MultiLangInput.vue';
import AddDocumentTypeParams from '../../core/params/documntType/add.document.type.params';
import DocumentTranslationTypeParams from '../../core/params/documntType/translation.params';
import type DocumentModel from '../../core/models/document.model';
import EditDocumentTypeParams from '../../core/params/documntType/edit.document.type.params';
import type DocumentTypeModel from '../../core/models/documentType/document.type.model';
import ShowDocumentTypeParams from '../../core/params/documntType/show.document.type.params';

const controller = DocumentTypeController.getInstance();
const state = computed(() => controller.listState.value);

const route = useRoute();

const visible = ref(false);
const isMaster = ref<boolean>();
const DocumentTypeName = ref<Record<string, string>>({
  en: '',
  ar: '',
});
const SelectedDocumentType = ref<number>();
const ToggleIsMaster = () => {
  // console.log('ToggleIsMaster');
};

const resetForm = () => {
  SelectedDocumentType.value = undefined;
  DocumentTypeName.value = { en: '', ar: '' };
};

const SavenDocumentType = async () => {
  if (SelectedDocumentType.value) {
    const params = new EditDocumentTypeParams({
      document_type_id: String(SelectedDocumentType.value),
      translations: new DocumentTranslationTypeParams({
        title: DocumentTypeName.value,
      }),
    });
    await controller.update(params);
  } else {
    const params = new AddDocumentTypeParams({
      translations: new DocumentTranslationTypeParams({
        title: DocumentTypeName.value,
      }),
    });
    await controller.create(params);
  }
  await fetchDocumentTypes();
  resetForm();
};

const fetchDocumentTypes = async (
  page: number = 1,
  searchWord: string = '',
) => {
  await controller.fetchList(
    new IndexDocumentTypeParams(
      searchWord,
      route.query.page ? Number(route.query.page) : page,
      10,
      1,
    ),
  );
};

onMounted(async () => {
  await fetchDocumentTypes();
});
const deleteDocumentType = async (id: number) => {
  await controller.delete(new DeleteDocumentTypeParams({ document_id: id }));
  await fetchDocumentTypes();
};
const editDocumentType = async (data: DocumentTypeModel) => {
  const res = await controller.fetchOne(new ShowDocumentTypeParams({ document_type_id: data.id! }))
  DocumentTypeName.value = res.data?.title; 
};

const cancel = () => {
  visible.value = false;
  resetForm();
};
</script>

<template>
  <button class="btn btn-primary" @click="visible = true">
    <IndexAddIcon />
    <span> {{ $t('document_type') }}</span>
  </button>
  <Dialog v-model:visible="visible" :modal="true" :pt="{
    root: 'add-document-type-dialog',
    header: 'dialog-header',
    content: 'dialog-body',
  }" :style="{ width: '35rem' }">
    <template #header>
      <div class="header-container">
        <DocumentTypeIcon />
        <div class="header-text">
          <h4>{{ SelectedDocumentType ? $t('edit_document_type') : $t('add_new_document_type') }}</h4>
          <p>{{ $t('manage_and_organize_your_document_categories') }}</p>
        </div>
      </div>
    </template>
    <div class="document-type-content">

      <div v-for="item in state.data" :key="item.id" class="document-type-row">
        <div class="item-title">
          <span class="item-small-title">{{ $t('document_type') }}</span>
          <span class="item-main-title">{{ item.title }}</span>
        </div>
        <div class="item-actions">
          <EditeIcon @click="editDocumentType(item)" />
          <DeleteIcon @click="deleteDocumentType(item.id!)" />

        </div>
      </div>
      <div class="input-wrapper">
        <MultiLangInput :field-key="`title`" :label="$t(`document_type_name`)" :languages="['en', 'ar']"
          :model-value="DocumentTypeName" :type="`title`" @update:model-value="DocumentTypeName = $event" />
      </div>
      <div class="is-master">
        <span>{{ $t('is_master') }}</span>
        <ToggleSwitch v-model="isMaster" @update:model-value="ToggleIsMaster" />
      </div>
      <div class="btns">
        <button class="btn btn-primary" @click="SavenDocumentType">
          {{ SelectedDocumentType ? $t('save') : $t('save') }}
        </button>
        <button class="btn btn-secondary" @click="cancel">{{ $t('cancel') }}</button>
      </div>
    </div>
  </Dialog>
</template>
