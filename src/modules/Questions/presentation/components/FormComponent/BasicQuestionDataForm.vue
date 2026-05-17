<script setup lang="ts">
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  import AccordionToggleIcon from '@/shared/icons/questions/AccordionToggleIcon.vue';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import AddquestionsParams from '@/modules/Questions/core/params/add.question.params';
  import EditquestionsParams from '@/modules/Questions/core/params/edit.question.params';
  import HandleFilesUpload from '@/shared/FormInputs/HandleFilesUpload.vue';
  import UplaodImageInput from '@/shared/icons/UploadImage/UplaodImageInput.vue';
  import SelectionTabs from '../../subComponents/SelectionTabs.vue';
  import type TitleInterface from '@/base/Data/Models/titleInterface';
  import { QuestionTypeEnum } from '@/modules/Questions/core/constant/question.type.enum';
  import QuestionContantTabs from '../../subComponents/QuestionContantTabs.vue';
  import QuestionSource from '../../subComponents/QuestionSource.vue';
  import QuestionSourceParams from '@/modules/Questions/core/params/subParams/question.source.params';
  import type { QuestionDifficultyEnum } from '@/modules/Questions/core/constant/question.difficulty.enum';
  import QuestionSkillParams from '@/modules/Questions/core/params/subParams/question.skills.params';

  const emit = defineEmits(['updateData']);
  const route = useRoute();
  const { loading } = defineProps<{
    loading?: boolean;
  }>();
  const title = ref<string>('');

  const updateData = () => {
    let params: any;
    if (route.params.id) {
      params = new EditquestionsParams({
        id: Number(route.params.id),
        title: title.value,
        image: UploadedImage.value || [],
        questionType: selectedTab.value as QuestionTypeEnum,
        subjectId: SelectedSubject.value ? SelectedSubject.value : null,
        skills: [
          new QuestionSkillParams({
            percentage: 0,
            skillId: 1,
          }),
        ],
        difficultyLevel: selectedDifficultyLevel.value
          ? (selectedDifficultyLevel.value as QuestionDifficultyEnum)
          : null,
        topics: SelectedTopic.value ? [SelectedTopic.value] : [],
        questionSequenceId: SelectedQuestionSequence.value ? SelectedQuestionSequence.value : null,
        questionSource: new QuestionSourceParams({
          documentId: SelectedDocumet.value || 0,
          source: questionSource.value || '',
        }),
        answers: [],
      });
    } else {
      params = new AddquestionsParams({
        title: title.value,
        image: UploadedImage.value || [],
        questionType: selectedTab.value as QuestionTypeEnum,
        subjectId: SelectedSubject.value ? SelectedSubject.value : null,
        skills: [
          new QuestionSkillParams({
            percentage: 0,
            skillId: 1,
          }),
        ],
        difficultyLevel: selectedDifficultyLevel.value
          ? (selectedDifficultyLevel.value as QuestionDifficultyEnum)
          : null,
        topics: SelectedTopic.value ? [SelectedTopic.value] : [],
        questionSequenceId: SelectedQuestionSequence.value ? SelectedQuestionSequence.value : null,
        questionSource: new QuestionSourceParams({
          documentId: SelectedDocumet.value || 0,
          source: questionSource.value || '',
        }),
        answers: [],
      });
    }
    emit('updateData', params);
  };
  const UploadedImage = ref<string[]>([]);

  const handleImageChange = (file: any) => {
    UploadedImage.value = file[0]?.base64;
    updateData();
  };

  const tabs = ref<TitleInterface<number>[]>([
    {
      id: QuestionTypeEnum.mcq,
      title: 'MCQ',
    },
    {
      id: QuestionTypeEnum.true_false,
      title: 'trueAndFalse',
    },
    {
      id: QuestionTypeEnum.ranking,
      title: 'ranking',
    },
    {
      id: QuestionTypeEnum.complate,
      title: 'complete',
    },
    {
      id: QuestionTypeEnum.matching,
      title: 'matching',
    },
  ]);

  const selectedTab = ref<number | null>(null);
  const selectTab = (tab: number) => {
    selectedTab.value = tab;
  };

  const selectedDifficultyLevel = ref<number | null>(null);
  const SelectedSkill = ref<number | null>(null);
  const SelectedTopic = ref<number | null>(null);
  const SelectedQuestionSequence = ref<number | null>(null);
  const SelectedSubject = ref<number | null>(null);
  const getQuestionCOntent = (data: {
    selectedDifficultyLevel: number;
    SelectedSkill: number;
    SelectedTopic: number;
    SelectedQuestionSequence: number;
    SelectedSubject: number;
  }) => {
    selectedDifficultyLevel.value = data.selectedDifficultyLevel;
    SelectedSkill.value = data.SelectedSkill;
    SelectedTopic.value = data.SelectedTopic;
    SelectedQuestionSequence.value = data.SelectedQuestionSequence;
    SelectedSubject.value = data.SelectedSubject;
  };

  const questionSource = ref<string>('');
  const SelectedDocumet = ref<number | null>(null);
  const GetQuestionSource = (data: { documentId: number; questionSource: string }) => {
    SelectedDocumet.value = data.documentId;
    questionSource.value = data.questionSource;
  };
</script>

<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>
        <template #toggleicon>
          <div class="toggll-container">
            <div>basic question data</div>
            <AccordionToggleIcon />
          </div>
          <span class="dashed-border"></span>
        </template>
      </AccordionHeader>
      <AccordionContent>
        <div class="form-fields">
          <div class="field-group col-span-2" :class="{ disabled: loading }">
            <label class="field-label" for="name">{{ $t(`question title`) }}</label>
            <div class="input-wrap">
              <input
                id="title"
                v-model="title"
                type="text"
                placeholder="Enter question title"
                class="field-input"
                @input="updateData"
              />
            </div>
          </div>

          <div class="field-group col-span-2" :class="{ disabled: loading }">
            <HandleFilesUpload
              :label="`upload image`"
              accept="image/*"
              :multiple="false"
              :index="1"
              :file="UploadedImage"
              :have-content="true"
              :class="`image-input`"
              @change="handleImageChange"
            >
              <template #content>
                <div class="add-imaegs-data">
                  <UplaodImageInput />
                  <p class="first-text"><span>Click to upload</span>or drag and drop</p>
                  <p class="second-text">JPG, JPEG, PNG less than 1MB</p>
                </div>
              </template>
            </HandleFilesUpload>
          </div>

          <SelectionTabs
            class="field-group col-span-2"
            :tabs="tabs"
            :selected-tab="selectedTab"
            @update:modelValue="selectTab"
          />
          <QuestionContantTabs
            class="field-group col-span-2"
            @update:modelValue="getQuestionCOntent"
          />
          <QuestionSource @update:modelValue="GetQuestionSource" class="field-group col-span-2" />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<style scoped>
  .toggll-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }
  .dashed-border {
    width: 85%;
    height: 1px;
    border-bottom: 1px dashed #d0d0d0;
  }
  .p-accordionpanel:last-child > .p-accordionheader {
    padding-left: 0 !important;
  }
</style>
