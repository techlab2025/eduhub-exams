<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useFormsStore } from '@/stores/formsStore';
import type DocumentModel from '../../core/models/document.model';
import AddDocumentParams from '../../core/params/add.document.params';
import TitleInterface from '@/base/Data/Models/titleInterface';
import DocumentIcon from '@/shared/icons/DocaumentType/DocumentIcon.vue';
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
import IndexDocumentTypeParams from '../../core/params/documntType/index.document.type.params';
import DocumentTypeController from '../controllers/DocumentType/document.type.controller';
import MultiLangInput from '@/shared/MultiLangInput.vue';
import HandleFilesUpload from '@/shared/FormInputs/HandleFilesUpload.vue';
import UplaodImageInput from '@/shared/icons/UploadImage/UplaodImageInput.vue';
import FileIcon from '@/shared/icons/UploadImage/FileIcon.vue';
import DocumentTranslationParams from '../../core/params/translation.params';
import DeleteTagIcon from '@/shared/icons/DocaumentType/DeleteTagIcon.vue';

const emit = defineEmits(['updateData']);

const { document, formKey } = defineProps<{
  document?: DocumentModel;
  formKey?: string;
}>();

const FormStore = useFormsStore();
onBeforeRouteLeave((to, from) => {
  const savedData = FormStore.getFormData(formKey!);
  if (savedData && to.path !== from.path) {
    FormStore.showReturnWarning(formKey!);
  }
});


// Form state
const title = ref<string>('');
const description = ref<Record<string, string>>({});
const RefrenceNumber = ref<string>('');
const selectedDocumentType = ref<TitleInterface<number> | null>(null);
const indexDocumentTypeParams = new IndexDocumentTypeParams("", 1, 10, 0)
const documentTypeController = DocumentTypeController.getInstance()
const UploadedImage = ref<string[]>([]);
const UploadedFiles = ref<string[]>([]);

watch(
  () => document,
  (newDoc) => {
    if (newDoc) {
      title.value = newDoc.dovumentName;
      selectedDocumentType.value = newDoc.doecumentType;
      description.value = newDoc.tranaslations.description;
      UploadedImage.value = newDoc.images
      UploadedFiles.value = newDoc.files
    }
  },
  { immediate: true },
);

const updateData = () => {
  // console.log(selectedDocumentType.value, "selectedDocumentType.value")
  // FormStore.setFormData(formKey!, {
  //   title: title.value,
  //   translations: new DocumentTranslationParams({ description: description.value }),
  //   documentTypeId: selectedDocumentType.value?.id!,
  //   files: UploadedFiles.value,
  //   images: UploadedImage.value,
  //   refNumber: RefrenceNumber.value,
  //   subjects: [],
  //   tags: []
  // });

  const params = new AddDocumentParams({
    title: title.value,
    translations: new DocumentTranslationParams({ description: description.value }),
    documentTypeId: selectedDocumentType.value?.id!,
    files: UploadedFiles.value.map((el) => el?.base64!),
    images: UploadedImage.value.map((el) => el?.base64!),
    refNumber: RefrenceNumber.value,
    subjects: [],
    tags: tags.value

  });
  emit('updateData', params);
};

const resetForm = () => {
  title.value = ''
  description.value = {}
  selectedDocumentType.value = null
  UploadedFiles.value = [];
  UploadedImage.value = [];
  RefrenceNumber.value = '';
};

// onMounted(() => {
//   const saved = FormStore.getFormData(formKey!);
//   if (saved) {
//     title.value = saved.title ?? '';
//     subjectId.value = saved.subjectId ?? 0;
//     stageId.value = saved.stageId ?? 0;
//     unitIds.value = saved.unitIds ?? [];
//     isAllUnits.value = saved.isAllUnits ?? false;
//     selectedDocumentType.value =
//       documentTypeOptions.find((o) => o.id === saved.documentTypeId) ?? null;
//     updateData();
//   } else {
//     resetForm();
//   }
// });



const handleImageChange = (files: []) => {
  UploadedImage.value = files;
  updateData()
};

const handleFilsChange = (files: []) => {
  UploadedFiles.value = files;
  updateData()

};
const tag = ref<string>('')
const tags = ref<string[]>([])

const setTags = () => {
  if (tag.value.length > 0) {
    tags.value?.push(tag.value)
    tag.value = ''
  }
}
const deletetag = (tagId: number) => {
  tags.value.splice(tagId, 1)
}
</script>

<template>
  <div class="document-form-card">
    <div class="document-form-header">
      <DocumentIcon />
      <div class="document-form-header-text">
        <h4>Add document</h4>
        <p>Upload your document and fill in its details</p>
      </div>
    </div>

    <div class="form-fields">
      <!-- Title -->
      <div class="field-group">
        <label class="field-label" for="doc-title">{{ $t('Document_name') }}</label>
        <div class="input-wrap">
          <input id="doc-title" v-model="title" type="text" :placeholder="$t('enter_document_name')" class="field-input"
            @input="updateData" />
        </div>
      </div>

      <!-- Ref Number -->
      <div class="field-group col-span-1">
        <label class="field-label" for="doc-stage">{{ $t('Reference_Number') }}</label>
        <div class="input-wrap">
          <input id="doc-stage" v-model="RefrenceNumber" type="text" :placeholder="$t('enter_refrence_number')"
            class="field-input" @input="updateData" />
        </div>
      </div>

      <!-- document type -->
      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect id="documentType" :label="`Document Type`" :params="indexDocumentTypeParams"
          :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Document Type"
          @update:model-value="updateData" />
      </div>

      <!-- Subject ID -->
      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect id="doc-subject" :label="`Subject Name`" :params="indexDocumentTypeParams"
          :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
          @update:model-value="updateData" />
      </div>

      <div class="field-group col-span-2">
        <MultiLangInput :field-key="`descriptnio`" :label="$t(`Description`)" :languages="['en', 'ar']"
          :model-value="description" @update:model-value="description = $event" :type="`description`" />
      </div>
      <div class="field-group tags-group col-span-2">
        <label class="field-label" for="tag">{{ $t('tag') }}</label>
        <div class="input-wrap">
          <input id="tags" v-model="tag" type="text" :placeholder="$t('enter_refrence_number')" class="field-input"
            @input="updateData" />
          <button class="btn btn-primary" @click="setTags">add tag</button>
        </div>

        <div class="tags-container" :class="tags.length > 0 ? `border` : ``">
          <div class="tag" v-for="(tag, index) in tags">
            <span>{{ tag }}</span>
            <DeleteTagIcon @click="deletetag(index)" class="delete" />
          </div>
        </div>
      </div>


      <div class="field-group col-span-2">
        <HandleFilesUpload :label="`upload image`" accept="image/*" :multiple="true" :index="1" :file="UploadedImage"
          :have-content="true" :class="`image-input`" @change="handleImageChange">
          <template #content>
            <div class="add-imaegs-data">
              <UplaodImageInput />
              <p class="first-text"><span>Click to upload</span>or drag and drop</p>
              <p class="second-text">JPG, JPEG, PNG less than 1MB</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>

      <div class="field-group col-span-2">
        <HandleFilesUpload :label="`upload image`" accept=".pdf" :multiple="true" :index="2" :file="UploadedFiles"
          :have-content="true" :class="`image-input`" @change="handleFilsChange">
          <template #content>
            <div class="add-imaegs-data">
              <FileIcon />
              <p class="first-text"><span>Click to upload</span>the Main Document</p>
              <p class="second-text">PDF, DOCX,ZIP less than 1MB</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>

    </div>
  </div>
</template>
