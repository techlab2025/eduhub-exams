<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type EducationClassificationModel from '../../core/models/education.classification.model';
  import AddEducationClassificationParams from '../../core/params/add.educationClassification.params';
  import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import SingularPluralForm from '../../subComponent/SingularPluralForm.vue';

  const emit = defineEmits(['updateData', 'save-education-classification']);

  const { country, formKey } = defineProps<{
    country?: EducationClassificationModel;
    formKey?: string;
  }>();
  const ConfigurationnumberOfBranchs = ref<number>(0);
  const SubjectnumberOfBranchs = ref<number>(0);

  const FormStore = useFormsStore();

  onBeforeRouteLeave((to, from) => {
    const savedData = FormStore.getFormData(formKey!);

    if (savedData && to.path !== from.path) {
      FormStore.showReturnWarning(formKey!);
    }
  });

  // Form state
  const title = ref<string>('');

  watch(
    () => country,
    (newCountry) => {
      if (newCountry) {
        title.value = newCountry.title;
      }
    },
    { immediate: true },
  );

  // const route = useRoute();

  const updateData = () => {
    FormStore.setFormData(formKey!, {
      title: title.value,
    });

    const params = new AddEducationClassificationParams({
      title: title.value!,
    });

    emit('updateData', params);
  };

  const resetForm = () => {
    title.value = '';
  };

  onMounted(() => {
    const saved = FormStore.getFormData(formKey!);

    if (saved) {
      title.value = saved.title;
      updateData();
    } else {
      resetForm();
    }
  });

  const title_Singular = ref<Record<string, string>>({});
  const title_Plural = ref<Record<string, string>>({});

  const ConfigurationNumberOfBranchs = ref<number>(0);
  const ApplyConfigurationBranchs = () => {
    emit('save-education-classification');
    ConfigurationNumberOfBranchs.value = ConfigurationnumberOfBranchs.value;
  };
</script>

<template>
  <div class="education-classification-configuration-form-container">
    <div class="education-classification-form-card">
      <!-- ── Card Header ───────────────────────────────────── -->
      <header class="form-header">
        <div class="header-text">
          <FolderCrudIcon />
          <h3>
            {{ $t(' configuration Basic education') }}
          </h3>
        </div>
      </header>

      <!-- ── Fields ────────────────────────────────────────── -->
      <div class="education-classification-form-fields">
        <!-- Email Field -->
        <div class="field-group">
          <label class="field-label" for="title"> {{ $t('number of branchs') }} </label>
          <div class="input-wrap">
            <input
              id="title"
              v-model="ConfigurationnumberOfBranchs"
              type="number"
              :placeholder="$t('Enter number of branchs')"
              class="field-input"
              @input="updateData"
            />
          </div>
        </div>
        <button class="save-btn" @click="ApplyConfigurationBranchs">
          {{ $t('apply') }}
        </button>
      </div>

      <SingularPluralForm
        :numberOfBranches="ConfigurationNumberOfBranchs"
        :label="$t('name of branch')"
        @update="console.log($event, 'evenet')"
      />
    </div>
    <div class="education-classification-form-card">
      <!-- ── Card Header ───────────────────────────────────── -->
      <header class="form-header">
        <div class="header-text">
          <FolderCrudIcon />
          <h3>
            {{ $t('configuration subjects') }}
          </h3>
        </div>
      </header>

      <!-- ── Fields ────────────────────────────────────────── -->
      <div class="education-classification-form-fields">
        <!-- Email Field -->
        <div class="field-group">
          <div class="input-wrap">
            <MultiLangInput
              :field-key="`title_Singular`"
              :label="`subjects name (Singular)`"
              :languages="['en', 'ar']"
              :model-value="title_Singular"
              @update:model-value="title_Singular = $event"
            />
          </div>
        </div>
        <div class="field-group">
          <div class="input-wrap">
            <MultiLangInput
              :field-key="`title_Plural`"
              :label="`subjects name (Plural)`"
              :languages="['en', 'ar']"
              :model-value="title_Plural"
              @update:model-value="title_Plural = $event"
            />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label" for="title"> {{ $t('number of branchs') }} </label>
          <div class="input-wrap">
            <input
              id="title"
              v-model="SubjectnumberOfBranchs"
              type="number"
              :placeholder="$t('Enter number of branchs')"
              class="field-input"
              @input="updateData"
            />
          </div>
        </div>
        <button class="save-btn" @click="emit('save-education-classification')">
          {{ $t('apply') }}
        </button>
      </div>
    </div>
  </div>
</template>
