<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import EditArticlesParams from '../../core/params/edit.Articles.params';
  import AddArticlesParams from '../../core/params/add.Artical.params';
  import HandleFilesUpload from '@/shared/FormInputs/HandleFilesUpload.vue';
  import UploadFileIcon from '@/shared/icons/UploadFileIcon.vue';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';
  import Checkbox from 'primevue/checkbox';
  import AccordionToggleIcon from '@/shared/icons/questions/AccordionToggleIcon.vue';
  import { DocumentController, IndexDocumentParams } from '@/modules/document';
  import AttachmentsParams from '@/modules/Questions/core/params/subParams/attachments.params';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import flattenSubjectBranchTree from '@/modules/Questions/core/SubjectTreeSelectHelper';
  import FullSubjectTreeController from '@/modules/Questions/presentation/controllers/FullSubjectTree/full.subject.tree.controller';
  import { CustomToast } from './CustomToast';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
  // import GetFullNameOfbranch from '@/shared/GeneralMethods/CreateBranchSubjectTree';

  const SelectedQuestionSequence = ref<TitleInterface<number> | null>(null);

  const route = useRoute();
  const { t } = useI18n();
  const emit = defineEmits(['updateData']);
  const props = defineProps<{
    loading?: boolean;
    article?: ShowQuestionsModel;
    draftData?: AddArticlesParams;
  }>();
  const isSolutionSteps = ref(true);
  const isSolutionHint = ref(true);
  const isExplain = ref(false);
  const UploadedImage = ref<string[]>([]);
  const explanationAttachments = ref<string[]>([]);
  const explanationAttachmentsChanged = ref(false);

  // Document dependencies
  const indexDocumentParams = new IndexDocumentParams();
  const documentController = DocumentController.getInstance();
  const SelectedDocument = ref<any>(null);
  const question = ref('');
  const articleSource = ref('');
  const descriptionArticle = ref('');
  const QuestionDescription = ref('');

  type RequiredFieldKey = 'description' | 'question' | 'subject' | 'document' | 'documentText';

  type RequiredFieldRule = {
    key: RequiredFieldKey;
    message: string;
    isInvalid: () => boolean;
  };

  const requiredFieldErrors = ref<Partial<Record<RequiredFieldKey, string>>>({});

  const requiredFields = computed<RequiredFieldRule[]>(() => [
    {
      key: 'question',
      message: question.value.trim()
        ? t('article_validation_title_min_length')
        : t('article_validation_title_required'),
      isInvalid: () => question.value.trim().length < 5,
    },
    {
      key: 'description',
      message: t('article_validation_description_required'),
      isInvalid: () => !QuestionDescription.value.trim(),
    },
    {
      key: 'subject',
      message: t('article_validation_subject_required'),
      isInvalid: () => !SelectedQuestionSequence.value?.id,
    },
    {
      key: 'document',
      message: t('article_validation_document_required'),
      isInvalid: () => !SelectedDocument.value?.id,
    },
    {
      key: 'documentText',
      message: t('article_validation_document_text_required'),
      isInvalid: () => !articleSource.value.trim(),
    },
  ]);

  const getFieldError = (key: RequiredFieldKey) => requiredFieldErrors.value[key] ?? '';

  const clearFieldError = (key: RequiredFieldKey) => {
    if (!requiredFieldErrors.value[key]) return;

    const errors = { ...requiredFieldErrors.value };
    delete errors[key];
    requiredFieldErrors.value = errors;
  };

  const scrollToRequiredField = async (key: RequiredFieldKey) => {
    await nextTick();
    document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const validateRequiredFields = async () => {
    const invalidFields = requiredFields.value.filter((field) => field.isInvalid());

    requiredFieldErrors.value = invalidFields.reduce<Partial<Record<RequiredFieldKey, string>>>(
      (errors, field) => {
        errors[field.key] = field.message;
        return errors;
      },
      {},
    );

    const firstInvalidField = invalidFields[0];
    if (!firstInvalidField) return true;

    dialogManager.toastWarning(t('article_validation_warning'), {
      title: t('invalid_input_warning_title'),
    });
    await scrollToRequiredField(firstInvalidField.key);
    return false;
  };

  defineExpose({
    validateRequiredFields,
  });

  const fullSubjectTreeController = FullSubjectTreeController.getInstance();
  const AllSubjectTree = ref<StageModel[]>([]);

  const subjectOptions = computed<TitleInterface<number>[]>(() => {
    return (AllSubjectTree.value! || []).flatMap((stage: StageModel) => {
      return flattenSubjectBranchTree(stage.children);
    });
  });
  const handelSubjectUpdate = async (selected: TitleInterface<number> | undefined) => {
    SelectedQuestionSequence.value = selected!;
    updateData();
  };

  watch(question, () => clearFieldError('question'));
  watch(QuestionDescription, () => clearFieldError('description'));
  watch(SelectedQuestionSequence, () => clearFieldError('subject'));
  watch(SelectedDocument, () => clearFieldError('document'));
  watch(articleSource, () => clearFieldError('documentText'));
  const FetchBranches = async () => {
    const result = await fullSubjectTreeController.fetchList();
    AllSubjectTree.value = result.data!;
    // const fullname = new GetFullNameOfbranch();
    // console.log(fullname.getLastBranchFullTitles(AllSubjectTree.value));
  };
  onMounted(async () => {
    FetchBranches();

    // console.log('AllSubjectTree.value', AllSubjectTree.value);
  });
  const updateData = () => {
    let params: any;
    if (route?.params?.id) {
      params = new EditArticlesParams({
        id: Number(route.params.id),
        question_description: QuestionDescription.value,
        attachments:
          UploadedImage.value.map((file) => new AttachmentsParams({ alt: 'img', file })) || [],
        question: question.value,
        question_type: 5,
        e_c_subject_id: SelectedQuestionSequence.value?.id,
        documents: SelectedDocument.value?.id && {
          document_id: SelectedDocument.value?.id,
          text: articleSource.value,
        },
        explanation: {
          explanation: descriptionArticle.value,
          attachments: explanationAttachmentsChanged.value
            ? explanationAttachments.value.map(
                (file) => new AttachmentsParams({ alt: 'img', file }),
              )
            : undefined,
        },
      });
    } else {
      params = new AddArticlesParams({
        question_description: QuestionDescription.value,
        attachments:
          UploadedImage.value.map((file) => new AttachmentsParams({ alt: 'img', file })) || [],
        question: question.value,
        question_type: 5,
        e_c_subject_id: SelectedQuestionSequence.value?.id,
        documents: SelectedDocument.value?.id && {
          document_id: SelectedDocument.value?.id,
          text: articleSource.value,
        },
        explanation: {
          explanation: descriptionArticle.value,
          attachments:
            explanationAttachments.value.map(
              (file) => new AttachmentsParams({ alt: 'img', file }),
            ) || [],
        },
      });
    }
    emit('updateData', params);
  };
  watch(
    () => props.article,
    (newValue) => {
      if (newValue) {
        QuestionDescription.value = newValue.question_description ?? '';
        question.value = newValue.question ?? '';
        SelectedQuestionSequence.value = newValue.e_c_subject ?? null;
        const selectedDoc = newValue.document?.find((doc: any) => doc.document_id);
        if (selectedDoc) {
          SelectedDocument.value = {
            id: selectedDoc.document_id,
            title: selectedDoc.document_title,
          };
          articleSource.value = selectedDoc?.text;
        }
        descriptionArticle.value = newValue.explanation?.explanation ?? '';
        isExplain.value = Boolean(descriptionArticle.value?.length > 0);
        explanationAttachments.value =
          newValue?.explanation?.attachments?.map((item: any) => item.file) ?? [];
        explanationAttachmentsChanged.value = false;
        UploadedImage.value = newValue?.attachments?.map((item: any) => item.file) ?? [];
      }
      updateData();
    },
    { immediate: true },
  );

  // const handleImageChange = (file: any) => {
  //   UploadedImage.value = file?.[0]?.base64 ? [file[0].base64] : [];
  //   updateData();
  // };

  const handleExplanationAttachments = (file: any) => {
    explanationAttachments.value = file[0]?.base64 ? [file[0].base64] : [];
    explanationAttachmentsChanged.value = true;
    updateData();
  };

  // const ArticleDraftData = ref<AddArticlesParams>();

  // const draftRef = localStorage.getItem('article-draft') ? CustomToast() : null;
  // const draftRef = !route.params.id && localStorage.getItem('article-draft') ? CustomToast() : null;

  // watch(draftRef!, (newVal) => {
  //   if (!newVal) return;

  //   ArticleDraftData.value = newVal;

  //   QuestionDescription.value = newVal.question_description ?? '';
  //   question.value = newVal.question ?? '';

  //   articleSource.value = newVal.documents?.text ?? '';

  //   if (newVal.e_c_subject_id) {
  //     SelectedQuestionSequence.value = {
  //       id: newVal.e_c_subject_id,
  //       title: '',
  //     };
  //   }

  //   if (newVal.documents?.id) {
  //     SelectedDocument.value = {
  //       id: newVal.documents.id,
  //       title: newVal.documents.title,
  //     };
  //   }
  //   console.log('draft', newVal.documents);
  //   UploadedImage.value = newVal.attachments?.map((item: any) => item.file) ?? [];

  //   descriptionArticle.value = newVal.explanation?.explanation ?? '';

  //   explanationAttachments.value =
  //     newVal.explanation?.attachments?.map((item: any) => item.file) ?? [];

  //   updateData();
  // });
</script>

<template>
  <div class="article-details-form-card article-form-layout">
    <header class="form-header">
      <div class="form-title">
        <div class="header-text">
          <h3>
            <FolderCrudIcon /> {{ route?.params?.id ? $t('Edit Article') : $t('Add New Article') }}
          </h3>
        </div>
      </div>
    </header>
    <div class="article-form-steps" :aria-label="$t('article_form_progress')">
      <div class="article-form-step active" aria-current="step">
        <span>{{ $t('article_details_step') }}</span>
        <small>{{ $t('step_one') }}</small>
      </div>
      <div class="article-form-step">
        <span>{{ $t('question_management_step') }}</span>
        <small>{{ $t('step_two') }}</small>
      </div>
    </div>
    <Accordion
      :class="{ disabled: props.loading }"
      :value="isSolutionSteps ? 1 : 0"
      :pt="{
        root: `article-solution-steps article-section-card article-section-basic ${isSolutionSteps ? 'active' : ''}`,
      }"
      @update:value="isSolutionSteps = !isSolutionSteps"
    >
      <AccordionPanel :value="1">
        <AccordionHeader>
          <template #toggleicon>
            <div class="article-solution-steps-header">
              <div class="toggll-container">
                <div>{{ $t('basic artical data') }}</div>
                <AccordionToggleIcon :class="{ 'rotate-180': isSolutionSteps }" />
              </div>
              <span class="dashed-border"></span>
              <!-- <Checkbox v-model="isSolutionSteps" :binary="true" :input-id="`is-correct`" name="is-correct" /> -->
            </div>
          </template>
        </AccordionHeader>
        <AccordionContent>
          <div class="input-wrapper" data-required-field="description">
            <label for="descreption">
              {{ $t('artical ') }}<span class="required-marker" aria-hidden="true">*</span>
            </label>
            <div class="description-container">
              <div class="description-header">
                <span>B / U</span>
                <!-- <HandleFilesUpload :label="``" accept="image/*"  :max-files="1"  :multiple="true" :index="1" :file="UploadedImage"
                  :have-content="true" :class="`image-input`" @change="handleImageChange">
                  <template #content>
                    <div class="upload-attachment-container">
                      <UploadFileIcon />
                      <span class="upload-attachment">{{ $t('upload_attachment') }}</span>
                    </div>
                  </template>
                </HandleFilesUpload> -->
              </div>
              <textarea
                id="descreption"
                v-model="QuestionDescription"
                name="descreption"
                :placeholder="$t('Enter Question clarification')"
                @input="updateData"
              ></textarea>
            </div>
            <p v-if="getFieldError('description')" class="required-field-message">
              {{ getFieldError('description') }}
            </p>
          </div>
          <div class="document-tab">
            <div class="form-group">
              <div class="field-group" data-required-field="question">
                <label class="field-label" for="article-title">
                  {{ $t('title of artical')
                  }}<span class="required-marker" aria-hidden="true">*</span>
                </label>
                <div class="input-wrap">
                  <input
                    id="article-title"
                    v-model="question"
                    type="text"
                    :placeholder="$t('enter title of artical ')"
                    class="field-input"
                    @input="updateData"
                  />
                </div>
                <p v-if="getFieldError('question')" class="required-field-message">
                  {{ getFieldError('question') }}
                </p>
              </div>
              <div
                class="field-group control-full-with required-field"
                data-required-field="subject"
              >
                <div class="input-wrapp">
                  <UpdatedCustomInputSelect
                    id="question-sequence"
                    v-model="SelectedQuestionSequence"
                    :label="`subject`"
                    :static-options="subjectOptions"
                    placeholder="select subject"
                    @update:model-value="handelSubjectUpdate"
                    @reload="FetchBranches"
                  />
                </div>
                <p v-if="getFieldError('subject')" class="required-field-message">
                  {{ getFieldError('subject') }}
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Accordion
      :class="{ disabled: props.loading }"
      :value="isSolutionHint ? 1 : 0"
      :pt="{
        root: `article-solution-steps article-section-card article-section-source ${isSolutionHint ? 'active' : ''}`,
      }"
      @update:value="isSolutionHint = !isSolutionHint"
    >
      <AccordionPanel :value="1">
        <AccordionHeader>
          <template #toggleicon>
            <div class="article-solution-steps-header">
              <div class="toggll-container">
                <div>{{ $t('artical source') }}</div>
                <AccordionToggleIcon />
              </div>
              <span class="dashed-border"></span>
              <!-- <Checkbox v-model="isSolutionSteps" :binary="true" :input-id="`is-correct`" name="is-correct" /> -->
            </div>
          </template>
        </AccordionHeader>
        <AccordionContent>
          <div class="document-tab">
            <div class="form-group form-group-grid">
              <div class="input required-field" data-required-field="document">
                <UpdatedCustomInputSelect
                  id="doc-subject"
                  v-model="SelectedDocument"
                  :label="`Documents`"
                  :params="indexDocumentParams"
                  :controller="documentController"
                  placeholder="select Documents"
                  @update:model-value="updateData"
                />
                <p v-if="getFieldError('document')" class="required-field-message">
                  {{ getFieldError('document') }}
                </p>
              </div>
              <div class="field-group" data-required-field="documentText">
                <label class="field-label" for="article-source">
                  {{ $t('source') }}<span class="required-marker" aria-hidden="true">*</span>
                </label>
                <div class="input-wrap">
                  <input
                    id="article-source"
                    v-model="articleSource"
                    type="text"
                    :placeholder="$t('enter source')"
                    class="field-input"
                    @input="updateData"
                  />
                </div>
                <p v-if="getFieldError('documentText')" class="required-field-message">
                  {{ getFieldError('documentText') }}
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <Accordion
      :class="{ disabled: props.loading }"
      :value="isExplain ? 1 : 0"
      :pt="{
        root: `article-solution-steps-explain article-section-card article-section-explanation ${isExplain ? 'active' : ''}`,
      }"
      @update:value="isExplain = !isExplain"
    >
      <AccordionPanel :value="1">
        <AccordionHeader>
          <template #toggleicon>
            <div class="article-solution-steps-header-explain">
              <div>{{ $t('Is there any explanation?') }}</div>
              <Checkbox
                v-model="isExplain"
                :binary="true"
                :input-id="`is-correct`"
                name="is-correct"
              />
            </div>
          </template>
        </AccordionHeader>
        <AccordionContent>
          <div class="input-wrapper">
            <label for="descreption">{{ $t('Description') }}</label>
            <div class="description-container">
              <div class="description-header">
                <span>B / U</span>
                <HandleFilesUpload
                  :label="``"
                  accept="image/*"
                  :hidepreview="true"
                  :max-files="1"
                  :multiple="true"
                  :index="2"
                  :file="explanationAttachments"
                  :have-content="true"
                  :class="`image-input`"
                  @change="handleExplanationAttachments"
                >
                  <template #content>
                    <div class="upload-attachment-container">
                      <UploadFileIcon />
                      <span class="upload-attachment">{{ $t('upload_attachment') }}</span>
                    </div>
                  </template>
                </HandleFilesUpload>
              </div>
              <textarea
                id="descreption"
                v-model="descriptionArticle"
                name="descreption"
                @input="updateData"
              ></textarea>
              <div class="preview-container">
                <div v-if="explanationAttachments?.length" class="preview-grid">
                  <div class="preview-item">
                    <img :src="explanationAttachments[0]" class="preview-thumb" alt="attachment" />
                    <button
                      type="button"
                      class="remove-btn"
                      title="Remove"
                      @click.stop="handleExplanationAttachments"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<style scoped lang="scss">
  @use '../../../../styles/variables' as *;
  @use '../../../../styles/mixins/flex' as *;

  .control-full-with {
    width: 100%;
  }

  .required-field-message {
    margin-top: 0.35rem;
    color: var(--danger-color);
    font-size: 0.82rem;
    font-weight: 400;
  }

  .required-marker {
    margin-inline-start: 0.2rem;
    color: var(--danger-color);
  }

  .image-input {
    :deep(.upload-area) {
      padding: 10px !important;
      border-radius: 50px;
      background-color: white;
    }

    .upload-attachment-container {
      @include flex-row(nowrap, flex-start, center);

      gap: 10px;

      .upload-attachment {
        color: $PrimaryColor;
      }
    }
  }

  .preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
  }

  .preview-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: var(--black-alpha-45);
    color: var(--BgWhite);
    font-size: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition:
      opacity 0.15s,
      background 0.15s;
    z-index: 10;

    &:hover {
      background: var(--danger);
    }
  }

  .preview-container {
    width: 100%;
    border-top: 1px solid rgba(128, 128, 128, 0.353);

    .preview-item {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 8px;
      border: 1px solid var(--gray-200);
      overflow: hidden;
      background: var(--gray-100);
      flex-shrink: 0;
      transition:
        border-color 0.15s,
        transform 0.15s;

      &:hover {
        border-color: $PrimaryColor;
        transform: translateY(-2px);
      }

      &:hover .remove-btn {
        opacity: 1;
      }
    }
  }

  .disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }

  .toggll-container {
    @include flex-row(nowrap, flex-start, center);

    gap: $XsSize4;

    .title {
      color: $PrimaryColor;
      font-size: $MdSize2;
      font-weight: $BaseFontSemiBoldWeight;
    }

    svg {
      transition: all 0.3s ease-in-out;

      &.rotate-180 {
        transform: rotate(180deg);
      }
    }
  }
</style>
