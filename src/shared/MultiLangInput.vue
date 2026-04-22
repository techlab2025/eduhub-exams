<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  modelValue?: Record<string, string>;
  fieldKey: string;
  languages?: string[];
  label?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  languages: () => ["en", "ar"],
  label: "",
  placeholder: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, string>): void;
  (e: "update:data", value: Record<string, Record<string, string>>): void;
}>();

// Active language state
const activeLang = ref(props.languages[0]);

// Internal state to handle reactivity smoothly
const internalValue = ref({ ...props.modelValue });

// Sync internal state with prop changes
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = { ...newVal };
  },
  { deep: true },
);

// Computed value for the input field
const currentValue = computed({
  get: () => internalValue.value[activeLang.value!] || "",
  set: (val: string) => {
    internalValue.value[activeLang.value!] = val;

    // Emit the record of languages
    emit("update:modelValue", { ...internalValue.value });

    // Emit the wrapped data with fieldKey
    emit("update:data", {
      [props.fieldKey]: { ...internalValue.value },
    });
  },
});

const handleLangSwitch = (lang: string) => {
  activeLang.value = lang;
};
</script>

<template>
  <div class="multi-lang-input">
    <div class="header">
      <label v-if="label" class="field-label">{{ label }}</label>

      <div class="lang-switcher">
        <button
          v-for="lang in languages"
          :key="lang"
          type="button"
          class="lang-btn"
          :class="{ active: activeLang === lang }"
          @click="handleLangSwitch(lang)"
        >
          {{ lang.toUpperCase() }}
          <span v-if="internalValue[lang]" class="dot"></span>
        </button>
      </div>
    </div>

    <div class="input-wrap">
      <input
        v-model="currentValue"
        type="text"
        :placeholder="
          placeholder ||
          `Enter ${label.toLowerCase()} in ${activeLang?.toUpperCase()}...`
        "
        class="field-input"
        :dir="activeLang === 'ar' ? 'rtl' : 'ltr'"
      />
      <span class="active-indicator">{{ activeLang?.toUpperCase() }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-lang-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  padding: 0 !important;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lang-switcher {
  display: flex;
  gap: 4px;
  background: var(--gray-100);
  padding: 3px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-weak);
}

.lang-btn {
  position: relative;
  border: none;
  background: transparent;
  padding: 4px 10px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--gray-500);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: var(--gray-900);
  }

  &.active {
    background: var(--bg-main);
    color: var(--PrimaryColor);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--PrimaryColor);
    opacity: 0.6;
  }
}

.input-wrap {
  position: relative;
}

.field-input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 50px; // Space for indicator
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

.active-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--gray-300);
  background: var(--gray-100);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  text-transform: uppercase;
}

// RTL support for indicator
[dir="rtl"] .active-indicator,
.field-input[dir="rtl"] + .active-indicator {
  right: auto;
  left: 12px;
}

.field-input[dir="rtl"] {
  padding-right: 16px;
  padding-left: 50px;
}
</style>
