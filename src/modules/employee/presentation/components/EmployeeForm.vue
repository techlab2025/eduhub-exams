<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave, useRoute } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type EmployeeModel from '../../core/models/employee.model';
  import AddEmployeeParams from '../../core/params/add.employee.params';
  import EditEmployeeParams from '../../core/params/edit.employee.params';
  import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue';
  import HandleFilesUpload from '@/shared/FormInputs/HandleFilesUpload.vue';
  import UplaodImageInput from '@/shared/icons/UploadImage/UplaodImageInput.vue';

  const emit = defineEmits(['updateData']);

  const { employee, formKey } = defineProps<{
    employee?: EmployeeModel;
    formKey?: string;
  }>();

  const FormStore = useFormsStore();
  onBeforeRouteLeave((to, from) => {
    const savedData = FormStore.getFormData(formKey!);
    if (savedData && to.path !== from.path) {
      FormStore.showReturnWarning(formKey!);
    }
  });

  // Form state
  const name = ref<string>('');
  const email = ref<string>('');
  const phone = ref<string>('');
  const password = ref<string>('');
  const image = ref<string>('');
  const isSuperadmin = ref<boolean>(false);
  const role_id = ref<number>(1);
  const employeeType = ref<number>(1);
  const gender = ref<string>('');
  const lastName = ref<string>('');
  const employeeId = ref('');
  const UploadedImage = ref<string[]>([]);

  watch(
    () => employee,
    (newEmployee) => {
      if (newEmployee) {
        name.value = newEmployee.name;
        email.value = newEmployee.email;
        phone.value = newEmployee.phone;
        image.value = newEmployee.image;
        isSuperadmin.value = newEmployee.isSuperadmin;
        role_id.value = newEmployee.role_id;
        employeeType.value = newEmployee.employeeType;
        gender.value = newEmployee.gender;
        lastName.value = newEmployee.lastName;
        employeeId.value = newEmployee.employeeId;
        // Password is not populated for security/editing purposes
      }
    },
    { immediate: true },
  );

  const route = useRoute();

  const updateData = () => {
    const data = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      image: image.value,
      isSuperadmin: isSuperadmin.value,
      role_id: role_id.value,
      employeeType: employeeType.value,
      gender: gender.value,
      lastName: lastName.value,
      employeeId: employeeId.value,
    };

    FormStore.setFormData(formKey!, data);

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

  const resetForm = () => {
    name.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
    image.value = '';
    isSuperadmin.value = false;
    role_id.value = 1;
    employeeType.value = 1;
    gender.value = '';
    lastName.value = '';
    employeeId.value = '';
  };

  onMounted(() => {
    const saved = FormStore.getFormData(formKey!);
    if (saved) {
      name.value = saved.name;
      email.value = saved.email;
      phone.value = saved.phone;
      password.value = saved.password;
      image.value = saved.image;
      isSuperadmin.value = saved.isSuperadmin;
      role_id.value = saved.role_id;
      employeeType.value = saved.employeeType;
      gender.value = saved.gender;
      lastName.value = saved.lastName;
      employeeId.value = saved.employeeId;
      updateData();
    } else if (!employee) {
      resetForm();
    }
  });

  // function handel phone and employeeId
  const handlePhoneandEmployeeIdInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    input.value = value;
    phone.value = value;
    employeeId.value = value;
    updateData();
  };
  // function handel image
  const handleImageChange = (files: []) => {
    UploadedImage.value = files;
    updateData();
  };
</script>

<template>
  <div class="employee-form-card">
    <header class="form-header">
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
      <span v-if="route.params.id" class="edit-badge">Editing</span>
    </header>
    <div class="faq-details">
      <p><EmployeeIcon /> {{ $t(`Basic Info`) }}</p>
      <h6>{{ $t(`reset`) }}</h6>
    </div>

    <!-- <div class="form-divider" /> -->

    <div class="form-fields">
      <div class="field-group">
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
      <div class="field-group">
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

      <div class="field-group">
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
      employeeType

      <div class="field-group"></div>
      <div class="field-group">
        <label class="field-label" for="employeeId">Employee ID</label>
        <div class="input-wrap">
          <input
            id="employeeId"
            v-model="employeeId"
            type="tel"
            placeholder="Enter Employee ID"
            class="field-input"
            @input="handlePhoneandEmployeeIdInput"
          />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="phone">{{ $t(`Phone`) }}</label>
        <div class="input-wrap">
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="Enter phone number"
            class="field-input"
            @input="handlePhoneandEmployeeIdInput"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="phone">{{ $t(`Gender`) }}</label>
        <div class="genders-inputs">
          <div>
            <input id="male" v-model="gender" type="radio" name="gender" value="male" />
            <label for="male">Male</label>
          </div>
          <div>
            <input id="female" v-model="gender" type="radio" name="gender" value="female" />
            <label for="female">Female</label>
          </div>
        </div>
      </div>

      <!-- <div class="field-group checkbox-group">
        <label class="checkbox-label">
          <input v-model="isSuperadmin" type="checkbox" @change="updateData" />
          <span>Superadmin access</span>
        </label>
      </div> -->
    </div>
    <div class="field-group upload-image-employee">
      <HandleFilesUpload
        :label="`upload image`"
        accept="image/*"
        :multiple="true"
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
  </div>
</template>

<style lang="scss" scoped></style>
