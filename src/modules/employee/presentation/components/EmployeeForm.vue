<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import type EmployeeModel from '../../core/models/employee.model';
  import AddEmployeeParams from '../../core/params/add.employee.params';
  import EditEmployeeParams from '../../core/params/edit.employee.params';
  import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue';
  import HandleFilesUpload, { type UploadedFile } from '@/shared/FormInputs/HandleFilesUpload.vue';
  import UplaodImageInput from '@/shared/icons/UploadImage/UplaodImageInput.vue';
  import InputSwitch from 'primevue/inputswitch';
  import RadioButton from 'primevue/radiobutton';
  import { GenderENum } from '../../core/constant/gender.enum';
  import { EmployeeStatusEnm } from '../../core/constant/employee.status.enum';
  import { CustomToast } from '@/modules/Questions/presentation/subComponents/CustomTosat';
  import TitleInterface from '@/base/Data/Models/titleInterface';
  import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue';
  import { EmployeeTypeEnum } from '../../core/constant/employee.type.enum';
  import StageController from '@/modules/Stages/presentation/controllers/stage.controller';
  import IndexStageParams from '@/modules/Stages/core/params/index.stage.params';
  import flattenSubjectBranchTree from '@/modules/Questions/core/SubjectTreeSelectHelper';
  import type StageModel from '@/modules/Stages/core/models/stage.model';
  import type BranchesModel from '@/modules/Stages/core/models/branches.model';
  import { useI18n } from 'vue-i18n';
  import RoleController from '@/modules/Role/presentation/controllers/role.controller';
  import IndexRoleParams from '@/modules/Role/core/params/index.role.params';

  const emit = defineEmits(['updateData']);

  const props = defineProps<{
    employee?: EmployeeModel;
    formKey?: string;
    loading?: boolean;
  }>();

  const name = ref<string>('');
  const email = ref<string>('');
  const phone = ref<string>('');
  const password = ref<string>('');
  const image = ref<string>('');
  const isSuperadmin = ref<boolean>(false);
  const gender = ref<GenderENum>();
  const lastName = ref<string>('');
  const employeeId = ref('');
  const UploadedImage = ref<string[]>([]);
  const imageRemoved = ref(false);
  const checked = ref(false); //employee status

  const { t } = useI18n();
  const stageController = StageController.getInstance();
  const roleController = RoleController.getInstance();
  const employeeTypeOptions: TitleInterface<number>[] = [
    new TitleInterface({ id: EmployeeTypeEnum.ADMIN, title: t('employee_type_admin') }),
    new TitleInterface({ id: EmployeeTypeEnum.TEACHER, title: t('employee_type_teacher') }),
  ];
  const selectedEmployeeType = ref<TitleInterface<number>>(employeeTypeOptions[0]!);
  const roleOptions = ref<TitleInterface<number>[]>([]);
  const selectedRole = ref<TitleInterface<number> | null>(null);
  const subjectOptions = ref<TitleInterface<number>[]>([]);
  const selectedSubjects = ref<TitleInterface<number>[]>([]);
  const subjectError = ref('');
  const isTeacher = computed(() => selectedEmployeeType.value.id === EmployeeTypeEnum.TEACHER);

  const validate = (): boolean => {
    subjectError.value =
      isTeacher.value && selectedSubjects.value.length === 0 ? t('employee_subject_required') : '';
    return !subjectError.value;
  };

  defineExpose({ validate });

  const mapSelectedSubjectIds = (subjectIds: number[]): TitleInterface<number>[] =>
    subjectIds.map(
      (subjectId) =>
        subjectOptions.value.find((option) => option.id === subjectId) ??
        new TitleInterface({ id: subjectId, title: String(subjectId) }),
    );

  const mapSelectedSubjects = (subjects: TitleInterface<number>[]): TitleInterface<number>[] =>
    subjects.map(
      (subject) => subjectOptions.value.find((option) => option.id === subject.id) ?? subject,
    );

  const flattenBranchSubjects = (branches: BranchesModel[]): TitleInterface<number>[] =>
    branches.flatMap((branch) => [
      ...flattenSubjectBranchTree(branch.subjects as unknown as StageModel[]),
      ...flattenBranchSubjects(branch.children ?? []),
    ]);

  const route = useRoute();

  const updateData = () => {
    const imagePayload = imageRemoved.value
      ? '*'
      : props.employee && UploadedImage.value[0] === props.employee.image
        ? ''
        : UploadedImage.value[0] || '';
    const data = {
      email: email.value,
      EmployeeRef: employeeId.value,
      firstname: name.value,
      gender: gender.value == 1 ? GenderENum.male : GenderENum.female,
      image: imagePayload,
      lastname: lastName.value,
      phone: phone.value,
      employeeStatus: checked.value ? EmployeeStatusEnm.active : EmployeeStatusEnm.disavtive,
      password: password.value,
      employeeType: selectedEmployeeType.value.id as EmployeeTypeEnum,
      roleId: selectedRole.value?.id,
      educationClassificationSubjectIds: isTeacher.value
        ? selectedSubjects.value.map((subject) => subject.id)
        : [],
    };

    let params: any;
    if (route.params.id) {
      params = new EditEmployeeParams({
        id: Number(route.params.id),
        ...data,
      });
    } else {
      params = new AddEmployeeParams(data);
    }
    emit('updateData', params);
  };

  watch(
    () => props.employee,
    (newEmployee) => {
      if (newEmployee) {
        name.value = newEmployee.firstname;
        email.value = newEmployee.email;
        phone.value = newEmployee.phone;
        image.value = newEmployee.image;
        isSuperadmin.value = newEmployee.isSuperadmin;
        selectedEmployeeType.value =
          employeeTypeOptions.find((option) => option.id === newEmployee.employeeType) ??
          employeeTypeOptions[0]!;
        selectedRole.value = newEmployee.roleId
          ? (roleOptions.value.find((option) => option.id === newEmployee.roleId) ??
            new TitleInterface({
              id: newEmployee.roleId,
              title: newEmployee.roleName || String(newEmployee.roleId),
            }))
          : null;
        selectedSubjects.value = newEmployee.subjects.length
          ? mapSelectedSubjects(newEmployee.subjects)
          : mapSelectedSubjectIds(newEmployee.educationClassificationSubjectIds);
        gender.value = newEmployee.gender;
        lastName.value = newEmployee.lastname;
        employeeId.value = newEmployee.employeeId;
        checked.value = newEmployee.status == 1 ? true : false;
        UploadedImage.value = newEmployee.image ? [newEmployee.image] : [];
        imageRemoved.value = false;
        updateData();
      }
    },
    { immediate: true },
  );

  const resetForm = () => {
    name.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
    image.value = '';
    isSuperadmin.value = false;
    selectedRole.value = null;
    selectedEmployeeType.value = employeeTypeOptions[0]!;
    selectedSubjects.value = [];
    gender.value = 1;
    lastName.value = '';
    employeeId.value = '';
    UploadedImage.value = [];
    imageRemoved.value = false;
    checked.value = false;
    updateData();
  };

  const handleImageChange = (files: UploadedFile[]) => {
    if (files.length === 0) {
      UploadedImage.value = [];
      imageRemoved.value = Boolean(props.employee?.image);
    } else {
      UploadedImage.value = [files[0]?.base64 || files[0]?.url || ''];
      imageRemoved.value = false;
    }
    updateData();
  };

  const handleEmployeeTypeChange = (employeeType: TitleInterface<number> | null) => {
    selectedEmployeeType.value = employeeType ?? employeeTypeOptions[0]!;
    if (!isTeacher.value) {
      selectedSubjects.value = [];
      subjectError.value = '';
    }
    updateData();
  };

  const handleSubjectsChange = (subjects: TitleInterface<number>[] | null) => {
    selectedSubjects.value = subjects ?? [];
    if (selectedSubjects.value.length > 0) subjectError.value = '';
    updateData();
  };

  const handleRoleChange = (role: TitleInterface<number> | null) => {
    selectedRole.value = role;
    updateData();
  };

  const fetchSubjectOptions = async () => {
    const result = await stageController.fetchList(new IndexStageParams('', 1, 100, 0));
    const options = ((result?.data ?? []) as StageModel[]).flatMap((stage) => [
      ...flattenSubjectBranchTree(stage.subjects ?? []),
      ...flattenBranchSubjects(stage.branches ?? []),
    ]);
    subjectOptions.value = options.filter(
      (option, index) => options.findIndex((item) => item.id === option.id) === index,
    );
    selectedSubjects.value = mapSelectedSubjects(selectedSubjects.value);
  };

  const indexRoleParams = new IndexRoleParams('', 1, 100, 0);

  // const fetchRoleOptions = async () => {
  //   const result = await roleController.fetchList(new IndexRoleParams('', 1, 100, 0));
  //   roleOptions.value = (result.data ?? []).map((role) => role.toOption());
  //   if (selectedRole.value) {
  //     selectedRole.value =
  //       roleOptions.value.find((option) => option.id === selectedRole.value?.id) ??
  //       selectedRole.value;
  //   }
  // };

  const draftRef =
    !route.params.id && localStorage.getItem('employee-draft')
      ? CustomToast<AddEmployeeParams>('employee-draft')
      : null;

  watch(draftRef!, (newVal) => {
    if (newVal) {
      name.value = newVal.firstname;
      email.value = newVal.email;
      phone.value = newVal.phone;
      image.value = newVal.image;
      gender.value = newVal.gender;
      lastName.value = newVal.lastname;
      checked.value = Boolean(newVal.employeeStatus);
      UploadedImage.value = newVal.image ? [newVal.image] : [];
      imageRemoved.value = false;
      password.value = newVal.password;
      employeeId.value = newVal.EmployeeRef;
      selectedEmployeeType.value =
        employeeTypeOptions.find((option) => option.id === newVal.employeeType) ??
        employeeTypeOptions[0]!;
      selectedRole.value = newVal.roleId
        ? (roleOptions.value.find((option) => option.id === newVal.roleId) ??
          new TitleInterface({ id: newVal.roleId, title: String(newVal.roleId) }))
        : null;
      selectedSubjects.value = mapSelectedSubjectIds(
        newVal.educationClassificationSubjectIds ?? [],
      );
      updateData();
    }
  });

  onMounted(() =>
    Promise.all([
      fetchSubjectOptions(),
      // fetchRoleOptions()
    ]),
  );
</script>

<template>
  <div class="employee-details-form-card">
    <header class="form-header">
      <div class="form-title">
        <div class="header-text">
          <h3>{{ route.params.id ? 'Edit Employee' : 'Add New Employee' }}</h3>
          <p class="header-subtitle">
            {{
              route.params.id
                ? 'Update the employee details below'
                : 'Fill in the required information to add a new employee'
            }}
          </p>
        </div>
        <div class="employee-status">
          <div class="title">
            <h6>Employee Status</h6>
            <p :class="checked ? `` : `warn`">{{ checked ? $t('active') : $t('disactive') }}</p>
          </div>
          <div class="switch">
            <InputSwitch v-model="checked" @change="updateData" />
          </div>
        </div>
      </div>
      <!-- <span v-if="route.params.id" class="edit-badge">Editing</span> -->
    </header>

    <div class="employee-details-form">
      <p><EmployeeIcon /> {{ $t(`Basic Info`) }}</p>
      <h6 @click="resetForm">{{ $t(`reset`) }}</h6>
    </div>

    <div class="form-fields">
      <div class="field-group required-field" :class="{ disabled: props.loading }">
        <label class="field-label" for="name">{{ $t(`First Name`) }}</label>
        <div class="input-wrap">
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter first name"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
      <div class="field-group required-field" :class="{ disabled: props.loading }">
        <label class="field-label" for="name">{{ $t(`Last Name`) }}</label>
        <div class="input-wrap">
          <input
            id="name"
            v-model="lastName"
            type="text"
            placeholder="Enter last name"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
      <div class="field-group required-field" :class="{ disabled: props.loading }">
        <label class="field-label" for="password">{{ $t(`password`) }}</label>
        <div class="input-wrap">
          <input
            id="password"
            v-model="password"
            type="text"
            placeholder="Enter Password"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group required-field col-span-1" :class="{ disabled: props.loading }">
        <label class="field-label" for="email">{{ $t(`Email`) }}</label>
        <div class="input-wrap">
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="enter your email"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
      <div class="field-group" :class="{ disabled: props.loading }">
        <label class="field-label" for="employeeId">{{ $t('employee_ID') }}</label>
        <div class="input-wrap">
          <input
            id="employeeId"
            v-model="employeeId"
            type="tel"
            placeholder="Enter Employee ID"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
      <div class="field-group required-field" :class="{ disabled: props.loading }">
        <label class="field-label" for="phone">{{ $t(`Phone`) }}</label>
        <div class="input-wrap">
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="Enter phone number"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group" :class="{ disabled: props.loading }">
        <UpdatedCustomInputSelect
          id="employee-type"
          v-model="selectedEmployeeType"
          :label="$t('employee_type')"
          :placeholder="$t('select_employee_type')"
          :static-options="employeeTypeOptions"
          required
          :reload="false"
          @update:model-value="handleEmployeeTypeChange"
        />
      </div>

      <div class="field-group" :class="{ disabled: props.loading }">
        <UpdatedCustomInputSelect
          id="employee-role"
          v-model="selectedRole"
          :label="$t('role.employee_role')"
          :placeholder="$t('role.select_employee_role')"
          :controller="roleController"
          :params="indexRoleParams"
          required
          :reload="false"
          @update:model-value="handleRoleChange"
        />
      </div>

      <div v-if="isTeacher" class="field-group" :class="{ disabled: props.loading }">
        <UpdatedCustomInputSelect
          id="employee-subjects"
          v-model="selectedSubjects"
          :type="2"
          :label="$t('subjects')"
          :placeholder="$t('select_subjects')"
          :static-options="subjectOptions"
          required
          :reload="false"
          :max-selected-labels="1"
          @update:model-value="handleSubjectsChange"
        />
        <small v-if="subjectError" class="employee-field-error" role="alert">
          {{ subjectError }}
        </small>
      </div>

      <div class="field-group" :class="{ disabled: props.loading }">
        <label class="field-label" for="phone">{{ $t(`Gender`) }}</label>

        <div class="gender-group">
          <div class="input-field">
            <RadioButton
              v-model="gender"
              input-id="male"
              name="gender"
              :value="GenderENum.male"
              @change="updateData"
            />
            <label for="male">{{ $t('male') }}</label>
          </div>

          <div class="input-field">
            <RadioButton
              v-model="gender"
              input-id="female"
              name="gender"
              :value="GenderENum.female"
              @change="updateData"
            />
            <label for="female">{{ $t('female') }}</label>
          </div>
        </div>
      </div>

      <div class="field-group col-span-2" :class="{ disabled: props.loading }">
        <HandleFilesUpload
          :label="`upload image`"
          accept="image/*"
          :multiple="false"
          :index="1"
          :file="UploadedImage"
          :have-content="true"
          :class="`image-input`"
          :max-files="1"
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
    </div>
  </div>
</template>

<style scoped lang="scss">
  .employee-field-error {
    color: var(--danger);
    font-size: 0.8rem;
  }
</style>
