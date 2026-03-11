<script lang="ts" setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { dialogManager } from "./dialog.manager";
import { DialogType, DIALOG_ICONS, DIALOG_COLORS } from "./dialog.types";

// Reactive state from dialog manager
const currentDialog = computed(() => dialogManager.currentDialog.value);
const isLoading = computed(() => dialogManager.isLoading.value);
const loadingMessage = computed(() => dialogManager.loadingMessage.value);
const loadingProgress = computed(() => dialogManager.loadingProgress.value);

// Local state
const isVisible = ref(false);
const isClosing = ref(false);
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

// Watch for dialog changes
watch(currentDialog, (newDialog) => {
  if (newDialog) {
    isVisible.value = true;
    isClosing.value = false;
    
    // Clear existing timer
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    
    // Auto-close logic
    const duration = newDialog.duration ?? 3000;
    if (duration > 0) {
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }
  }
});

watch(isLoading, (loading) => {
  if (loading) {
    isVisible.value = true;
    isClosing.value = false;
  } else if (!currentDialog.value) {
    closeWithAnimation();
  }
});

// Computed properties
const dialogType = computed(() => currentDialog.value?.type || DialogType.INFO);

const dialogIcon = computed(() => {
  return currentDialog.value?.icon || DIALOG_ICONS[dialogType.value];
});

const dialogImage = computed(() => {
  return currentDialog.value?.image;
});

const dialogColor = computed(() => {
  return DIALOG_COLORS[dialogType.value];
});

const dialogTitle = computed(() => {
  if (isLoading.value && !currentDialog.value) {
    return "";
  }
  return currentDialog.value?.title || "";
});

const dialogMessage = computed(() => {
  if (isLoading.value && !currentDialog.value) {
    return loadingMessage.value;
  }
  return currentDialog.value?.message || "";
});

const showProgress = computed(() => {
  return (
    currentDialog.value?.type === DialogType.PROGRESS ||
    (isLoading.value && loadingProgress.value > 0)
  );
});

const progressValue = computed(() => {
  if (currentDialog.value?.progress !== undefined) {
    return currentDialog.value.progress;
  }
  return loadingProgress.value;
});

const showCloseButton = computed(() => {
  if (isLoading.value && !currentDialog.value) {
    return false;
  }
  return currentDialog.value?.showClose ?? true;
});

const showActions = computed(() => {
  return currentDialog.value?.actions && currentDialog.value.actions.length > 0;
});

// Methods
function closeWithAnimation() {
  isClosing.value = true;
  isVisible.value = false;
  
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

function handleAfterLeave() {
  isClosing.value = false;
  dialogManager.closeDialog();
}

function handleClose() {
  if (currentDialog.value?.onCancel) {
    currentDialog.value.onCancel();
  }
  closeWithAnimation();
}

function handleBackdropClick() {
  if (currentDialog.value?.closeOnBackdrop !== false && !isLoading.value) {
    handleClose();
  }
}

async function handleAction(action: any) {
  if (action.disabled || action.loading) return;

  try {
    action.loading = true;
    await action.onClick();
  } finally {
    action.loading = false;
  }

  if (action.closeOnClick) {
    handleClose();
  }
}

function handleConfirm() {
  if (currentDialog.value?.onConfirm) {
    currentDialog.value.onConfirm();
  }
  handleClose();
}

// Keyboard handler
function handleKeydown(e: KeyboardEvent) {
  if (
    e.key === "Escape" &&
    currentDialog.value?.closeOnEscape !== false &&
    !isLoading.value
  ) {
    handleClose();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

// Type helpers
function getActionClass(type?: string): string {
  switch (type) {
    case "primary":
      return "dialog-action-primary";
    case "danger":
      return "dialog-action-danger";
    case "text":
      return "dialog-action-text";
    default:
      return "dialog-action-secondary";
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade" @after-leave="handleAfterLeave">
      <div
        v-if="isVisible"
        class="unified-dialog-backdrop"
        :class="{ 'is-closing': isClosing }"
        @click.self="handleBackdropClick"
      >
        <Transition name="dialog-zoom">
          <div
            v-if="isVisible"
            class="unified-dialog"
            :class="[
              `dialog-type-${dialogType}`,
              currentDialog?.customClass,
              { 'is-closing': isClosing },
            ]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Loading Spinner -->
            <div v-if="isLoading && !currentDialog" class="dialog-loading">
              <div class="loading-spinner"></div>
              <p v-if="loadingMessage" class="loading-message">
                {{ loadingMessage }}
              </p>
              <div v-if="showProgress" class="loading-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${progressValue}%` }"
                  ></div>
                </div>
                <span class="progress-text"
                  >{{ Math.round(progressValue) }}%</span
                >
              </div>
            </div>

            <!-- Dialog Content -->
            <template v-else-if="currentDialog">
              <!-- Close Button -->
              <button
                v-if="showCloseButton"
                class="dialog-close"
                @click="handleClose"
                aria-label="Close dialog"
              >
                ×
              </button>

              <!-- Image -->
              <div v-if="dialogImage" class="dialog-image-container">
                <img
                  :src="dialogImage"
                  alt="Dialog Image"
                  class="dialog-image"
                />
              </div>

              <!-- Icon -->
              <div
                v-else
                class="dialog-icon"
                :style="{ backgroundColor: dialogColor }"
              >
                {{ dialogIcon }}
              </div>

              <!-- Title -->
              <h3 v-if="dialogTitle" class="dialog-title">
                {{ dialogTitle }}
              </h3>

              <!-- Message -->
              <p class="dialog-message">
                {{ dialogMessage }}
              </p>

              <!-- Progress Bar -->
              <div v-if="showProgress" class="dialog-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${progressValue}%`,
                      backgroundColor: dialogColor,
                    }"
                  ></div>
                </div>
                <span class="progress-text"
                  >{{ Math.round(progressValue) }}%</span
                >
              </div>

              <!-- Actions -->
              <div v-if="showActions" class="dialog-actions">
                <button
                  v-for="(action, index) in currentDialog.actions"
                  :key="index"
                  :class="['dialog-action', getActionClass(action.type)]"
                  :disabled="action.disabled || action.loading"
                  @click="handleAction(action)"
                >
                  <span v-if="action.loading" class="action-spinner"></span>
                  {{ action.label }}
                </button>
              </div>

              <!-- Default Confirm Actions for confirm type -->
              <div
                v-else-if="currentDialog.type === 'confirm'"
                class="dialog-actions"
              >
                <button
                  class="dialog-action dialog-action-secondary"
                  @click="handleClose"
                >
                  Cancel
                </button>
                <button
                  class="dialog-action dialog-action-primary"
                  @click="handleConfirm"
                >
                  Confirm
                </button>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.unified-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Dialog Container */
.unified-dialog {
  position: relative;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
}

/* Close Button */
.dialog-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f1f5f9;
  color: #334155;
}

/* Icon */
.dialog-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2rem;
  color: white;
}

/* Image */
.dialog-image {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  display: block;
  object-fit: contain;
}

/* Title */
.dialog-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

/* Message */
.dialog-message {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  color: #64748b;
  line-height: 1.5;
}

/* Progress */
.dialog-progress,
.loading-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary, #6366f1);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

/* Actions */
.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.dialog-action {
  flex: 1;
  max-width: 150px;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dialog-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-action-primary {
  background: var(--color-primary, #6366f1);
  color: white;
}

.dialog-action-primary:hover:not(:disabled) {
  background: #4f46e5;
}

.dialog-action-secondary {
  background: #f1f5f9;
  color: #475569;
}

.dialog-action-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.dialog-action-danger {
  background: #ef4444;
  color: white;
}

.dialog-action-danger:hover:not(:disabled) {
  background: #dc2626;
}

.dialog-action-text {
  background: transparent;
  color: #6366f1;
}

.dialog-action-text:hover:not(:disabled) {
  background: #f1f5f9;
}

/* Loading */
.dialog-loading {
  padding: 1rem;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  border: 3px solid #e2e8f0;
  border-top-color: var(--color-primary, #6366f1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  margin: 0 0 1rem;
  color: #64748b;
}

.action-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transitions */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-zoom-enter-active,
.dialog-zoom-leave-active {
  transition: all 0.2s ease;
}

.dialog-zoom-enter-from,
.dialog-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .unified-dialog {
    background: #1e293b;
  }

  .dialog-title {
    color: #f1f5f9;
  }

  .dialog-message {
    color: #94a3b8;
  }

  .dialog-close {
    color: #94a3b8;
  }

  .dialog-close:hover {
    background: #334155;
    color: #f1f5f9;
  }

  .dialog-action-secondary {
    background: #334155;
    color: #e2e8f0;
  }

  .dialog-action-secondary:hover:not(:disabled) {
    background: #475569;
  }

  .progress-bar {
    background: #334155;
  }
}
</style>
