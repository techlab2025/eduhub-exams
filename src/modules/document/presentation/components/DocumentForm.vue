<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useFormsStore } from "@/stores/formsStore";
import type DocumentModel from "../../core/models/document.model";
import AddDocumentParams from "../../core/params/add.document.params";
import UpdatedCustomInputSelect from "@/shared/FormInputs/UpdatedCustomInputSelect.vue";
import TitleInterface from "@/base/Data/Models/titleInterface";

const emit = defineEmits(["updateData"]);

const { document, formKey } = defineProps<{
  document?: DocumentModel;
  formKey?: string;
}>();

const FormStore = useFormsStore();
onBeforeRouteLeave((to, from) => {
  const savedData = FormStore.getFormData(formKey!);
  if (savedData && to.path !== from.path) {
    FormStore.showReturnWarning(formKey!);
  }
});

// Static document type options (ids match documentation: 1, 2, 3)
const documentTypeOptions = [
  new TitleInterface({ id: 1, title: "Document Type 1" }),
  new TitleInterface({ id: 2, title: "Document Type 2" }),
  new TitleInterface({ id: 3, title: "Document Type 3" }),
];

// Form state
const title = ref<string>("");
const subjectId = ref<number>(0);
const stageId = ref<number>(0);
const unitIds = ref<number[]>([]);
const isAllUnits = ref<boolean>(false);
const selectedDocumentType = ref<TitleInterface<number> | null>(null);

watch(
  () => document,
  (newDoc) => {
    if (newDoc) {
      title.value = newDoc.title;
      subjectId.value = newDoc.subjectId;
      stageId.value = newDoc.stageId;
      unitIds.value = newDoc.unitIds;
      isAllUnits.value = newDoc.isAllUnits;
      selectedDocumentType.value =
        documentTypeOptions.find((o) => o.id === newDoc.documentTypeId) ?? null;
    }
  },
  { immediate: true },
);

const route = useRoute();

const updateData = () => {
  FormStore.setFormData(formKey!, {
    title: title.value,
    subjectId: subjectId.value,
    stageId: stageId.value,
    unitIds: unitIds.value,
    isAllUnits: isAllUnits.value,
    documentTypeId: selectedDocumentType.value?.id ?? 0,
  });

  const params = new AddDocumentParams(
    title.value,
    subjectId.value,
    stageId.value,
    unitIds.value,
    selectedDocumentType.value?.id ?? 0,
    isAllUnits.value,
  );
  emit("updateData", params);
};

const resetForm = () => {
  title.value = "";
  subjectId.value = 0;
  stageId.value = 0;
  unitIds.value = [];
  isAllUnits.value = false;
  selectedDocumentType.value = null;
};

onMounted(() => {
  const saved = FormStore.getFormData(formKey!);
  if (saved) {
    title.value = saved.title ?? "";
    subjectId.value = saved.subjectId ?? 0;
    stageId.value = saved.stageId ?? 0;
    unitIds.value = saved.unitIds ?? [];
    isAllUnits.value = saved.isAllUnits ?? false;
    selectedDocumentType.value =
      documentTypeOptions.find((o) => o.id === saved.documentTypeId) ?? null;
    updateData();
  } else {
    resetForm();
  }
});
</script>

<template>
  <div class="email-form-card">
    <!-- ── Card Header ───────────────────────────────────── -->
    <header class="form-header">
      <div class="header-text">
        <h3>{{ route.params.id ? $t("edit_document") : $t("add_document") }}</h3>
        <p class="header-subtitle">
          {{
            route.params.id
              ? $t("update_document_details")
              : $t("fill_document_details")
          }}
        </p>
      </div>
      <span v-if="route.params.id" class="edit-badge">{{ $t("editing") }}</span>
    </header>

    <!-- ── Divider ───────────────────────────────────────── -->
    <div class="form-divider" />

    <!-- ── Fields ────────────────────────────────────────── -->
    <div class="form-fields">
      <!-- Title -->
      <div class="field-group">
        <label class="field-label" for="doc-title">{{ $t("title") }}</label>
        <div class="input-wrap">
          <input
            v-model="title"
            id="doc-title"
            type="text"
            @input="updateData"
            :placeholder="$t('document_title_placeholder')"
            class="field-input"
          />
        </div>
      </div>

      <!-- Subject ID -->
      <div class="field-group">
        <label class="field-label" for="doc-subject">{{ $t("subject_id") }}</label>
        <div class="input-wrap">
          <input
            v-model.number="subjectId"
            id="doc-subject"
            type="number"
            @input="updateData"
            :placeholder="$t('subject_id_placeholder')"
            class="field-input"
          />
        </div>
      </div>

      <!-- Stage ID -->
      <div class="field-group">
        <label class="field-label" for="doc-stage">{{ $t("stage_id") }}</label>
        <div class="input-wrap">
          <input
            v-model.number="stageId"
            id="doc-stage"
            type="number"
            @input="updateData"
            :placeholder="$t('stage_id_placeholder')"
            class="field-input"
          />
        </div>
      </div>

      <!-- Document Type — static select via UpdatedCustomInputSelect -->
      <div class="field-group">
        <UpdatedCustomInputSelect
          v-model="selectedDocumentType"
          :static-options="documentTypeOptions"
          :placeholder="$t('select_document_type')"
          label="document_type"
          id="doc-type-select"
          :reload="false"
          required
          @update:model-value="updateData"
        />
      </div>

      <!-- Is All Units -->
      <div class="field-group checkbox-group">
        <label class="field-label checkbox-label">
          <input
            v-model="isAllUnits"
            type="checkbox"
            class="checkbox-input"
            @change="updateData"
          />
          {{ $t("is_all_units") }}
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.form-fields {
  padding: 20px 24px 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.checkbox-group {
  justify-content: flex-end;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-700);
  text-transform: none;
  letter-spacing: normal;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: var(--PrimaryColor);
  cursor: pointer;
}

@media (max-width: 600px) {
  .form-fields {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 16px;
  }

  .form-header {
    padding: 16px;
    flex-wrap: wrap;
  }

  .form-divider {
    margin: 0 16px;
  }

  .edit-badge {
    display: none;
  }
}
</style>
