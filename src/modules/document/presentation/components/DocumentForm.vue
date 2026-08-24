<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue';
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
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import type DocumentShowModel from '../../core/models/document.show.model';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  import FullSubjectTreeController from '@/modules/Questions/presentation/controllers/FullSubjectTree/full.subject.tree.controller';
  import SubjectController from '@/modules/Subjects/presentation/controllers/subject.controller';
  import { EducationClassificationController } from '@/modules/EducationClassification';
  import IndexEducationClassificationParams from '@/modules/EducationClassification/core/params/index.educationClassification.params';
  import IndexEducationClassificationBranchesParams from '@/modules/Subjects/core/params/index.educationClassificationBranches.params';
  import FullSubjectTreeParams from '@/modules/Questions/core/params/FullSubjectTree/full.subject.tree.params';
  import flattenSubjectBranchTree from '@/modules/Questions/core/SubjectTreeSelectHelper';
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
  const selectedEducationClassification = ref<TitleInterface<number> | null>(null);
  const selectedBranch = ref<TitleInterface<number> | null>(null);
  const selectedSubject = ref<TitleInterface<number> | null>(null);
  const branchOptions = ref<TitleInterface<number>[]>([]);
  const subjectOptions = ref<TitleInterface<number>[]>([]);
  const indexDocumentTypeParams = new IndexDocumentTypeParams('', 1, 10, 0);
  const documentTypeController = DocumentTypeController.getInstance();
  const UploadedImage = ref<string>();
  const UploadedFiles = ref<string>();

  const hasTranslation = (value: Record<string, string>) =>
    Object.values(value).some((translation) => translation?.trim());

  const mapBranchSubjectOptions = (branches: StageModel[]): TitleInterface<number>[] =>
    branches.flatMap((branch) => {
      if (branch.children.length > 0) return mapBranchSubjectOptions(branch.children);

      const branchId = branch.e_c_branch_id ?? branch.id;
      if (!branchId) return [];

      if (!branch.subjects?.length) {
        return [new TitleInterface({ id: branchId, title: branch.full_title || branch.title })];
      }

      return branch.subjects.flatMap((subject) => {
        const subjectId = subject.e_c_subject_id ?? subject.id;
        if (!subjectId) return [];

        const subjectTitle = subject.full_title || subject.title;
        const branchTitle = branch.full_title || branch.title;
        const title = subject.full_title || `${branchTitle} -> ${subjectTitle}`;

        return [new TitleInterface({ id: branchId, title, subtitle: subjectId })];
      });
    });

  const getBranchDefaultSubject = (
    branch: TitleInterface<number> | null,
  ): TitleInterface<number> | null =>
    branch?.subtitle ? new TitleInterface({ id: branch.subtitle, title: branch.title }) : null;

  const getValidationErrors = (): DocumentValidationErrors => {
    const errors: DocumentValidationErrors = {};

    if (!hasTranslation(title.value)) errors.title = t('document_name_required');
    if (!String(RefrenceNumber.value)?.trim()) {
      errors.referenceNumber = t('document_reference_number_required');
    }
    if (!selectedDocumentType.value?.id) {
      errors.documentType = t('document_type_required');
    }
    if (!selectedBranch.value?.id || !selectedSubject.value?.id) {
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
      stage_id: selectedBranch.value?.id || 0,
      subjects: selectedSubject.value?.id || 0,
      files: UploadedFiles.value || '',
      images: UploadedImage.value || '',
      refNumber: RefrenceNumber.value,
      tags: tags.value,
    });
    // RefrenceNumber?.value

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
      selectedBranch.value = new TitleInterface({
        id: newDoc.stage.id,
        title: newDoc.stage.title,
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

  const handleEducationClassificationChange = async (
    selected: TitleInterface<number> | null | undefined,
  ) => {
    selectedEducationClassification.value = selected ?? null;
    selectedBranch.value = null;
    selectedSubject.value = null;
    branchOptions.value = [];
    subjectOptions.value = [];

    if (selectedEducationClassification.value?.id) {
      const requestedClassificationId = selectedEducationClassification.value.id;
      const result = await fullBranchTreeController.fetchList(
        new IndexEducationClassificationBranchesParams({
          educationClassificationId: requestedClassificationId,
          withSubjects: true,
        }),
      );
      if (selectedEducationClassification.value?.id !== requestedClassificationId) return;
      const branches = (result?.data ?? []) as StageModel[];
      branchOptions.value = mapBranchSubjectOptions(branches);
    }
    updateData();
  };

  const handleBranchChange = async (selected: TitleInterface<number> | null | undefined) => {
    selectedBranch.value = selected ?? null;
    selectedSubject.value = getBranchDefaultSubject(selectedBranch.value);
    subjectOptions.value = [];

    if (selectedBranch.value?.id) {
      const requestedBranchId = selectedBranch.value.id;
      const requestedParentId = selectedBranch.value.subtitle;
      const result = await fullSubjectTreeController.fetchList(
        new FullSubjectTreeParams({ id: requestedBranchId, parentId: requestedParentId }),
      );
      if (
        selectedBranch.value?.id !== requestedBranchId ||
        selectedBranch.value.subtitle !== requestedParentId
      ) {
        return;
      }
      subjectOptions.value = flattenSubjectBranchTree((result?.data ?? []) as StageModel[]);
    }
    updateData();
  };

  const handleSubjectChange = (selected: TitleInterface<number> | null | undefined) => {
    selectedSubject.value = selected ?? getBranchDefaultSubject(selectedBranch.value);
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

  const fullSubjectTreeController = FullSubjectTreeController.getInstance();
  const fullBranchTreeController = SubjectController.getInstance();
  const educationClassificationController = EducationClassificationController.getInstance();
  const educationClassificationParams = new IndexEducationClassificationParams({
    pageNumber: 1,
    perPage: 100,
    withPage: 0,
  });
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
          id="document-education-classification"
          v-model="selectedEducationClassification"
          :label="$t('education_classification_name')"
          :controller="educationClassificationController as any"
          :params="educationClassificationParams"
          :placeholder="$t('select_education_classification')"
          :reload="true"
          @update:model-value="handleEducationClassificationChange($event)"
        />
      </div>
      <div class="field-group required-field col-span-2">
        <UpdatedCustomInputSelect
          id="document-branch"
          v-model="selectedBranch"
          :label="$t('branch_name')"
          :static-options="branchOptions"
          :placeholder="$t('select_branch')"
          :reload="false"
          :disabled="!selectedEducationClassification"
          @update:model-value="handleBranchChange($event)"
        />
      </div>
      <div v-if="subjectOptions.length > 0" class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="document-subject"
          v-model="selectedSubject"
          :label="$t('subject_name')"
          :static-options="subjectOptions"
          :placeholder="$t('select_subject')"
          :reload="false"
          :disabled="!selectedBranch"
          @update:model-value="handleSubjectChange($event)"
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
