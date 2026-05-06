<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave, useRoute } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type AdminModel from '../../core/models/admin.model';
  import AddAdminParams from '../../core/params/add.admin.params';

  const emit = defineEmits(['updateData']);

  const { admin, formKey } = defineProps<{
    admin?: AdminModel;
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

  watch(
    () => admin,
    (newAdmin) => {
      if (newAdmin) {
        name.value = newAdmin.name;
        email.value = newAdmin.email;
        phone.value = newAdmin.phone;
        // Password is not populated for security/editing purposes
      }
    },
    { immediate: true },
  );

  const route = useRoute();

  const updateData = () => {
    FormStore.setFormData(formKey!, {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    });

    const params = new AddAdminParams({
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    });

    emit('updateData', params);
  };

  const resetForm = () => {
    name.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
  };

  onMounted(() => {
    const saved = FormStore.getFormData(formKey!);

    if (saved) {
      name.value = saved.name;
      email.value = saved.email;
      phone.value = saved.phone;
      password.value = saved.password;
      updateData();
    } else if (!admin) {
      resetForm();
    }
  });
</script>

<template>
  <div class="admin-form-card">
    <header class="form-header">
      <div class="header-text">
        <h3>{{ route.params.id ? $t('edit_admin') : $t('add_admin') }}</h3>
        <p class="header-subtitle">
          {{ route.params.id ? $t('update_admin_details') : $t('fill_admin_details') }}
        </p>
      </div>
      <span v-if="route.params.id" class="edit-badge">{{ $t('Editing') }}</span>
    </header>

    <div class="form-divider" />

    <div class="form-fields">
      <div class="field-group">
        <label class="field-label" for="name"> {{ $t('admin_name') }} </label>
        <div class="input-wrap">
          <input
            id="name"
            v-model="name"
            type="text"
            :placeholder="$t('admin_name')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="email"> {{ $t('admin_email') }} </label>
        <div class="input-wrap">
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="$t('admin_email')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="phone"> {{ $t('admin_phone') }} </label>
        <div class="input-wrap">
          <input
            id="phone"
            v-model="phone"
            type="tel"
            :placeholder="$t('admin_phone')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="password"> {{ $t('admin_password') }} </label>
        <div class="input-wrap">
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="$t('admin_password')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
