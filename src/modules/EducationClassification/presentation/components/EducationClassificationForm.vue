<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useFormsStore } from '@/stores/formsStore';
  import type EducationClassificationModel from '../../core/models/education.classification.model';
  import AddEducationClassificationParams from '../../core/params/add.educationClassification.params';
  import FolderCrudIcon from '@/shared/icons/FolderCrudIcon.vue';

  const emit = defineEmits(['updateData', 'save-education-classification']);

  const { country, formKey } = defineProps<{
    country?: EducationClassificationModel;
    formKey?: string;
  }>();

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
      } else if (!country) {
        resetForm();
      }
    } else if (!country) {
      resetForm();
    }
  });
</script>

<template>
  <div class="education-classification-form-card">
    <!-- ── Card Header ───────────────────────────────────── -->
    <header class="form-header">
      <div class="header-text">
        <FolderCrudIcon />
        <h3>
          {{ $t(' Add education classification') }}
        </h3>
      </div>
    </header>

    <!-- ── Fields ────────────────────────────────────────── -->
    <div class="education-classification-form-fields">
      <!-- Email Field -->
      <div class="field-group">
        <label class="field-label" for="title"> {{ $t('education classification') }} </label>
        <div class="input-wrap">
          <input
            id="title"
            v-model="title"
            type="text"
            :placeholder="$t('Enter education type')"
            class="field-input"
            @input="updateData"
          />
        </div>
      </div>
      <button class="save-btn" @click="emit('save-education-classification')">
        {{ $t('Save') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  /* ═══════════════════════════════════════════
   EMAIL FORM — Luxury Card Design
   ═══════════════════════════════════════════ */

  .save-btn {
    background-color: var(--PrimaryColor);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    padding: 10px;
    font-size: 16px;
    font-weight: 600;
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 20%;
    margin-top: 25px;
  }

  .education-classification-form-card {
    background: var(--bg-main);
    border-radius: var(--radius-xl);
    background-color: var(--Gray-5);
    overflow: hidden;
    position: relative;
    width: 100%;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent);
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
      background: linear-gradient(135deg, var(--PrimaryColor-light), rgba(238, 242, 255, 0.4));
      color: var(--PrimaryColor);
      flex-shrink: 0;
      box-shadow:
        0 2px 6px rgba(99, 102, 241, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }

    .header-text {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 3px;

      svg {
        width: 26px;
        height: 26px;
      }

      h3 {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--gray-900);
        margin: 0;
        letter-spacing: -0.01em;
        padding-top: 6px;
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
      white-space: nowrap;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
  }

  /* ── Divider ────────────────────────────── */
  .form-divider {
    height: 1px;
    margin: 0 24px;
    background: linear-gradient(90deg, var(--border-weak), rgba(226, 232, 240, 0.3), transparent);
  }

  /* ── Form Fields ────────────────────────── */
  .education-classification-form-fields {
    padding: 20px 24px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 20px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    grid-column: span 3;
    gap: 8px;
    width: 80%;
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
