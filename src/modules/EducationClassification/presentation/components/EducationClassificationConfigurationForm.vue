<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type EducationClassificationModel from '../../core/models/education.classification.model';
  import AddEducationClassificationParams from '../../core/params/add.educationClassification.params';
  import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import SingularPluralForm from '../../subComponent/SingularPluralForm.vue';
  import ConfigurationParams from '../../core/params/EducationConfiguration/Configuration.params';
  import AddEducationConfigurationParams from '../../core/params/EducationConfiguration/add.educationConfiguration.params';
  import TranslationParams from '../../core/params/translation.params';
  import AddEducationSubjectParams from '../../core/params/EducationSubjects/add.educationSubject.params';
  import EducationConfigurationController from '../controllers/educationConfiguration/education.configuration.controller';
  import EducationSubjectController from '../controllers/educationSubject/education.subject.controller';
  import EducationConfigurationModel from '../../core/models/EducationConfiguration/education.configuration.model';
  import EducationSubjectConfigurationModel from '../../core/models/EducationConfiguration/education.subject.configuration.model';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

  const emit = defineEmits([
    'updateData',
    'save-education-classification',
    'save-education-subjects',
  ]);
  const { country, formKey } = defineProps<{
    country?: EducationClassificationModel;
    formKey?: string;
  }>();
  const ConfigurationnumberOfBranchs = ref<number>(0);
  const SubjectnumberOfBranchs = ref<number>(0);

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
    if (formKey) {
      FormStore.setFormData(formKey, {
        title: title.value,
      });
    }

    const params = new AddEducationClassificationParams({
      title: title.value,
    });

    emit('updateData', params);
  };

  const resetForm = () => {
    title.value = '';
  };

  onMounted(() => {
    if (formKey) {
      const saved = FormStore.getFormData(formKey);

      if (saved) {
        title.value = saved.title;
        updateData();
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  });

  const subject_title_Singular = ref<Record<string, string>>({});
  const subject_title_Plural = ref<Record<string, string>>({});

  const ConfigurationNumberOfBranchs = ref<number>(0);
  const subjectNumberOfBranchs = ref<number>(0);

  type Branch = { singular: Record<string, string>; plural: Record<string, string> };
  const configurationInitialBranches = ref<Branch[]>([]);
  const subjectInitialBranches = ref<Branch[]>([]);

  const ApplyConfigurationBranchs = () => {
    emit('save-education-classification');
    ConfigurationNumberOfBranchs.value = ConfigurationnumberOfBranchs.value;
  };
  const ApplySubjectBranchs = () => {
    emit('save-education-subjects');
    subjectNumberOfBranchs.value = SubjectnumberOfBranchs.value;
  };

  const GetConfigurationBranchs = async (branches: Branch[]) => {
    const configurationBranches: ConfigurationParams[] = [];
    branches.forEach((branch, index) => {
      configurationBranches.push(
        new ConfigurationParams({
          levelNumber: index + 1,
          translation: new TranslationParams({
            SingularTitle: branch.singular,
            PluralTitle: branch.plural,
          }),
        }),
      );
    });
    const params = new AddEducationConfigurationParams({
      educationClassificatioId: 1,
      numberOfBranches: ConfigurationNumberOfBranchs.value,
      branches: configurationBranches,
    });
    const controller = EducationConfigurationController.getInstance();
    await controller.create(params);
  };

  const GetSubjectBranchs = async (branches: Branch[]) => {
    const configurationBranches: ConfigurationParams[] = [];
    branches.forEach((branch, index) => {
      configurationBranches.push(
        new ConfigurationParams({
          levelNumber: index + 1,
          translation: new TranslationParams({
            SingularTitle: branch.singular,
            PluralTitle: branch.plural,
          }),
        }),
      );
    });
    const params = new AddEducationSubjectParams({
      educationClassificatioId: 1,
      numberOfBranches: SubjectnumberOfBranchs.value,
      branches: configurationBranches,
      translation: new TranslationParams({
        SingularTitle: subject_title_Singular.value,
        PluralTitle: subject_title_Plural.value,
      }),
    });
    const controller = EducationSubjectController.getInstance();
    await controller.create(params);
  };

  const fillConfigurationForm = (data: EducationConfigurationModel) => {
    ConfigurationnumberOfBranchs.value = data.numberOfBranches;
    ConfigurationNumberOfBranchs.value = data.numberOfBranches;
    configurationInitialBranches.value = data.branches.map((branch) => ({
      singular: { ...branch.translation.SingularTitle },
      plural: { ...branch.translation.PluralTitle },
    }));
  };

  const fillSubjectForm = (data: EducationSubjectConfigurationModel) => {
    SubjectnumberOfBranchs.value = data.numberOfBranches;
    subjectNumberOfBranchs.value = data.numberOfBranches;
    subject_title_Singular.value = { ...data.translation.SingularTitle };
    subject_title_Plural.value = { ...data.translation.PluralTitle };
    subjectInitialBranches.value = data.branches.map((branch) => ({
      singular: { ...branch.translation.SingularTitle },
      plural: { ...branch.translation.PluralTitle },
    }));
  };

  const controller = EducationConfigurationController.getInstance();
  const subjectController = EducationSubjectController.getInstance();

  onMounted(async () => {
    const [configResult, subjectResult] = await Promise.all([
      controller.fetchList(),
      subjectController.fetchList(),
    ]);

    if (configResult instanceof DataSuccess && configResult.data) {
      fillConfigurationForm(configResult.data);
    } else {
      fillConfigurationForm(EducationConfigurationModel.example);
    }

    if (subjectResult instanceof DataSuccess && subjectResult.data) {
      fillSubjectForm(subjectResult.data);
    } else {
      fillSubjectForm(EducationSubjectConfigurationModel.example);
    }
  });
</script>

<template>
  <div class="education-classification-configuration-form-container">
    <div class="education-classification-form-card">
      <!-- ── Card Header ───────────────────────────────────── -->
      <header class="form-header">
        <div class="header-text">
          <FolderCrudIcon />
          <h3>
            {{ $t('configuration Basic education') }}
          </h3>
        </div>
      </header>

      <!-- ── Fields ────────────────────────────────────────── -->
      <div class="education-classification-form-fields">
        <!-- Email Field -->
        <div class="field-group">
          <label class="field-label" for="title"> {{ $t('number_of_branchs') }} </label>
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
        :number-of-branches="ConfigurationNumberOfBranchs"
        :label="$t('name_of_branch')"
        :initial-branches="configurationInitialBranches"
        @update="GetConfigurationBranchs"
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
              :label="$t(`subjects_name_(Singular)`)"
              :languages="['en', 'ar']"
              :model-value="subject_title_Singular"
              @update:model-value="subject_title_Singular = $event"
            />
          </div>
        </div>
        <div class="field-group">
          <div class="input-wrap">
            <MultiLangInput
              :field-key="`title_Plural`"
              :label="$t(`subjects_name_(Plural)`)"
              :languages="['en', 'ar']"
              :model-value="subject_title_Plural"
              @update:model-value="subject_title_Plural = $event"
            />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label" for="title"> {{ $t('num_of_levels') }} </label>
          <div class="input-wrap">
            <input
              id="title"
              v-model="SubjectnumberOfBranchs"
              type="number"
              :placeholder="$t('num_of_levels')"
              class="field-input"
              @input="updateData"
            />
          </div>
        </div>
        <button class="save-btn" @click="ApplySubjectBranchs">
          {{ $t('apply') }}
        </button>
      </div>
      <SingularPluralForm
        :number-of-branches="subjectNumberOfBranchs"
        :label="$t('name_of_subjects')"
        :initial-branches="subjectInitialBranches"
        @update="GetSubjectBranchs"
      />
    </div>
  </div>
</template>
