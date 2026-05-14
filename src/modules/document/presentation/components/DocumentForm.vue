<script setup lang="ts">
  import { ref, watch, computed, onMounted } from 'vue';

  import { onBeforeRouteLeave } from 'vue-router';

  import { useFormsStore } from '@/stores/formsStore';

  // import type DocumentModel from '../../core/models/document.model';

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

  import StageController from '@/modules/Stages/presentation/controllers/stage.controller';

  import type StageModel from '@/modules/Stages/core/models/stage.model';

  import type BranchesModel from '@/modules/Stages/core/models/branches.model';

  import type DocumentShowModel from '../../core/models/document.show.model';

  const emit = defineEmits(['updateData']);

  const { document, formKey } = defineProps<{
    document?: DocumentShowModel;

    formKey?: string;
  }>();

  const FormStore = useFormsStore();

  onBeforeRouteLeave((to, from) => {
    const savedData = formKey ? FormStore.getFormData(formKey) : null;

    if (savedData && to.path !== from.path && formKey) {
      FormStore.showReturnWarning(formKey);
    }
  });

  // ─── Form state ───────────────────────────────────────────────────────────

  const title = ref<Record<string, string>>({});

  const description = ref<Record<string, string>>({});

  const RefrenceNumber = ref<string>('');

  const selectedDocumentType = ref<TitleInterface<number> | null>(null);

  // ─── Cascading state: Branch → Subject ───────────────────────────────────

  const selectedBranch = ref<BranchesModel | null>(null);

  const selectedSubject = ref<TitleInterface<number> | null>(null);

  // All stages data (full model to access branches + subjects)

  const allStages = ref<StageModel[]>([]);

  const indexDocumentTypeParams = new IndexDocumentTypeParams('', 1, 10, 0);

  const documentTypeController = DocumentTypeController.getInstance();

  const stageController = StageController.getInstance();

  const UploadedImage = ref<string[]>([]);

  const UploadedFiles = ref<string[]>([]);

  // ─── Fetch full stages on mount ───────────────────────────────────────────

  onMounted(async () => {
    await stageController.fetchList(indexDocumentTypeParams);

    allStages.value = (stageController.listData.value ?? []) as StageModel[];
  });

  // ─── Branch options: كل الـ branches من كل الـ stages مجمعين ─────────────

  const branchOptions = computed<TitleInterface<number>[]>(() =>
    allStages.value.flatMap((stage: StageModel) =>
      stage.branches.map((b: BranchesModel) => new TitleInterface({ id: b.id!, title: b.title })),
    ),
  );

  // selectedBranch as TitleInterface (for v-model in select)

  const selectedBranchTitle = computed<TitleInterface<number> | null>(() =>
    selectedBranch.value
      ? new TitleInterface({ id: selectedBranch.value.id!, title: selectedBranch.value.title })
      : null,
  );

  // ─── Subject options: من الـ branch المختار ──────────────────────────────

  // const subjectOptions = computed<TitleInterface<number>[]>(() =>

  //   (selectedBranch.value?.subjects ?? []) as TitleInterface<number>[]

  // );

  const subjectOptions = computed<TitleInterface<number>[]>(() =>
    (selectedBranch.value?.subjects ?? []).map(
      (subject: any) =>
        new TitleInterface({
          id: subject.id,

          title: subject.title,
        }),
    ),
  );

  // ─── Watch document prop for edit mode ────────────────────────────────────

  watch(
    () => document,

    (newDoc) => {
      if (newDoc) {
        title.value = newDoc.translations.title;

        selectedDocumentType.value = newDoc.documentType;

        UploadedImage.value = newDoc.images;

        UploadedFiles.value = newDoc.files;

        RefrenceNumber.value = newDoc.RefNumber;

        // stage

        selectedBranch.value = {
          id: newDoc.stage.id,

          title: newDoc.stage.title,

          subjects: [],
        } as BranchesModel;

        // subject

        selectedSubject.value = new TitleInterface({
          id: newDoc.subject.id,

          title: newDoc.subject.title,
        });

        selectedDocumentType.value = new TitleInterface({
          id: newDoc.documentType.id,

          title: newDoc.documentType.title,
        });
      }
    },

    { immediate: true },
  );

  // ─── updateData ───────────────────────────────────────────────────────────

  const updateData = () => {
    const params = new AddDocumentParams({
      translations: new DocumentTranslationParams({
        description: description.value,

        title: title.value,
      }),

      documentTypeId: selectedDocumentType.value?.id || 0,

      // هنا التعديل

      stage_id: selectedBranch.value?.id || 0,

      // subject id

      subjects: selectedSubject.value?.id || 0,

      files: UploadedFiles.value.map((el: any) => el?.base64 || ''),

      images: UploadedImage.value.map((el: any) => el?.base64 || ''),

      refNumber: RefrenceNumber.value,

      tags: tags.value,
    });

    emit('updateData', params);
  };

  // ─── Branch handler: find full BranchesModel by id → reset subject ───────

  const handleBranchChange = (selected: TitleInterface<number> | null) => {
    if (!selected) {
      selectedBranch.value = null;
    } else {
      // ابحث عن الـ BranchesModel الكامل من allStages

      for (const stage of allStages.value) {
        const found = stage.branches.find((b: BranchesModel) => b.id === selected.id);

        if (found) {
          selectedBranch.value = found;

          break;
        }
      }
    }

    selectedSubject.value = null;

    updateData();
  };

  // ─── File handlers ────────────────────────────────────────────────────────

  const handleImageChange = (files: []) => {
    UploadedImage.value = files;

    updateData();
  };

  const handleFilsChange = (files: any[]) => {
    UploadedFiles.value = files;

    updateData();
  };

  // ─── Tags ─────────────────────────────────────────────────────────────────

  const tag = ref<string>('');

  const tags = ref<string[]>([]);

  const setTags = () => {
    if (tag.value.length > 0) {
      tags.value.push(tag.value);

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
      </div>

      <!-- Ref Number -->

      <div class="field-group col-span-1 ref-number-group">
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

      <!-- Document Type -->

      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="documentType"
          :label="`Document Type`"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController"
          :model-value="selectedDocumentType as TitleInterface<number>"
          :placeholder="$t('Document Type')"
          @update:model-value="
            selectedDocumentType = $event;

            updateData();
          "
        />
      </div>

      <!-- Branch: كل الـ branches من كل الـ stages -->

      <div class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="doc-branch"
          :label="`Stage Name`"
          :static-options="branchOptions"
          :model-value="selectedBranchTitle"
          :placeholder="$t('Stage Name')"
          :reload="false"
          @update:model-value="handleBranchChange($event)"
        />
      </div>

      <!-- Subject: يظهر بس لو الـ branch المختار عنده subjects -->

      <div v-if="selectedBranch && subjectOptions.length > 0" class="field-group col-span-2">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`Subject Name`"
          :static-options="subjectOptions"
          :model-value="selectedSubject"
          :placeholder="$t('Subject Type')"
          :reload="false"
          @update:model-value="
            (event) => {
              selectedSubject = event;

              updateData();
            }
          "
        />
      </div>

      <!-- Description -->

      <div class="field-group col-span-2">
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
      </div>

      <!-- Tags -->

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

      <!-- Upload Image -->

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

      <!-- Upload Files -->

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
