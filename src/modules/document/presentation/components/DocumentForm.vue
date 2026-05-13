<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type DocumentModel from '../../core/models/document.model';
  import AddDocumentParams from '../../core/params/add.document.params';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
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
  import StageController from '@/modules/Stages/presentation/controllers/stage.controller';
  import SubjectController from '@/modules/Subjects/presentation/controllers/subject.controller';

  const emit = defineEmits(['updateData']);

  const { document, formKey } = defineProps<{
    document?: DocumentModel;
    formKey?: string;
  }>();

  const FormStore = useFormsStore();
  onBeforeRouteLeave((to, from) => {
    const savedData = formKey ? FormStore.getFormData(formKey) : null;
    if (savedData && to.path !== from.path && formKey) {
      FormStore.showReturnWarning(formKey);
    }
  });

  // Form state
  const title = ref<Record<string, string>>({});
  const description = ref<Record<string, string>>({});
  const RefrenceNumber = ref<string>('');
  const selectedDocumentType = ref<TitleInterface<number | string> | null>(null);
  const selectedStage = ref<TitleInterface<number | string> | null>(null);
  const selectedSubject = ref<TitleInterface<number | string> | null>(null);
  const indexDocumentTypeParams = new IndexDocumentTypeParams('', 1, 10, 0);
  const documentTypeController = DocumentTypeController.getInstance();
  const stageController = StageController.getInstance();
  const subjectController = SubjectController.getInstance();
  const UploadedImage = ref<string[]>([]);
  const UploadedFiles = ref<string[]>([]);

  watch(
    () => document,
    (newDoc) => {
      if (newDoc) {
        title.value = newDoc.tranaslations.title;
        selectedDocumentType.value = newDoc.doecumentType;
        description.value = newDoc.tranaslations.description;
        UploadedImage.value = newDoc.images;
        UploadedFiles.value = newDoc.files;
        RefrenceNumber.value = newDoc.RefNumber;
      }
    },
    { immediate: true },
  );

  const updateData = () => {
    const params = new AddDocumentParams({
      translations: new DocumentTranslationParams({ description: description.value , title:title.value}),
      documentTypeId: selectedDocumentType.value?.id || 0,
      stage_id: selectedStage.value?.id || 0,
      subjects: selectedSubject.value?.id || 0,
      files: UploadedFiles.value.map((el: any) => el?.base64 || ''),
      images: UploadedImage.value.map((el: any) => el?.base64 || ''),
      refNumber: RefrenceNumber.value,
      tags: tags.value,
    });
    emit('updateData', params);
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
    updateData();
  };

  const handleFilsChange = (files: any[]) => {
    UploadedFiles.value = files;
    updateData();
  };
  const tag = ref<string>('');
  const tags = ref<string[]>([]);

  const setTags = () => {
    if (tag.value.length > 0) {
      tags.value?.push(tag.value);
      tag.value = '';
    }
  };
  const deletetag = (tagId: number) => {
    tags.value.splice(tagId, 1);
  };
</script>

<template>
  <div class="document-form-card">
    <div class="document-form-header">
      <DocumentIcon />
      <div class="document-form-header-text">
        <h4>{{ $t('add_document') }}</h4>
        <p>{{ $t('Upload your document and fill in its details') }}</p>
      </div>
    </div>

    <div class="form-fields">
      <!-- Title -->
      <div class="field-group">
        <!-- <label class="field-label" for="doc-title">{{ $t('Document_name') }}</label>
        <div class="input-wrap">
          <input
            id="doc-title"
            v-model="title"
            type="text"
            :placeholder="$t('enter_document_name')"
            class="field-input"
            @input="updateData"
          />
        </div> -->
         <MultiLangInput :field-key="`title`" :label="$t(`Document_name`)" :languages="['en', 'ar']"
          :model-value="title" :type="`title`" @update:model-value="title = $event; updateData()" />
      </div>

      <!-- Ref Number -->
      <div class="field-group col-span-1">
        <label class="field-label" for="doc-ref">{{ $t('Reference_Number') }}</label>
        <div class="input-wrap">
          <input
            id="doc-ref"
            v-model="RefrenceNumber"
            type="text"
            :placeholder="$t('enter_refrence_number')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <!-- document type -->
      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="documentType"
          :label="`Document Type`"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController"
          :model-value="selectedDocumentType"
          :placeholder="$t('Document Type')"
          @update:model-value="selectedDocumentType = $event; updateData()"
        />
      </div>

      <!-- Stage -->
      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="doc-stage"
          :label="`Stage Name`"
          :params="indexDocumentTypeParams"
          :controller="stageController"
          :model-value="selectedStage"
          :placeholder="$t('Stage Type')"
          @update:model-value="selectedStage = $event; updateData()"
        />
      </div>

      <!-- Subject ID -->
      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`Subject Name`"
          :params="indexDocumentTypeParams"
          :controller="subjectController"
          :model-value="selectedSubject"
          :placeholder="$t('Subject Type')"
          @update:model-value="selectedSubject = $event; updateData()"
        />
      </div>

      <div class="field-group col-span-2">
        <MultiLangInput
          :field-key="`description`"
          :label="$t(`Description`)"
          :languages="['en', 'ar']"
          :model-value="description"
          :type="`description`"
          @update:model-value="description = $event; updateData()"
        />
      </div>
      <div class="field-group tags-group col-span-2">
        <label class="field-label" for="tag">{{ $t('tag') }}</label>
        <div class="input-wrap input-tag-wrap">
          <input
            id="tags"
            v-model="tag"
            type="text"
            :placeholder="$t('enter_refrence_number')"
            class="field-input"
            @input="updateData"
          />
          <button class="btn btn-primary" @click="setTags">{{ $t('add tag') }}</button>
        </div>

        <div class="tags-container" :class="tags.length > 0 ? `border` : ``">
          <div v-for="(tagItem, tagIndex) in tags" :key="tagIndex" class="tag">
            <span>{{ tagItem }}</span>
            <DeleteTagIcon class="delete" @click="deletetag(tagIndex)" />
          </div>
        </div>
      </div>

      <div class="field-group col-span-2">
        <HandleFilesUpload
          :label="`upload image`"
          accept="image/*"
          :multiple="true"
          :index="1"
          :file="UploadedImage"
          :have-content="true"
          :class="`image-input`"
          @update:model-value="handleImageChange"
        >
          <template #content>
            <div class="add-imaegs-data">
              <UplaodImageInput />
              <p class="first-text">
                {{ $t('Click to upload') }} <span>{{ $t('or drag and drop') }}</span>
              </p>
              <p class="second-text">{{ $t('JPG, JPEG, PNG less than 1MB') }}</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>

      <div class="field-group col-span-2">
        <HandleFilesUpload
          :label="`upload image`"
          accept=".pdf"
          :multiple="true"
          :index="2"
          :file="UploadedFiles"
          :have-content="true"
          :class="`image-input`"
          @change="handleFilsChange"
        >
          <template #content>
            <div class="add-imaegs-data">
              <FileIcon />
              <p class="first-text">
                <span>{{ $t('Click to upload') }}</span
                >{{ $t('the Main Document') }}
              </p>
              <p class="second-text">{{ $t('PDF, DOCX,ZIP less than 1MB') }}</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>
    </div>
  </div>
</template>
