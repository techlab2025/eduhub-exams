<script lang="ts" setup>
import { computed, ref } from "vue";
import Dialog from "primevue/dialog";
import RenameIcon from "@/shared/icons/RenameIcon.vue";


const props = defineProps<{
    visable: boolean
}>();

const emit = defineEmits(["update:visable"]);

const visible = computed({
    get: () => props.visable,
    set: (val) => emit("update:visable", val)
});

const title = ref<string>('')

const CloseDialog = () => {
    visible.value = false;
}

const EditData = () => {
    // save logic here
    visible.value = false;
}

</script>

<template>
    <Dialog v-model:visible="visible" :modal="true" :pt="{
        root: 'rename-dialog',
        header: 'dialog-header',
        content: 'dialog-body',
    }" :style="{ width: '35rem' }">
        <template #header>
            <div class="header-container">
                <RenameIcon />
                <div class="header-text-content">
                    <h4 class="header-title">{{ $t('rename_title_of_education_classifications') }}</h4>
                    <p class="header-message">{{
                        $t('Enter_a_new_name_for_this_education_classifications_This_change_will_not_affect_its_content_or_structure')
                    }}</p>
                </div>
            </div>
        </template>
        <div class="content">
            <div class="input-wrap">
                <input id="title" v-model="title" type="text" :placeholder="$t('Enter education type')"
                    class="field-input" />
            </div>
            <div class="btns">
                <button class="btn btn-primary w-full" @click="EditData">save</button>
                <button class="btn btn-secondary w-full" @click="CloseDialog">cancel</button>
            </div>
        </div>
    </Dialog>
</template>
