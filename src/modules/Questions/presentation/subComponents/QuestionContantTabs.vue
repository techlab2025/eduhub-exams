<script setup lang="ts">
  import IndexDocumentTypeParams from '@/modules/document/core/params/documntType/index.document.type.params';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import DocumentTypeController from '@/modules/document/presentation/controllers/DocumentType/document.type.controller';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import { ref } from 'vue';
  import { QuestionDifficultyEnum } from '../../core/constant/question.difficulty.enum';
  const indexDocumentTypeParams = new IndexDocumentTypeParams();
  const documentTypeController = DocumentTypeController.getInstance();
  const selectedDocumentType = ref<TitleInterface<number> | null>(null);
  const emit = defineEmits(['updateData']);

  const SelectedSubject = ref<TitleInterface<number> | null>(null);
  const SelectedQuestionSequence = ref<TitleInterface<number> | null>(null);
  const SelectedTopic = ref<TitleInterface<number> | null>(null);
  const SelectedDifficultyLevel = ref<TitleInterface<number> | null>(null);
  const SelectedSkill = ref<TitleInterface<number> | null>(null);

  const DifficultLevels = ref<TitleInterface<number>[]>([
    {
      id: QuestionDifficultyEnum.easy,
      title: 'Easy',
    },
    {
      id: QuestionDifficultyEnum.medium,
      title: 'Medium',
    },
    {
      id: QuestionDifficultyEnum.hard,
      title: 'Hard',
    },
  ]);

  const updateData = () => {
    emit('updateData', {
      selectedDifficultyLevel: SelectedDifficultyLevel.value?.id,
      SelectedSkill: SelectedSkill.value?.id,
      SelectedTopic: SelectedTopic.value?.id,
      SelectedQuestionSequence: SelectedQuestionSequence.value?.id,
      SelectedSubject: SelectedSubject.value?.id,
    });
  };
</script>

<template>
  <div class="contant_tabs">
    <div class="form-group">
      <div class="input">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`Subject`"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController"
          :model-value="SelectedSubject"
          placeholder="Subject"
          @update:model-value="updateData"
        />
      </div>
      <div class="input">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`question sequence`"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController"
          :model-value="SelectedQuestionSequence"
          placeholder="Question sequence"
          @update:model-value="updateData"
        />
      </div>
      <div class="input">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`topics`"
          :params="indexDocumentTypeParams"
          :controller="documentTypeController"
          :model-value="SelectedTopic"
          placeholder="Topics"
          @update:model-value="updateData"
        />
      </div>
      <div class="input">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`Difficulty level`"
          :static-options="DifficultLevels"
          :model-value="SelectedDifficultyLevel"
          placeholder="Difficulty level"
          @update:model-value="updateData"
        />
      </div>
    </div>
    <div class="new-form-group">
      <UpdatedCustomInputSelect
        id="doc-subject"
        :label="`skill`"
        :params="indexDocumentTypeParams"
        :controller="documentTypeController"
        :model-value="SelectedSkill"
        placeholder="Subject Type"
        @update:model-value="updateData"
      />
    </div>
  </div>
</template>
