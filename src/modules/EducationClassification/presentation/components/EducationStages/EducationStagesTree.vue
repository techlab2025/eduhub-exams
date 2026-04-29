<script setup lang="ts">
import { useRoute } from 'vue-router';
import AddEducationStageDialog from './Dialogs/AddEducationStageDialog.vue';
import AddEducationStageParams from '@/modules/EducationClassification/core/params/EducationStages/add.education.stage.params';
import EducationStageController from '../../controllers/EducationStages/education.stages.controller';
import { computed, onMounted } from 'vue';
import FetchEducationStageParams from '@/modules/EducationClassification/core/params/EducationStages/fetch.education.stage.params';

const route = useRoute()
const ClassificationId = route.params.id

const educationStagesController = EducationStageController.getInstance();
const state = computed(() => educationStagesController.listState.value);

const saveData = async (data: any) => {
    const addEducationStageParams = new AddEducationStageParams(
        {
            title: data.title,
            classification_id: Number(ClassificationId),
            parent_id: data.parent_id ? Number(data.parent_id) : undefined
        }
    )
    await educationStagesController.create(addEducationStageParams);
    const fetchEducationStageParams = new FetchEducationStageParams({
        classification_id: Number(ClassificationId),
    })
    await educationStagesController.fetchList(fetchEducationStageParams);

}

onMounted(async () => {
    const fetchEducationStageParams = new FetchEducationStageParams({
        classification_id: Number(ClassificationId),
    })
    const result = await educationStagesController.fetchList(fetchEducationStageParams)
    console.log(result, "result")
})

const showChildren = async (stage_id: number) => {
    const fetchEducationStageParams = new FetchEducationStageParams({
        classification_id: Number(ClassificationId),
        parent_id: stage_id,
    })
    await educationStagesController.fetchList(fetchEducationStageParams);
}
</script>
<template>

    <div v-if="state.data">
        <div v-for="item in state.data" :key="item.stage_id">
            <div @click="showChildren(item.stage_id)">
                <pre>{{ item.stage_title }}</pre>
            </div>
            <AddEducationStageDialog v-if="item.has_children" :parent_id="item.stage_id" @update:data="saveData" />
        </div>
    </div>


    <AddEducationStageDialog :ClassificationId="Number(ClassificationId)" @update:data="saveData" />
</template>