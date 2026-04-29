<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';

  const props = defineProps<{
    visible: boolean;
    level: number;
  }>();

  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
    (e: 'confirm', name: string): void;
  }>();

  const inputValue = ref('');
  const inputRef = ref<HTMLInputElement | null>(null);

  watch(
    () => props.visible,
    async (val) => {
      if (val) {
        inputValue.value = '';
        await nextTick();
        inputRef.value?.focus();
      }
    },
  );

  function handleConfirm() {
    const name = inputValue.value.trim();
    if (!name) return;
    emit('confirm', name);
    inputValue.value = '';
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="visible" class="overlay" @click.self="$emit('update:visible', false)">
        <Transition name="dialog-pop">
          <div
            v-if="visible"
            class="dialog"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="`branch-dialog-title`"
          >
            <!-- Header -->
            <div class="dialog-header">
              <div class="dialog-icon">
                <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
                  <!-- Tree/branch icon -->
                  <rect
                    x="6"
                    y="22"
                    width="12"
                    height="8"
                    rx="2"
                    fill="#e8f5e9"
                    stroke="#4caf50"
                    stroke-width="1.5"
                  />
                  <rect
                    x="30"
                    y="10"
                    width="12"
                    height="8"
                    rx="2"
                    fill="#c8e6c9"
                    stroke="#4caf50"
                    stroke-width="1.5"
                  />
                  <rect
                    x="30"
                    y="30"
                    width="12"
                    height="8"
                    rx="2"
                    fill="#c8e6c9"
                    stroke="#4caf50"
                    stroke-width="1.5"
                  />
                  <path
                    d="M18 26H24M24 14h6M24 34h6M24 14V34"
                    stroke="#4caf50"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div>
                <h3 :id="`branch-dialog-title`" class="dialog-title">
                  Add A New Branch{{ level }}
                </h3>
                <p class="dialog-subtitle">
                  Enter Your Preferred Branch{{ level }} Name Within The Tree
                </p>
              </div>
            </div>

            <!-- Body -->
            <div class="dialog-body">
              <label class="field-label" :for="`branch-input-${level}`"
                >Branch{{ level }} Name</label
              >
              <input
                :id="`branch-input-${level}`"
                ref="inputRef"
                v-model="inputValue"
                type="text"
                :placeholder="`Enter Branch${level} Name`"
                class="field-input"
                @keydown.enter="handleConfirm"
                @keydown.esc="$emit('update:visible', false)"
              />
            </div>

            <!-- Footer -->
            <div class="dialog-footer">
              <button class="btn-confirm" :disabled="!inputValue.trim()" @click="handleConfirm">
                Add
              </button>
              <button class="btn-cancel" @click="$emit('update:visible', false)">Cancel</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
