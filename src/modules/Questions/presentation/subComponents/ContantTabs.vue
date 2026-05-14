<script setup lang="ts">
import IndexDocumentTypeParams from '@/modules/document/core/params/documntType/index.document.type.params';
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
import DocumentTypeController from '@/modules/document/presentation/controllers/DocumentType/document.type.controller';
import type TitleInterface from '@/base/Data/Models/titleInterface';
import { ref } from 'vue';
const indexDocumentTypeParams = new IndexDocumentTypeParams()
const documentTypeController = DocumentTypeController.getInstance();
const selectedDocumentType = ref<TitleInterface<number> | null>(null);
const emit = defineEmits(['updateData']);
const updateData = () => {
    emit('updateData', {
        selectedDocumentType: selectedDocumentType.value,
    });
}
const props = defineProps<{
    selectedtab: string;
}>();

</script>

<template>
    <div class="contant_tabs">
        <div class="form-group">
            <div class="input">
                <UpdatedCustomInputSelect id="doc-subject" :label="`Subject`" :params="indexDocumentTypeParams"
                    :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
                    @update:model-value="updateData" />
            </div>
            <div class="input">
                <UpdatedCustomInputSelect id="doc-subject" :label="`Question sequence`"
                    :params="indexDocumentTypeParams" :controller="documentTypeController"
                    :model-value="selectedDocumentType" placeholder="Subject Type" @update:model-value="updateData" />
            </div>
            <div class="input">
                <UpdatedCustomInputSelect id="doc-subject" :label="`topics`" :params="indexDocumentTypeParams"
                    :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
                    @update:model-value="updateData" />
            </div>
            <div class="input">
                <UpdatedCustomInputSelect id="doc-subject" :label="`Difficulty level`" :params="indexDocumentTypeParams"
                    :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
                    @update:model-value="updateData" />
            </div>
        </div>
        <div class="new-form-group">
            <UpdatedCustomInputSelect id="doc-subject" :label="`skill`" :params="indexDocumentTypeParams"
                :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
                @update:model-value="updateData" />
        </div>
       <div class="title">
         <h5>{{ $t('Question source') }}</h5>
       </div>
        <div class="form-group question_source">
            <div class="input">
                <UpdatedCustomInputSelect id="doc-subject" :label="`Documents`" :params="indexDocumentTypeParams"
                    :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
                    @update:model-value="updateData" />
            </div>
            <div class="input">
                <UpdatedCustomInputSelect id="doc-subject" :label="`source`" :params="indexDocumentTypeParams"
                    :controller="documentTypeController" :model-value="selectedDocumentType" placeholder="Subject Type"
                    @update:model-value="updateData" />
            </div>
        </div>
    </div>
</template>