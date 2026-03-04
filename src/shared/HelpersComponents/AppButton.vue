<script lang="ts" setup>
import { computed } from "vue";

export type ButtonTheme = "primary" | "secondary" | "third" | "danger";
export type ButtonType = "button" | "submit" | "reset";
export type ButtonSize = "sm" | "md" | "lg";
export type IconPosition = "left" | "right";

const props = withDefaults(
  defineProps<{
    theme?: ButtonTheme;
    type?: ButtonType;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    iconOnly?: boolean;
    icon?: IconPosition;
    block?: boolean;
    outline?: boolean;
    ghost?: boolean;
    to?: string | object;
    href?: string;
    target?: string;
  }>(),
  {
    theme: "primary",
    type: "button",
    size: "md",
    disabled: false,
    loading: false,
    iconOnly: false,
    block: false,
    outline: false,
    ghost: false,
  },
);

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isDisabled = computed(() => props.disabled || props.loading);
const hasIcon = computed(() => props.iconOnly || props.icon !== undefined);

// Determine root element
const tag = computed(() => {
  if (props.to) return "router-link";
  if (props.href) return "a";
  return "button";
});

// Build attributes depending on tag
const rootAttrs = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href, target: props.target };
  return { type: props.type, disabled: isDisabled.value };
});
</script>

<template>
  <component
    :is="tag"
    v-bind="rootAttrs"
    class="app-btn btn"
    :class="[
      `btn-${theme}`,
      `btn--${size}`,
      {
        'btn--block': block,
        'btn--icon-only': iconOnly,
        'btn--outline': outline,
        'btn--ghost': ghost,
        'btn--loading': loading,
        'btn--disabled': isDisabled,
        'btn--has-icon': hasIcon && !iconOnly,
      },
    ]"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined"
    @click="!isDisabled && $emit('click', $event)"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="btn__spinner" />

    <!-- Icon left -->
    <span v-if="icon === 'left' && !loading" class="btn__icon btn__icon--left">
      <slot name="icon" />
    </span>

    <!-- Icon only -->
    <span v-if="iconOnly && !loading" class="btn__icon">
      <slot name="icon">
        <slot />
      </slot>
    </span>

    <!-- Text content -->
    <span v-if="!iconOnly" class="btn__text">
      <slot />
    </span>

    <!-- Icon right -->
    <span
      v-if="icon === 'right' && !loading"
      class="btn__icon btn__icon--right"
    >
      <slot name="icon" />
    </span>
  </component>
</template>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

/* ================================================================
   Base (extends what the global .btn already provides)
   ================================================================ */
.app-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  line-height: 1;
  user-select: none;
  white-space: nowrap;
  vertical-align: middle;
}

/* ---- Sizes ---- */
.btn--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  gap: 0.25rem;
}

.btn--lg {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  gap: 0.5rem;
}

/* ---- Block ---- */
.btn--block {
  width: 100%;
}

/* ---- Icon only ---- */
.btn--icon-only {
  padding: 0.5rem;
  aspect-ratio: 1;
  border-radius: 50%;

  .btn__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.btn--icon-only.btn--sm {
  padding: 0.375rem;
}

.btn--icon-only.btn--lg {
  padding: 0.625rem;
}

/* ---- Icon + text ---- */
.btn__icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  :deep(svg) {
    width: 1em;
    height: 1em;
  }
}

/* ---- Outline variants ---- */
.btn--outline.btn-primary {
  background-color: transparent;
  color: $PrimaryColor;
  border: 1.5px solid $PrimaryColor;

  &:hover:not(.btn--disabled) {
    background-color: $PrimaryColor;
    color: $SecondaryColor;
  }
}

.btn--outline.btn-secondary {
  background-color: transparent;
  color: $PrimaryColor;
  border: 1.5px solid $SecondaryColor;

  &:hover:not(.btn--disabled) {
    background-color: $SecondaryColor;
    color: $PrimaryColor;
  }
}

.btn--outline.btn-third {
  background-color: transparent;
  color: $TextGray6;
  border: 1.5px solid $TextGray6;

  &:hover:not(.btn--disabled) {
    background-color: $GoldColor;
    color: $SecondaryColor;
    border-color: $GoldColor;
  }
}

.btn--outline.btn-danger {
  background-color: transparent;
  color: $BgRed;
  border: 1.5px solid $BgRed;

  &:hover:not(.btn--disabled) {
    background-color: $BgRed;
    color: $BgWhite;
  }
}

/* ---- Ghost variants (no bg, no border) ---- */
.btn--ghost {
  background-color: transparent !important;
  border: none !important;
}

.btn--ghost.btn-primary {
  color: $PrimaryColor;

  &:hover:not(.btn--disabled) {
    background-color: rgba($PrimaryColor, 0.08) !important;
  }
}

.btn--ghost.btn-secondary {
  color: $SecondaryColor;

  &:hover:not(.btn--disabled) {
    background-color: rgba($SecondaryColor, 0.08) !important;
  }
}

.btn--ghost.btn-danger {
  color: $BgRed;

  &:hover:not(.btn--disabled) {
    background-color: rgba($BgRed, 0.08) !important;
  }
}

/* ---- Disabled ---- */
.btn--disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

/* ---- Loading ---- */
.btn--loading {
  cursor: wait;
  pointer-events: none;
}

.btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: app-btn-spin 0.6s linear infinite;
}

@keyframes app-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
