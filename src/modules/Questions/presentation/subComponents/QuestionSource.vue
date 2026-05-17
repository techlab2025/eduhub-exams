<script setup lang="ts">
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import { DocumentController, IndexDocumentParams } from '@/modules/document';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import { ref } from 'vue';

  const { document, source } = defineProps<{
    document?: TitleInterface<number> | null | undefined;
    source?: string | null;
  }>();
  const emit = defineEmits(['updateData']);
  const indexDocumentParams = new IndexDocumentParams();
  const documentController = DocumentController.getInstance();

  const SelectedSubject = ref<TitleInterface<number> | null>(document ?? null);

  const questionSource = ref<string>(source ?? '');

  const updateData = () => {
    emit('updateData', {
      documentId: SelectedSubject.value?.id,
      questionSource: questionSource.value,
    });
  };
</script>

<template>
  <div class="contant_tabs document-tab col-span-2">
    <div class="form-group">
      <div class="input">
        <UpdatedCustomInputSelect
          id="doc-subject"
          :label="`Document Source`"
          :params="indexDocumentParams"
          :controller="documentController"
          :model-value="SelectedSubject"
          placeholder="Document Source"
          @update:model-value="updateData"
        />
      </div>
      <div class="field-group">
        <label class="field-label" for="name">{{ $t(`Question Source`) }}</label>
        <div class="input-wrap">
          <input
            id="question-source"
            v-model="questionSource"
            type="text"
            placeholder="Enter question source"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
