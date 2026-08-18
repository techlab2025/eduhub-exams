<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import Select from 'primevue/select';
  import BlockImage from '@/assets/images/Student/BlockImage.gif';
  import ReloadIcon from '@/shared/icons/CustomSelect/ReloadIcon.vue';
  import IndexBlockReasonsParams from '@/modules/BlockReasons/core/params/index.blockReason.params';
  import BlockReasonController from '@/modules/BlockReasons/presentation/controllers/blockReason.controller';

  type ReasonLanguage = 'en' | 'ar';

  interface BlockReasonOption {
    id: number;
    title: string;
  }

  withDefaults(
    defineProps<{
      loading?: boolean;
    }>(),
    { loading: false },
  );

  const emit = defineEmits<{
    confirm: [blockReasonId: number, reason: string];
  }>();
  const visible = defineModel<boolean>({ default: false });
  const blockReasonController = BlockReasonController.getInstance();
  const selectedReason = ref<BlockReasonOption | null>(null);
  const reasonOptions = ref<BlockReasonOption[]>([]);
  const reasonsLoading = ref(false);
  const explanation = ref('');
  const language = ref<ReasonLanguage>('en');
  const bold = ref(false);
  const underlined = ref(false);
  const hasReasonError = ref(false);

  const fetchReasonOptions = async () => {
    reasonsLoading.value = true;

    try {
      const options = await blockReasonController.fetchAsOptions(
        new IndexBlockReasonsParams({ withPage: 0, perPage: 100 }),
      );

      reasonOptions.value = options.map((option) => ({
        id: Number(option.id),
        title: option.title ?? '',
      }));
    } finally {
      reasonsLoading.value = false;
    }
  };

  const reset = () => {
    selectedReason.value = null;
    explanation.value = '';
    language.value = 'en';
    bold.value = false;
    underlined.value = false;
    hasReasonError.value = false;
  };

  const confirm = () => {
    if (!selectedReason.value) {
      hasReasonError.value = true;
      return;
    }

    const details = explanation.value.trim();
    const reason = details
      ? `${selectedReason.value.title}: ${details}`
      : selectedReason.value.title;
    emit('confirm', selectedReason.value.id, reason);
  };

  watch(
    visible,
    async (isVisible) => {
      if (isVisible) {
        await fetchReasonOptions();
        return;
      }

      reset();
    },
    { immediate: true },
  );
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :style="{ width: 'min(32.0625rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <article class="student-block-dialog">
        <div class="student-block-image" aria-hidden="true">
          <img :src="BlockImage" alt="" />
        </div>

        <div class="student-block-copy">
          <h2>{{ $t('block_student_dialog_title') }}</h2>
          <p>{{ $t('block_student_dialog_message') }}</p>
        </div>

        <section class="student-block-category">
          <div class="student-block-label-row">
            <label for="student-block-category">
              {{ $t('block_reason') }} <span aria-hidden="true">*</span>
            </label>
            <button
              type="button"
              class="student-block-reset"
              :aria-label="$t('reset_block_reason')"
              @click="selectedReason = null"
            >
              <ReloadIcon />
            </button>
          </div>

          <Select
            v-model="selectedReason"
            input-id="student-block-category"
            :options="reasonOptions"
            option-label="title"
            :placeholder="$t('select_block_reason')"
            :loading="reasonsLoading"
            append-to="self"
            class="student-block-select"
            :class="{ invalid: hasReasonError }"
            :aria-invalid="hasReasonError"
            :aria-describedby="hasReasonError ? 'student-block-category-error' : undefined"
            @change="hasReasonError = false"
          />
          <small v-if="hasReasonError" id="student-block-category-error" role="alert">
            {{ $t('block_reason_required') }}
          </small>
        </section>

        <section class="student-block-details">
          <div class="student-block-label-row">
            <label for="student-block-explanation">{{ $t('block_reason_details') }}</label>
            <div class="student-block-language" role="group" :aria-label="$t('note_language')">
              <button
                type="button"
                :class="{ active: language === 'en' }"
                :aria-pressed="language === 'en'"
                @click="language = 'en'"
              >
                EN
              </button>
              <button
                type="button"
                :class="{ active: language === 'ar' }"
                :aria-pressed="language === 'ar'"
                @click="language = 'ar'"
              >
                AR
              </button>
            </div>
          </div>

          <div class="student-block-editor">
            <div class="student-block-toolbar" role="toolbar" :aria-label="$t('note_formatting')">
              <button
                type="button"
                :class="{ active: bold }"
                :aria-pressed="bold"
                :aria-label="$t('bold')"
                @click="bold = !bold"
              >
                B
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                :class="{ active: underlined }"
                :aria-pressed="underlined"
                :aria-label="$t('underline')"
                @click="underlined = !underlined"
              >
                U
              </button>
            </div>
            <textarea
              id="student-block-explanation"
              v-model="explanation"
              :dir="language === 'ar' ? 'rtl' : 'ltr'"
              :class="{ bold, underlined }"
              :placeholder="$t('block_reason_placeholder')"
            />
          </div>
        </section>

        <p class="student-block-notice">
          <span aria-hidden="true">!</span>
          {{ $t('block_reversible_notice') }}
        </p>

        <div class="student-block-actions">
          <button type="button" class="block-button" :disabled="loading" @click="confirm">
            {{ $t('block_student_dialog_confirm') }}
          </button>
          <button type="button" class="cancel-button" :disabled="loading" @click="visible = false">
            {{ $t('cancel') }}
          </button>
        </div>
      </article>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .student-block-dialog {
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    color: var(--standard-black);
    text-align: center;
    background: var(--BgWhite);
    border-radius: 30px;
    font-family: var(--font-family);
  }

  .student-block-image {
    width: 110px;
    height: 96px;
    overflow: hidden;

    img {
      width: 110px;
      height: 110px;
      display: block;
      object-fit: cover;
    }
  }

  .student-block-copy {
    width: 100%;
    display: grid;
    justify-items: center;
    gap: 8px;

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
    }

    p {
      max-width: 420px;
      color: var(--gray-5);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .student-block-category,
  .student-block-details {
    width: 100%;
    display: grid;
    gap: 8px;
    text-align: start;

    small {
      color: var(--danger-alt);
      font-size: 13px;
    }
  }

  .student-block-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    label {
      color: var(--gray-5);
      font-size: 16px;
      font-weight: 600;
      font-family: "demi";
    }
  
    label span {
      color: var(--danger-alt);
    }
  }

  .student-block-reset {
    width: 24px;
    height: 24px;
    padding: 0;
    display: grid;
    place-items: center;
    color: var(--gray-text);
    background: transparent;
    border: 0;
    cursor: pointer;

    :deep(svg) {
      width: 19px;
      height: 19px;
    }
  }

  .student-block-select {
    width: 100%;
    min-height: 48px;
    border: 1px solid var(--input-border-color);
    border-radius: var(--radius-full);

    &.invalid {
      border-color: var(--danger-alt);
    }

    :deep(.p-select-label) {
      padding-inline: 16px;
      display: flex;
      align-items: center;
      color: var(--standard-black);
      font-size: 14px;
    }

    :deep(.p-select-label.p-placeholder) {
      color: var(--gray-text);
    }

    :deep(.p-select-overlay) {
      max-width: 100%;
    }

    :deep(.p-select-option-label) {
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }

  .student-block-language {
    padding: 3px;
    display: flex;
    background: var(--background-color-soft-light);
    border-radius: var(--radius-full);

    button {
      min-width: 28px;
      min-height: 22px;
      padding: 2px 6px;
      color: var(--gray-text);
      background: transparent;
      border: 0;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-size: 11px;

      &.active {
        color: var(--primary-green);
        background: var(--BgWhite);
      }
    }
  }

  .student-block-editor {
    overflow: hidden;
    border: 1px solid var(--input-border-color);
    border-radius: 12px;

    textarea {
      width: 100%;
      min-height: 88px;
      padding: 12px;
      display: block;
      resize: vertical;
      color: var(--standard-black);
      background: var(--BgWhite);
      border: 0;
      outline: 0;
      font-family: var(--font-family);
      font-size: 14px;
      line-height: 1.5;

      &.bold {
        font-weight: 700;
      }

      &.underlined {
        text-decoration: underline;
      }
    }
  }

  .student-block-toolbar {
    min-height: 32px;
    padding-inline: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--gray-text);
    background: var(--background-color-soft-light);

    button {
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      cursor: pointer;

      &.active {
        color: var(--standard-black);
      }
    }
  }

  .student-block-notice {
    width: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--in-active-color);
    text-align: start;
    font-size: 13px;
    line-height: 1.4;

    span {
      width: 18px;
      height: 18px;
      flex: 0 0 18px;
      display: grid;
      place-items: center;
      border: 1px solid currentColor;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 400;
      font-family: "regular";
    }
  }

  .student-block-actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    button {
      height: 52px;
      padding: 0 16px;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 15px;
      font-weight: 600;

      &:disabled {
        cursor: wait;
        opacity: 0.65;
      }
    }
  }

  .block-button {
    color: var(--BgWhite);
    background: var(--danger-alt);
    border: 1px solid var(--danger-alt);
  }

  .cancel-button {
    color: var(--standard-black);
    background: var(--background-color-soft-light);
    border: 1px solid var(--input-border-color);
  }

  @media (max-width: 520px) {
    .student-block-dialog {
      padding: 20px;
    }

    .student-block-actions {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
</style>
