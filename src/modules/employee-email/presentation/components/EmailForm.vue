<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { EmailModel, EmailParams, EmailType } from "@/modules/employee-email";
import TitleInterface from "@/base/Data/Models/titleInterface";
import UpdatedCustomInputSelect from "@/shared/FormInputs/UpdatedCustomInputSelect.vue";

import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useFormsStore } from "@/stores/formsStore";

const { email, formKey } = defineProps<{
  email?: EmailModel;
  formKey?: string;
}>();

const FormStore = useFormsStore();
onBeforeRouteLeave((to, from) => {
  const savedData = FormStore.getFormData(formKey!);
  if (savedData && to.path !== from.path) {
    FormStore.showReturnWarning(formKey!);
  }
});

const emit = defineEmits<{
  updateData: [params: EmailParams];
}>();

// const email = props.email;

// Form state
const formEmail = ref("");
const formType = ref<TitleInterface<EmailType> | null>(null);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const emailTypes: TitleInterface<EmailType>[] = [
  new TitleInterface({ id: EmailType.EMPLOYEE, title: "Employee" }),
  new TitleInterface({ id: EmailType.PERSONAL, title: "Personal" }),
];

watch(
  () => email,
  (newEmail) => {
    if (newEmail) {
      formEmail.value = newEmail.email;
      formType.value = emailTypes.find((t) => t.id === newEmail.type) ?? null;
      editingId.value = newEmail.id ?? null;
      isEditing.value = true;
    }
  },
  { immediate: true },
);

const updateType = (type: TitleInterface<EmailType>) => {
  formType.value = type;
  updateData();
};
const route = useRoute();

const updateData = () => {
  FormStore.setFormData(formKey!, {
    email: formEmail.value.length > 0 ? formEmail.value : null,
    type: formType.value?.id,
    id: editingId.value || undefined,
  });
  const params = new EmailParams(
    formEmail.value,
    formType.value?.id as EmailType,
    editingId.value || undefined,
  );
  emit("updateData", params);
};

const resetForm = () => {
  formEmail.value = "";
  formType.value = null;
  editingId.value = null;
  isEditing.value = false;
};

onMounted(() => {
  const saved = FormStore.getFormData(formKey!);
  if (saved) {
    formEmail.value = saved.email;
    formType.value = emailTypes.find((t) => t.id === saved.type) ?? null;
    editingId.value = saved.id ?? null;
    updateData();
  } else {
    resetForm();
  }
});
</script>

<template>
  <div class="email-crud-example">
    <h3>{{ route.params.id ? "Edit Email" : "Add New Email" }}</h3>
    <div class="email-form">
      <div class="input-wrapper">
        <label for="email">Email</label>
        <input
          v-model="formEmail"
          type="email"
          @input="updateData"
          placeholder="Enter email address"
          class="input"
        />
      </div>

      <div class="input-wrapper">
        <UpdatedCustomInputSelect
          v-model="formType"
          :staticOptions="emailTypes"
          :placeholder="$t('select_email_type')"
          :required="true"
          :id="'email-type'"
          label="Employee Type"
          @update:modelValue="updateType"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.email-form {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    color: black;
  }
}
</style>
