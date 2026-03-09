<script setup lang="ts">
import { ref, watch } from "vue";
import { EmailModel, EmailParams, EmailType } from "@/modules/employee-email";
import TitleInterface from "@/base/Data/Models/titleInterface";
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";

const emit = defineEmits<{
  updateData: [params: EmailParams];
}>();

const props = defineProps<{
  email?: EmailModel;
}>();

const email = props.email;

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
};

const updateData = () => {
  const params = new EmailParams(
    formEmail.value,
    formType.value?.id as EmailType,
    editingId.value || undefined,
  );
  emit("updateData", params);
};
</script>

<template>
  <div class="email-crud-example">
    <div class="email-form">
      <h3>{{ isEditing ? "Edit Email" : "Add New Email" }}</h3>
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
        <CustomSelectInput
          v-model="formType"
          :staticOptions="emailTypes"
          :placeholder="$t('select_email_type')"
          :required="true"
          :id="'email-type'"
          @update:modelValue="updateType"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
