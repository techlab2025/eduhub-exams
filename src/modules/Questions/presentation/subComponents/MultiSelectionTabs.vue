<script setup lang="ts">
import { ref, watch } from 'vue';
import ContantTabs from './ContantTabs.vue';
import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';
import Basicarrow from '@/shared/icons/basicarrow.vue';
import MultiLangInput from '@/shared/MultiLangInput.vue';
import HandleFilesUpload from '@/shared/FormInputs/HandleFilesUpload.vue';
const tabQuestion = ref<string>("");
const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{ modelValue: string }>();

// Sync local state with parent
if (props.modelValue) {
    tabQuestion.value = props.modelValue;
}

watch(tabQuestion, (newVal) => {
    emit("update:modelValue", newVal);
});

</script>
<template>

    <header class="form-header-question">
        <div class="header-text">
            <FolderCrudIcon />
            <h3>
                {{ $t('add question') }}
            </h3>
        </div>
        <div class="basic-header-actions">
            <h5>basic question data</h5>
            <Basicarrow />
        </div>
        <div class="field-group">
          <div class="input-wrap">
            <MultiLangInput
              :field-key="`title_Singular`"
              :label="$t(`question title`)" 
              :languages="['en', 'ar']"
              :model-value="subject_title_Singular"
              :type="`title`"
              @update:model-value="subject_title_Singular = $event"
            />
          </div>
        </div>
          <div class="field-group col-span-2">
        <HandleFilesUpload
          :key="uploadKey"
          :label="`upload image`"
          accept="image/*"
          :multiple="false"
          :index="1"
          :file="image || undefined"
          :have-content="true"
          :class="`image-input`"
          @change="handleImageChange"
        >
          <template #content>
            <div class="add-imaegs-data">
              <UplaodImageInput />
              <p class="first-text"><span>Click to upload</span> or drag and drop</p>
              <p class="second-text">JPG, JPEG, PNG less than 1MB</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>
    </header>

    <div class="parent_tabs">
        <div class="title">
            <h5>{{ $t('question type') }}</h5>
        </div>
        <div class="all_tabs">
            <label class="tab-item" :class="{ active: tabQuestion === 'mCQ' }">
                <input id="mCQ" v-model="tabQuestion" type="radio" name="tab" value="mCQ">
                <span>{{ $t("mCQ") }}</span>
            </label>
            <label class="tab-item" :class="{ active: tabQuestion === 'trueAndFalse' }">
                <input id="trueAndFalse" v-model="tabQuestion" type="radio" name="tab" value="trueAndFalse">
                <label for="trueAndFalse">{{ $t("true & false") }}</label>
            </label>
            <label class="tab-item" :class="{ active: tabQuestion === 'ranking' }">
                <input id="ranking" v-model="tabQuestion" type="radio" name="tab" value="ranking">
                <label for="ranking">{{ $t("ranking") }}</label>
            </label>
            <label class="tab-item" :class="{ active: tabQuestion === 'complete' }">
                <input id="complete" v-model="tabQuestion" type="radio" name="tab" value="complete">
                <label for="complete">{{ $t("complete") }}</label>
            </label>
            <label class="tab-item" :class="{ active: tabQuestion === 'matching' }">
                <input id="matching" v-model="tabQuestion" type="radio" name="tab" value="matching">
                <label for="matching">{{ $t("matching") }}</label>
            </label>
        </div>
        {{ tabQuestion }}
        <ContantTabs v-if="tabQuestion" :selectedtab="tabQuestion" />
    </div>
</template>