<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type EducationClassificationModel from '../../core/models/education.classification.model';
  import AddEducationClassificationParams from '../../core/params/add.educationClassification.params';
  import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';
  import TranslationParams from '@/modules/about/core/params/translation.params';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import FilterDialog from '@/shared/HelpersComponents/FilterDialog/FilterDialog.vue';
  import DatePicker from 'primevue/datepicker';

  const emit = defineEmits(['updateData', 'save-education-classification']);

  const { country, formKey } = defineProps<{
    country?: EducationClassificationModel;
    formKey?: string;
  }>();

  const FormStore = useFormsStore();

  onBeforeRouteLeave((to, from) => {
    if (formKey) {
      const savedData = FormStore.getFormData(formKey);

      if (savedData && to.path !== from.path) {
        FormStore.showReturnWarning(formKey);
      }
    }
  });

  // Form state
  const title = ref<Record<string, string>>({});
  const date = ref<Date | null>(null);

  watch(
    () => country,
    (newCountry) => {
      if (newCountry) {
        title.value = newCountry.title as any;
      }
    },
    { immediate: true },
  );

  // const route = useRoute();

  const updateData = () => {
    if (formKey) {
      FormStore.setFormData(formKey, {
        title: title.value,
      });
    }

    console.log(title.value, 'title');
    const params = new AddEducationClassificationParams({
      translation: new TranslationParams({
        title: title.value,
      }),
    });

    emit('updateData', params);

    // console.log("aa")
  };

  // const resetForm = () => {
  //   title.value = {};
  // };

  onMounted(() => {
    // if (formKey) {
    //   const saved = FormStore.getFormData(formKey);
    //   if (saved) {
    //     title.value = saved.title;
    //     updateData();
    //   } else if (!country) {
    //     resetForm();
    //   }
    // } else if (!country) {
    //   resetForm();
    // }
  });

  const getTitle = (data: any) => {
    title.value = data;
    updateData();
  };
  // fillter
  const FilterDialogShow = ref<boolean>(false);
  const ApplayFilter = () => {
    FilterDialogShow.value = false;
  };
  const CloseFiletrDialog = () => {
    FilterDialogShow.value = false;
  };
</script>

<template>
  <div class="education-classification-form-card">
    <!-- ── Card Header ───────────────────────────────────── -->
    <header class="education-classification-form-header">
      <div class="header-text">
        <FolderCrudIcon />
        <h3>
          {{ $t(' Add education classification') }}
        </h3>
      </div>
      <FilterDialog v-model="FilterDialogShow">
        <template #content>
          <div class="date-remove">
            <h6>{{ $t('date of remove') }}</h6>
            <DatePicker v-model="date" class="date-model" :placeholder="$t('Date Remove')" />
          </div>
          <div class="filter-action">
            <button class="btn btn-cancel" @click="CloseFiletrDialog">{{ $t('Reset') }}</button>
            <button class="btn btn-primary" @click="ApplayFilter">{{ $t('apply') }}</button>
          </div>
        </template>
      </FilterDialog>
    </header>

    <!-- ── Fields ────────────────────────────────────────── -->
    <div class="education-classification-form-fields">
      <!-- Email Field -->
      <!-- <div class="field-group">
        <label class="field-label" for="title"> {{ $t('education classification') }} </label>
        <div class="input-wrap">
          <input
            id="title"
            v-model="title"
            type="text"
            :placeholder="$t('Enter education type')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div> -->
      <div class="field-group">
        <MultiLangInput
          :field-key="`title`"
          :label="$t(`education classification`)"
          :languages="['en', 'ar']"
          :model-value="title"
          :type="`title`"
          @update:model-value="getTitle"
        />
      </div>
      <button class="save-btn" @click="emit('save-education-classification')">
        {{ $t('Save') }}
      </button>
    </div>
  </div>
</template>
