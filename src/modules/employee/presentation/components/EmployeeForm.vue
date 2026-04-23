<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave, useRoute } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type EmployeeModel from '../../core/models/employee.model';
  import AddEmployeeParams from '../../core/params/add.employee.params';
  import EditEmployeeParams from '../../core/params/edit.employee.params';

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
      updateData();
    } else if (!employee) {
      resetForm();
    }
  });
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
              : 'Fill in the employee information'
          }}
        </p>
      </div>
      <span v-if="route.params.id" class="edit-badge">Editing</span>
    </header>

    <div class="form-divider" />

    <div class="form-fields">
      <div class="field-group">
        <label class="field-label" for="name">Full Name</label>
        <div class="input-wrap">
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter full name"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="email">Email address</label>
        <div class="input-wrap">
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter email address"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="phone">Phone Number</label>
        <div class="input-wrap">
          <input
            id="phone"
            v-model="phone"
            type="text"
            placeholder="Enter phone number"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="password">Password</label>
        <div class="input-wrap">
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="role_id">Role ID</label>
        <div class="input-wrap">
          <input
            id="role_id"
            v-model.number="role_id"
            type="number"
            placeholder="Enter role ID"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="employeeType">Employee Type</label>
        <div class="input-wrap">
          <input
            id="employeeType"
            v-model.number="employeeType"
            type="number"
            placeholder="Enter employee type"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group checkbox-group">
        <label class="checkbox-label">
          <input v-model="isSuperadmin" type="checkbox" @change="updateData" />
          <span>Superadmin access</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .employee-form-card {
    background: var(--bg-main);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-strong);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.04),
      0 8px 32px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    position: relative;
  }

  .form-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 24px 16px;

    .header-text {
      flex: 1;

      h3 {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--gray-900);
        margin: 0;
        letter-spacing: -0.01em;
      }

      .header-subtitle {
        margin-top: 2px;
        font-size: 0.8rem;
        color: var(--gray-400);
        margin-bottom: 0;
      }
    }

    .edit-badge {
      padding: 4px 12px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--warning-light), rgba(254, 243, 199, 0.5));
      color: var(--warning-dark);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .form-divider {
    height: 1px;
    margin: 0 24px;
    background: linear-gradient(90deg, var(--border-weak), rgba(226, 232, 240, 0.3), transparent);
  }

  .form-fields {
    padding: 20px 24px 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checkbox-group {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
  }

  .field-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--gray-700);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .field-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    color: var(--gray-800);
    background: var(--gray-50);
    outline: none;
    transition: all 0.25s ease;

    &:focus {
      border-color: var(--PrimaryColor);
      background: var(--bg-main);
      box-shadow: 0 0 0 3px var(--PrimaryColor-light);
    }
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--gray-700);

    input {
      width: 18px;
      height: 18px;
      accent-color: var(--PrimaryColor);
    }
  }

  @media (max-width: 600px) {
    .form-fields {
      grid-template-columns: 1fr;
    }

    .checkbox-group {
      grid-column: span 1;
    }
  }
</style>
