<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';

  const props = defineProps<{ visible: boolean }>();
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
            aria-labelledby="dialog-title"
          >
            <!-- Header -->
            <div class="dialog-header">
              <div class="dialog-icon">
                <img
                  src="https://em-content.zobj.net/source/apple/354/graduation-cap_1f393.png"
                  alt="graduation"
                  width="40"
                />
              </div>
              <div>
                <h3 id="dialog-title" class="dialog-title">Add Education Type</h3>
                <p class="dialog-subtitle">Enter The Name Of The Education Type You Want To Add</p>
              </div>
            </div>

            <div class="dialog-divider" />

            <!-- Body -->
            <div class="dialog-body">
              <label class="field-label" for="edu-type-input">Education Type</label>
              <input
                id="edu-type-input"
                ref="inputRef"
                v-model="inputValue"
                type="text"
                placeholder="Enter Education Type"
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
