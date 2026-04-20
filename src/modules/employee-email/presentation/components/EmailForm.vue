<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { EmailModel, EmailParams, EmailType } from "@/modules/employee-email";
import TitleInterface from "@/base/Data/Models/titleInterface";
import UpdatedCustomInputSelect from "@/shared/FormInputs/UpdatedCustomInputSelect.vue";

import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useFormsStore } from "@/stores/formsStore";
import HandleFilesUpload from "@/shared/FormInputs/HandleFilesUpload.vue";

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
    email:
      formEmail.value && formEmail.value?.length > 0 ? formEmail.value : null,
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

interface FileUploadEvent {
  name: string;
  size: number;
  type: string;
}

const UploadedFiles = ref<FileUploadEvent[]>([]);
const handleFilesChange = (files: FileUploadEvent[]) => {
  UploadedFiles.value = files;
};
</script>

<template>
  <div class="email-form-card">
    <!-- ── Card Header ───────────────────────────────────── -->
    <header class="form-header">
      <div class="header-icon">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>
      <div class="header-text">
        <h3>{{ route.params.id ? "Edit Email" : "Add New Email" }}</h3>
        <p class="header-subtitle">
          {{
            isEditing
              ? "Update the email details below"
              : "Fill in the email address and type"
          }}
        </p>
      </div>
      <span v-if="isEditing" class="edit-badge">Editing</span>
    </header>

    <!-- ── Divider ───────────────────────────────────────── -->
    <div class="form-divider" />

    <!-- ── Fields ────────────────────────────────────────── -->
    <div class="form-fields">
      <!-- Email Field -->
      <div class="field-group">
        <label class="field-label" for="email">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Email Address
        </label>
        <div class="input-wrap">
          <input
            v-model="formEmail"
            id="email"
            type="email"
            @input="updateData"
            placeholder="name@company.com"
            class="field-input"
          />
        </div>
      </div>

      <!-- Type Field -->
      <div class="field-group">
        <label class="field-label">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Email Type
        </label>
        <UpdatedCustomInputSelect
          v-model="formType"
          :staticOptions="emailTypes"
          :placeholder="$t('select_email_type')"
          :required="true"
          id="email-type"
          label="Employee Type"
          @update:modelValue="updateType"
        />
      </div>

      <HandleFilesUpload
        :label="$t('contract')"
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
        :max-files="2"
        :multiple="false"
        @change="handleFilesChange"
        className="input-file"
        :index="1"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ═══════════════════════════════════════════
   EMAIL FORM — Luxury Card Design
   ═══════════════════════════════════════════ */

.email-form-card {
  background: var(--bg-main);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-strong);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(99, 102, 241, 0.15),
      transparent
    );
    pointer-events: none;
  }
}

/* ── Form Header ────────────────────────── */
.form-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px 16px;

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: linear-gradient(
      135deg,
      var(--PrimaryColor-light),
      rgba(238, 242, 255, 0.4)
    );
    color: var(--PrimaryColor);
    flex-shrink: 0;
    box-shadow:
      0 2px 6px rgba(99, 102, 241, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

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
    background: linear-gradient(
      135deg,
      var(--warning-light),
      rgba(254, 243, 199, 0.5)
    );
    color: var(--warning-dark);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
}

/* ── Divider ────────────────────────────── */
.form-divider {
  height: 1px;
  margin: 0 24px;
  background: linear-gradient(
    90deg,
    var(--border-weak),
    rgba(226, 232, 240, 0.3),
    transparent
  );
}

/* ── Form Fields ────────────────────────── */
.form-fields {
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.04em;

  svg {
    color: var(--PrimaryColor);
    flex-shrink: 0;
  }
}

.input-wrap {
  position: relative;
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
  font-family: var(--font-family);

  &::placeholder {
    color: var(--gray-400);
  }

  &:focus {
    border-color: var(--PrimaryColor);
    background: var(--bg-main);
    box-shadow:
      0 0 0 3px var(--PrimaryColor-light),
      0 2px 8px rgba(99, 102, 241, 0.06);
  }

  &:hover:not(:focus) {
    border-color: var(--gray-300);
    background: var(--bg-main);
  }
}

/* ── Deep: Custom Input Select ──────────── */
:deep(.myacc) {
  border: none;
}

:deep(.AccordionPanel) {
  border: 1px solid var(--border-weak) !important;
  border-radius: var(--radius-md) !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--gray-50);

  &:hover {
    border-color: var(--PrimaryColor) !important;
  }
}

:deep(.AccordionHeader) {
  padding: 12px 16px;
  background: transparent;
  border: none;
  font-weight: 600;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: var(--PrimaryColor-light);
    color: var(--PrimaryColor);
  }
}

:deep(.AccordionContent) {
  background: var(--bg-main);
  color: var(--gray-600);
  padding: 12px 16px;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 600px) {
  .form-header {
    padding: 16px;
    flex-wrap: wrap;
  }

  .form-fields {
    padding: 16px;
    gap: 16px;
  }

  .form-divider {
    margin: 0 16px;
  }

  .edit-badge {
    display: none;
  }
}
</style>
