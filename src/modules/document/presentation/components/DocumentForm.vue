<script setup lang="ts">
  import { ref, watch, computed, nextTick, onMounted } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useFormsStore } from '@/stores/formsStore';
  import AddDocumentParams from '../../core/params/add.document.params';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import DocumentIcon from '@/shared/icons/DocaumentType/DocumentIcon.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import IndexDocumentTypeParams from '../../core/params/documntType/index.document.type.params';
  import DocumentTypeController from '../controllers/DocumentType/document.type.controller';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import HandleFilesUpload, { type UploadedFile } from '@/shared/FormInputs/HandleFilesUpload.vue';
  import UplaodImageInput from '@/shared/icons/UploadImage/UplaodImageInput.vue';
  import FileIcon from '@/shared/icons/UploadImage/FileIcon.vue';
  import DocumentTranslationParams from '../../core/params/translation.params';
  import DeleteTagIcon from '@/shared/icons/DocaumentType/DeleteTagIcon.vue';
  import StageController from '@/modules/Stages/presentation/controllers/stage.controller';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import type BranchesModel from '@/modules/Stages/core/models/branches.model';
  import type DocumentShowModel from '../../core/models/document.show.model';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  // import NewIcon from '@/shared/icons/CustomSelect/NewIcon.vue';

  const emit = defineEmits(['updateData']);

  const { document, formKey, loading } = defineProps<{
    document?: DocumentShowModel;
    formKey?: string;
    loading?: boolean;
  }>();
  const tag = ref<string>('');
  const tags = ref<string[]>([]);
  const FormStore = useFormsStore();
  const { t } = useI18n();

  type DocumentValidationErrors = Partial<
    Record<'title' | 'referenceNumber' | 'documentType' | 'subject' | 'description', string>
  >;

  const validationErrors = ref<DocumentValidationErrors>({});

  onBeforeRouteLeave((to, from) => {
    const savedData = formKey ? FormStore.getFormData(formKey) : null;

    if (savedData && to.path !== from.path && formKey) {
      FormStore.showReturnWarning(formKey);
    }
  });

  const title = ref<Record<string, string>>({});
  const description = ref<Record<string, string>>({});
  const RefrenceNumber = ref<string>('');
  const selectedDocumentType = ref<TitleInterface<number> | null>(null); // const selectedBranch = ref<BranchesModel | null>(null);
  const selectedSubject = ref<TitleInterface<number> | null>(null);
  const allStages = ref<StageModel[]>([]);
  const indexDocumentTypeParams = new IndexDocumentTypeParams('', 1, 10, 0);
  const documentTypeController = DocumentTypeController.getInstance();
  const stageController = StageController.getInstance();
  const UploadedImage = ref<string>();
  const UploadedFiles = ref<string>();
  const FetchStages = async () => {
    await stageController.fetchList(indexDocumentTypeParams);
    allStages.value = (stageController.listData.value ?? []) as StageModel[];
  };
  onMounted(async () => {
    FetchStages();
  });

  const flattenFirstBranchSubjects = (branches: BranchesModel[]): TitleInterface<number>[] => {
    return branches.flatMap((branch) => {
      const firstSubject = branch.subjects?.[0];
      const currentOption = firstSubject
        ? [
            new TitleInterface<number>({
              id: firstSubject.id,
              title: firstSubject.full_title ?? firstSubject.title,
              subtitle: branch.id,
            }),
          ]
        : [];

      return [...currentOption, ...flattenFirstBranchSubjects(branch.children ?? [])];
    });
  };

  const branchOptions = computed<TitleInterface<number>[]>(() => {
    return allStages.value.flatMap((stage) => flattenFirstBranchSubjects(stage.branches));
  });

  const selectedBranchTitle = ref<TitleInterface<number>>();

  const hasTranslation = (value: Record<string, string>) =>
    Object.values(value).some((translation) => translation?.trim());

  const getValidationErrors = (): DocumentValidationErrors => {
    const errors: DocumentValidationErrors = {};

    if (!hasTranslation(title.value)) errors.title = t('document_name_required');
    if (!RefrenceNumber.value.trim()) {
      errors.referenceNumber = t('document_reference_number_required');
    }
    if (!selectedDocumentType.value?.id) {
      errors.documentType = t('document_type_required');
    }
    if (!selectedBranchTitle.value?.id || !selectedBranchTitle.value?.subtitle) {
      errors.subject = t('document_subject_required');
    }
    if (!hasTranslation(description.value)) {
      errors.description = t('document_description_required');
    }

    return errors;
  };

  const refreshVisibleValidation = () => {
    if (Object.keys(validationErrors.value).length) {
      validationErrors.value = getValidationErrors();
    }
  };

  const validate = async (): Promise<boolean> => {
    validationErrors.value = getValidationErrors();
    if (!Object.keys(validationErrors.value).length) return true;

    dialogManager.toastWarning(t('document_required_fields_warning'), {
      title: t('invalid_input_warning_title'),
    });
    await nextTick();
    window.document.querySelector<HTMLElement>('[data-document-error]')?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'center',
    });
    return false;
  };

  defineExpose({ validate });

  const updateData = () => {
    const params = new AddDocumentParams({
      translations: new DocumentTranslationParams({
        description: description.value,
        title: title.value,
      }),
      documentTypeId: selectedDocumentType.value?.id || 0,
      stage_id: selectedBranchTitle.value?.subtitle || 0,
      subjects: selectedBranchTitle.value?.id || 0,
      files: UploadedFiles.value || '',
      images: UploadedImage.value || '',
      refNumber: RefrenceNumber.value,
      tags: tags.value,
    });

    refreshVisibleValidation();
    emit('updateData', params);
  };

  watch(
    () => document,
    (newDoc) => {
      if (!newDoc) return;

      title.value = newDoc.translations.title;

      if (UploadedImage.value !== newDoc.images) {
        UploadedImage.value = newDoc.images;
      }
      if (UploadedFiles.value !== newDoc.files) {
        UploadedFiles.value = newDoc.files;
      }

      RefrenceNumber.value = newDoc.RefNumber;
      selectedBranchTitle.value = new TitleInterface({
        id: newDoc.subject.id,
        title: `${newDoc.stage.title} → ${newDoc.subject.title}`,
        subtitle: newDoc.stage.id,
      });
      selectedSubject.value = new TitleInterface({
        id: newDoc.subject.id,
        title: newDoc.subject.title,
      });
      selectedDocumentType.value = new TitleInterface({
        id: newDoc.documentType.id,
        title: newDoc.documentType.title,
      });
      tags.value = [...newDoc.tags];
      description.value = { ...newDoc.description };
      updateData();
    },
    { immediate: true },
  );

  const handleBranchChange = (selected: TitleInterface<number> | undefined) => {
    selectedBranchTitle.value = selected;
    updateData();
  }; // const handleImageChange = (files: UploadedFile[]) => {
  //   UploadedImage.value = files?.[0]?.base64;
  //   updateData();
  // };
  // const handleFilsChange = (files: UploadedFile[]) => {
  //   UploadedFiles.value = files?.[0]?.base64;
  //   updateData();
  // };

  const handleImageChange = (files: UploadedFile[]) => {
    if (files.length === 0) {
      UploadedImage.value = '';
    } else {
      UploadedImage.value = files[0]?.base64 || files[0]?.url || '';
    }
    updateData();
  };

  const handleFilsChange = (files: UploadedFile[]) => {
    if (files.length === 0) {
      UploadedFiles.value = '';
    } else {
      UploadedFiles.value = files[0]?.base64 || files[0]?.url || '';
    }
    updateData();
  };

  const setTags = () => {
    if (tag.value.length > 0) {
      tags.value.push(tag.value);

      tag.value = '';
    }
  };

  const deletetag = (tagId: number) => {
    tags.value.splice(tagId, 1);
  };
  // const DocumentTypeDialog = ref(false);
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

    <div class="form-fields" :class="{ disabled: loading }">
      <div class="field-group required-field">
        <MultiLangInput
          :field-key="`title`"
          :label="$t(`Document_name`)"
          :languages="['en', 'ar']"
          :model-value="title"
          :type="`title`"
          @update:model-value="
            title = $event;
            updateData();
          "
        />
        <small v-if="validationErrors.title" class="document-field-error" data-document-error>
          {{ validationErrors.title }}
        </small>
      </div>

      <div
        class="field-group required-field col-span-1 ref-number-group"
        :class="{ 'disabled-input': document?.RefNumber }"
      >
        <label class="field-label" for="doc-ref">{{ $t('Reference_Number') }}</label>

        <div class="input-wrap">
          <input
            id="doc-ref"
            v-model="RefrenceNumber"
            type="number"
            :placeholder="$t('enter_refrence_number')"
            class="field-input"
            @input="updateData"
          />
        </div>
        <small
          v-if="validationErrors.referenceNumber"
          class="document-field-error"
          data-document-error
        >
          {{ validationErrors.referenceNumber }}
        </small>
      </div>

      <div class="field-group required-field select-group col-span-2">
        <UpdatedCustomInputSelect
          id="documentType"
          :class="`field-input`"
          :label="`Document Type`"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController as any"
          :model-value="selectedDocumentType"
          :relaod="false"
          :placeholder="$t('enter your document type')"
          @update:model-value="
            selectedDocumentType = $event;
            updateData();
          "
        />
        <small
          v-if="validationErrors.documentType"
          class="document-field-error"
          data-document-error
        >
          {{ validationErrors.documentType }}
        </small>
        <!-- @close="DocumentTypeDialog = false"
          :isDialog="true"
          v-model:dialogVisible="DocumentTypeDialog"
        >
          <template #reloadHeader>
            <span class="add-dialog" @click="DocumentTypeDialog = true"> <NewIcon /></span>
          </template>
          <template #Dialog>
            <DocumentTypeDialog />
          </template>
        </UpdatedCustomInputSelect> -->
      </div>

      <div class="field-group required-field col-span-2">
        <UpdatedCustomInputSelect
          id="doc-branch"
          v-model="selectedBranchTitle"
          :label="`subject name`"
          :static-options="branchOptions"
          :placeholder="$t('Enter subject name')"
          :reload="true"
          @update:model-value="handleBranchChange($event)"
          @reload="FetchStages"
        />
        <small v-if="validationErrors.subject" class="document-field-error" data-document-error>
          {{ validationErrors.subject }}
        </small>
      </div>

      <div class="field-group required-field col-span-2">
        <MultiLangInput
          :field-key="`description`"
          :label="$t(`Description`)"
          :languages="['en', 'ar']"
          :model-value="description"
          :type="`description`"
          @update:model-value="
            description = $event;
            updateData();
          "
        />
        <small v-if="validationErrors.description" class="document-field-error" data-document-error>
          {{ validationErrors.description }}
        </small>
      </div>

      <div class="field-group tags-group col-span-2">
        <label class="field-label" for="tag">{{ $t('Tag') }}</label>

        <div class="input-wrap input-tag-wrap">
          <input
            id="tags"
            v-model="tag"
            type="text"
            :placeholder="$t('Add Tag....')"
            class="field-input"
            @input="updateData"
          />

          <button class="btn btn-primary" @click="setTags">{{ $t('Add Tag') }}</button>
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
          @change="handleImageChange"
        >
          <template #content>
            <div class="add-imaegs-data">
              <UplaodImageInput />
              <p class="first-text">
                {{ $t('Click to upload') }}
                <span>{{ $t('or drag and drop') }}</span>
              </p>

              <p class="second-text">{{ $t('JPG, JPEG, PNG less than 1MB') }}</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>

      <div class="field-group col-span-2">
        <HandleFilesUpload
          :label="`upload document`"
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
                <span>{{ $t('Click to upload') }}</span>

                {{ $t('the Main Document') }}
              </p>

              <p class="second-text">{{ $t('PDF, DOCX,ZIP less than 1MB') }}</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  :deep(.p-select-label) {
    padding: 0 !important;
  }

  .disabled-input {
    pointer-events: none;
    opacity: 0.5;
  }

  .add-dialog {
    cursor: pointer;
  }

  .document-field-error {
    color: var(--danger-color);
    font-size: 12px;
    font-weight: 400;
  }
</style>
