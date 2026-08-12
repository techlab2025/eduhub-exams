<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Dialog from 'primevue/dialog';
  import AddNoteImage from '@/assets/images/Student/AddNoteImage.svg';

  type NoteLanguage = 'en' | 'ar';

  withDefaults(
    defineProps<{
      studentId: number | null;
      loading?: boolean;
    }>(),
    { loading: false },
  );

  const emit = defineEmits<{
    save: [payload: { studentId: number; note: string; pinned: boolean; language: NoteLanguage }];
  }>();
  const visible = defineModel<boolean>({ default: false });
  const note = ref('');
  const pinned = ref(false);
  const language = ref<NoteLanguage>('en');
  const bold = ref(false);
  const underlined = ref(false);
  const hasError = ref(false);

  const reset = () => {
    note.value = '';
    pinned.value = false;
    language.value = 'en';
    bold.value = false;
    underlined.value = false;
    hasError.value = false;
  };

  const save = (studentId: number | null) => {
    const value = note.value.trim();
    if (!studentId || !value) {
      hasError.value = true;
      return;
    }

    emit('save', { studentId, note: value, pinned: pinned.value, language: language.value });
  };

  watch(visible, (isVisible) => {
    if (!isVisible) reset();
  });
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :style="{ width: 'min(42.5rem, calc(100vw - 2rem))' }"
  >
    <template #container>
      <article class="student-note-dialog">
        <header class="student-note-header">
          <img :src="AddNoteImage" alt="" aria-hidden="true" />
          <div>
            <h2>{{ $t('add_private_note') }}</h2>
            <p>{{ $t('private_note_description') }}</p>
          </div>
        </header>

        <section class="student-note-field">
          <div class="student-note-label-row">
            <label for="student-private-note">{{ $t('note') }}</label>
            <div class="student-note-language" role="group" :aria-label="$t('note_language')">
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

          <div class="student-note-editor" :class="{ invalid: hasError }">
            <div class="student-note-toolbar" role="toolbar" :aria-label="$t('note_formatting')">
              <button
                type="button"
                class="bold-control"
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
                class="underline-control"
                :class="{ active: underlined }"
                :aria-pressed="underlined"
                :aria-label="$t('underline')"
                @click="underlined = !underlined"
              >
                U
              </button>
            </div>
            <textarea
              id="student-private-note"
              v-model="note"
              :dir="language === 'ar' ? 'rtl' : 'ltr'"
              :class="{ bold, underlined }"
              :placeholder="$t('write_note_placeholder')"
              @input="hasError = false"
            />
          </div>
          <small v-if="hasError" class="student-note-error">{{ $t('note_required') }}</small>
        </section>

        <label class="student-note-pin">
          <input v-model="pinned" type="checkbox" />
          <span>{{ $t('pin_note_to_top') }}</span>
        </label>

        <div class="student-note-actions">
          <button
            type="button"
            class="save-note-button"
            :disabled="loading"
            @click="save(studentId)"
          >
            {{ $t('save_note') }}
          </button>
          <button
            type="button"
            class="cancel-note-button"
            :disabled="loading"
            @click="visible = false"
          >
            {{ $t('cancel') }}
          </button>
        </div>
      </article>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
  .student-note-dialog {
    width: 100%;
    padding: 24px;
    display: grid;
    gap: 24px;
    color: var(--standard-black);
    background: var(--BgWhite);
    border-radius: 30px;
    font-family: var(--font-family);
  }

  .student-note-header {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 50px;
      height: 50px;
      flex: 0 0 50px;
    }

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
      margin-top: 4px;
      color: var(--gray-5);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.3;
    }
  }

  .student-note-field {
    display: grid;
    gap: 8px;
  }

  .student-note-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    label {
      color: var(--gray-5);
      font-size: 16px;
      font-weight: 500;
    }
  }

  .student-note-language {
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
      font-family: inherit;
      font-size: 11px;

      &.active {
        color: var(--primary-green);
        background: var(--BgWhite);
      }
    }
  }

  .student-note-editor {
    height: 144px;
    overflow: hidden;
    background: var(--BgWhite);
    border: 1px solid var(--input-border-color);
    border-radius: 20px;

    &.invalid {
      border-color: var(--danger-alt);
    }

    textarea {
      width: 100%;
      height: 108px;
      padding: 16px;
      resize: none;
      color: var(--standard-black);
      background: transparent;
      border: 0;
      outline: 0;
      font-family: inherit;
      font-size: 14px;

      &.bold {
        font-weight: 700;
      }

      &.underlined {
        text-decoration: underline;
      }

      &::placeholder {
        color: var(--gray-text);
      }
    }
  }

  .student-note-toolbar {
    height: 34px;
    padding-inline: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--Gray-6);
    background: var(--input-border-color);

    button {
      width: 18px;
      height: 24px;
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;

      &.active {
        color: var(--primary-green);
      }
    }

    .bold-control {
      font-weight: 700;
    }

    .underline-control {
      text-decoration: underline;
    }
  }

  .student-note-error {
    color: var(--danger-alt);
    font-size: 12px;
  }

  .student-note-pin {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 16px;

    input {
      width: 20px;
      height: 20px;
      margin: 0;
      accent-color: var(--primary-green);
    }
  }

  .student-note-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 16px;

    button {
      height: 56px;
      padding: 0 16px;
      border-radius: var(--radius-full);
      cursor: pointer;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;

      &:disabled {
        cursor: wait;
        opacity: 0.65;
      }
    }
  }

  .save-note-button {
    color: var(--BgWhite);
    background: var(--primary-green);
    border: 1px solid var(--primary-green);
  }

  .cancel-note-button {
    color: var(--standard-black);
    background: var(--background-color-soft-light);
    border: 1px solid var(--input-border-color);
  }

  @media (max-width: 560px) {
    .student-note-dialog {
      padding: 20px;
    }

    .student-note-actions {
      grid-template-columns: 1fr;
    }
  }
</style>
