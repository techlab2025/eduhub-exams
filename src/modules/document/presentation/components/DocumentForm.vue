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
    Record<
      | 'title'
      | 'referenceNumber'
      | 'documentType'
      | 'educationClassification'
      | 'branch'
      | 'description',
      string
    >
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
  const imageRemoved = ref(false);
  const fileRemoved = ref(false);

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
    if (!selectedEducationClassification.value?.id) {
      errors.educationClassification = t('document_education_classification_required');
    }
    if (!selectedBranch.value?.id) {
      errors.branch = t('document_branch_required');
    }
    // if (!selectedBranch.value?.id || !selectedSubject.value?.id) {
    //   errors.subject = t('document_subject_required');
    // }
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
    const imagePayload = imageRemoved.value
      ? '*'
      : document && UploadedImage.value === document.images
        ? ''
        : UploadedImage.value || '';
    const filePayload = fileRemoved.value
      ? '*'
      : document && UploadedFiles.value === document.files
        ? ''
        : UploadedFiles.value || '';
    const params = new AddDocumentParams({
      translations: new DocumentTranslationParams({
        description: description.value,
        title: title.value,
      }),
      documentTypeId: selectedDocumentType.value?.id || 0,
      stage_id: selectedBranch.value?.id || 0,
      subjects: selectedSubject.value?.id || 0,
      files: filePayload,
      images: imagePayload,
      refNumber: RefrenceNumber.value,
      tags: tags.value,
    });
    // RefrenceNumber?.value

    refreshVisibleValidation();
    emit('updateData', params);
  };

  const handleEducationClassificationChange = async (
    selected: TitleInterface<number> | null | undefined,
  ) => {
    selectedEducationClassification.value = selected ?? null;
    selectedBranch.value = null;
    selectedSubject.value = null;
    branchOptions.value = [];
    subjectOptions.value = [];
    refreshVisibleValidation();

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
    refreshVisibleValidation();

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
      imageRemoved.value = Boolean(document?.images);
    } else {
      UploadedImage.value = files[0]?.base64 || files[0]?.url || '';
      imageRemoved.value = false;
    }
    updateData();
  };

  const handleFilsChange = (files: UploadedFile[]) => {
    if (files.length === 0) {
      UploadedFiles.value = '';
      fileRemoved.value = Boolean(document?.files);
    } else {
      UploadedFiles.value = files[0]?.base64 || files[0]?.url || '';
      fileRemoved.value = false;
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

  let restoreRequestId = 0;

  const restoreDocumentSelections = async (newDoc: DocumentShowModel, requestId: number) => {
    const classificationId = newDoc.educationClassification.id;
    const branchId = newDoc.stage.id;
    const subjectId = newDoc.subject.id;
    const subjectParentId = newDoc.subjectParentId ?? subjectId;

    selectedEducationClassification.value = new TitleInterface({
      id: classificationId,
      title: newDoc.educationClassification.title,
    });
    selectedBranch.value = new TitleInterface({
      id: branchId,
      title: newDoc.stage.title,
      subtitle: subjectParentId,
    });
    selectedSubject.value = new TitleInterface({
      id: subjectId,
      title: newDoc.subject.title,
    });
    branchOptions.value = [];
    subjectOptions.value = [];

    if (classificationId) {
      const branchResult = await fullBranchTreeController.fetchList(
        new IndexEducationClassificationBranchesParams({
          educationClassificationId: classificationId,
          withSubjects: true,
        }),
      );
      if (requestId !== restoreRequestId) return;

      branchOptions.value = mapBranchSubjectOptions((branchResult?.data ?? []) as StageModel[]);
      const matchedBranch =
        branchOptions.value.find(
          (option) => option.id === branchId && option.subtitle === subjectParentId,
        ) ?? branchOptions.value.find((option) => option.id === branchId);

      if (matchedBranch) {
        selectedBranch.value = new TitleInterface({
          id: matchedBranch.id,
          title: matchedBranch.title,
          subtitle: subjectParentId,
        });
      }
    }

    if (branchId) {
      const subjectResult = await fullSubjectTreeController.fetchList(
        new FullSubjectTreeParams({ id: branchId, parentId: subjectParentId }),
      );
      if (requestId !== restoreRequestId) return;

      subjectOptions.value = flattenSubjectBranchTree((subjectResult?.data ?? []) as StageModel[]);
      const matchedSubject = subjectOptions.value.find((option) => option.id === subjectId);
      if (matchedSubject) selectedSubject.value = matchedSubject;
    }

    updateData();
  };

  watch(
    () => document,
    (newDoc) => {
      const requestId = ++restoreRequestId;
      if (!newDoc) return;

      title.value = { ...newDoc.translations.title };
      description.value = { ...newDoc.translations.description };
      RefrenceNumber.value = newDoc.RefNumber;
      UploadedImage.value = newDoc.images;
      UploadedFiles.value = newDoc.files;
      imageRemoved.value = false;
      fileRemoved.value = false;
      selectedDocumentType.value = new TitleInterface({
        id: newDoc.documentType.id,
        title: newDoc.documentType.title,
      });
      tags.value = [...newDoc.tags];

      void restoreDocumentSelections(newDoc, requestId);
      updateData();
    },
    { immediate: true },
  );
</script>

<template>
  <div class="document-form-card" :aria-busy="loading">
    <header class="document-form-header">
      <div class="document-form-header-icon" aria-hidden="true">
        <DocumentIcon />
      </div>

      <div class="document-form-header-text">
        <span class="document-form-badge">{{ document ? $t('editing') : $t('add_document') }}</span>

        <h4>{{ document ? $t('edit_document') : $t('add_document') }}</h4>

        <p>{{ document ? $t('update_document_details') : $t('fill_document_details') }}</p>
      </div>
    </header>

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
          :label="$t('document_type')"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController as any"
          :model-value="selectedDocumentType"
          :relaod="false"
          :placeholder="$t('select_document_type')"
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
        <small
          v-if="validationErrors.educationClassification"
          class="document-field-error"
          data-document-error
        >
          {{ validationErrors.educationClassification }}
        </small>
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
        <small v-if="validationErrors.branch" class="document-field-error" data-document-error>
          {{ validationErrors.branch }}
        </small>
      </div>
      <div v-if="subjectOptions.length > 0 || selectedSubject" class="field-group col-span-2">
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
        <!-- <small v-if="validationErrors.subject" class="document-field-error" data-document-error>
          {{ validationErrors.subject }}
        </small> -->
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

          <button type="button" class="btn btn-primary tag-add-button" @click="setTags">
            {{ $t('Add Tag') }}
          </button>
        </div>

        <div class="tags-container" :class="tags.length > 0 ? `border` : ``">
          <div v-for="(tagItem, tagIndex) in tags" :key="tagIndex" class="tag">
            <span>{{ tagItem }}</span>

            <button type="button" class="tag-delete-button" @click="deletetag(tagIndex)">
              <DeleteTagIcon class="delete" />
            </button>
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
          :max-files="1"
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
          :max-files="1"
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
  .document-form-card {
    // width: min(100%, 1180px);
    margin-inline: auto;
    display: grid;
    gap: 20px;
  }

  .document-form-header {
    position: relative;
    overflow: hidden;
    min-height: 112px;
    padding: 24px;
    border: 1px solid var(--PrimaryColor-alpha-15);
    border-radius: var(--radius-xl);
    background: linear-gradient(120deg, var(--PrimaryColor-alpha-12), var(--BgWhite));
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: var(--shadow-sm);

    &::after {
      position: absolute;
      inset-inline-end: -42px;
      top: -74px;
      width: 190px;
      height: 190px;
      border: 30px solid var(--PrimaryColor-alpha-10);
      border-radius: var(--radius-full);
      content: '';
      pointer-events: none;
    }
  }

  .document-form-header-icon {
    position: relative;
    z-index: 1;
    width: 52px;
    height: 52px;
    border-radius: var(--radius-lg);
    background: var(--primary-green);
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    box-shadow: var(--shadow-md);

    :deep(svg) {
      width: 27px;
      height: 27px;
      color: var(--BgWhite);
    }
  }

  .document-form-header-text {
    position: relative;
    z-index: 1;
    min-width: 0;

    h4 {
      margin: 5px 0 3px;
      color: var(--gray-900);
      font-size: clamp(20px, 2vw, 25px);
      font-weight: 700;
      line-height: 1.25;
    }

    p {
      margin: 0;
      color: var(--gray-600);
      font-size: 13px;
    }
  }

  .document-form-badge {
    width: fit-content;
    padding: 4px 9px;
    border: 1px solid var(--PrimaryColor-alpha-20);
    border-radius: var(--radius-full);
    background: var(--PrimaryColor-alpha-8);
    color: var(--primary-green);
    display: inline-flex;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .form-fields {
    padding: 24px;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-xl);
    background: var(--BgWhite);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    box-shadow: var(--shadow-md);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus-within {
      border-color: var(--PrimaryColor-alpha-40);
      box-shadow: var(--shadow-lg);
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.65;
    }
  }

  .field-group {
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--gray-50), var(--BgWhite));
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      transform 0.2s ease;

    &:focus-within {
      border-color: var(--PrimaryColor-alpha-30);
      background: var(--BgWhite);
      transform: translateY(-1px);
    }
  }

  .col-span-2 {
    grid-column: 1 / -1;
  }

  :deep(.field-label),
  :deep(.input-label),
  :deep(.upload-label) {
    width: fit-content;
    color: var(--gray-700) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  }

  .field-input,
  :deep(.field-input),
  :deep(.p-select),
  :deep(.p-multiselect) {
    min-height: 48px;
    border: 1px solid var(--gray-200) !important;
    border-radius: 14px !important;
    background: var(--gray-50) !important;
    color: var(--gray-800);
    box-shadow: none;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: var(--gray-300) !important;
      background: var(--BgWhite) !important;
    }

    &:focus,
    &:focus-within {
      border-color: var(--primary-green) !important;
      background: var(--BgWhite) !important;
      outline: none;
      box-shadow: 0 0 0 4px var(--PrimaryColor-alpha-10);
    }
  }

  input.field-input {
    width: 100%;
    padding: 11px 15px;
    font-size: 13px;
    font-weight: 500;

    &::placeholder {
      color: var(--gray-400);
      font-weight: 400;
    }
  }

  :deep(.p-select-label) {
    padding: 11px 15px !important;
    display: flex;
    align-items: center;
  }

  .disabled-input {
    pointer-events: none;
    opacity: 0.5;
  }

  .add-dialog {
    cursor: pointer;
  }

  .document-field-error {
    width: fit-content;
    margin: 0;
    padding: 3px 8px;
    border-radius: var(--radius-full);
    background: var(--danger-light);
    color: var(--danger-color);
    font-size: 11px;
    font-weight: 500;
  }

  .input-tag-wrap {
    display: flex;
    align-items: stretch;
    gap: 10px;
  }

  .tag-add-button {
    min-width: 112px;
    min-height: 48px;
    border: 0;
    border-radius: 14px;
    background: var(--primary-green);
    color: var(--BgWhite);
    font-weight: 600;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }

  .tags-container {
    min-height: 48px;
    padding: 10px;
    border: 1px dashed var(--PrimaryColor-alpha-30);
    border-radius: var(--radius-md);
    background: var(--PrimaryColor-alpha-4);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    padding: 6px 7px 6px 11px;
    border: 1px solid var(--PrimaryColor-alpha-20);
    border-radius: var(--radius-full);
    background: var(--BgWhite);
    color: var(--gray-700);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }

  .tag-delete-button {
    width: 25px;
    height: 25px;
    padding: 0;
    border: 0;
    border-radius: var(--radius-full);
    background: var(--danger-light);
    color: var(--danger-color);
    display: grid;
    place-items: center;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--danger-color);
      outline-offset: 2px;
    }
  }

  :deep(.image-input .upload-label) {
    margin-bottom: 8px;
  }

  :deep(.image-input .upload-area) {
    min-height: 150px;
    padding: 24px !important;
    border: 1px dashed var(--PrimaryColor-alpha-40) !important;
    border-radius: 18px !important;
    background: linear-gradient(135deg, var(--PrimaryColor-alpha-4), var(--gray-50)) !important;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      border-color: var(--primary-green) !important;
      background: var(--PrimaryColor-alpha-8) !important;
      transform: translateY(-1px);
    }
  }

  .add-imaegs-data {
    min-height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    text-align: center;

    :deep(svg) {
      width: 36px;
      height: 36px;
    }

    p {
      margin: 0;
    }

    .first-text {
      color: var(--gray-600);
      font-size: 12px;

      span {
        color: var(--primary-green);
        font-weight: 600;
      }
    }

    .second-text {
      color: var(--gray-400);
      font-size: 11px;
    }
  }

  @media (max-width: 768px) {
    .document-form-header {
      min-height: 96px;
      padding: 18px;
      border-radius: var(--radius-lg);
    }

    .document-form-header-icon {
      width: 46px;
      height: 46px;
    }

    .form-fields {
      padding: 16px;
      border-radius: var(--radius-lg);
      grid-template-columns: minmax(0, 1fr);
    }

    .col-span-2 {
      grid-column: auto;
    }
  }

  @media (max-width: 480px) {
    .document-form-header {
      align-items: flex-start;
    }

    .document-form-header::after {
      width: 140px;
      height: 140px;
    }

    .field-group {
      padding: 13px;
    }

    .input-tag-wrap {
      flex-direction: column;
    }

    .tag-add-button {
      width: 100%;
    }
  }
</style>
