<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import HighlightBadgeController from '../controllers/highlightBadge.controller';
  import HighlightBadgeForm from './HighlightBadgeForm.vue';
  import type EditHighLightsBadgesParams from '../../core/params/edit.highlightBadge.params';
  import ShowHighLightsBadgesParams from '../../core/params/show.highlightBadge.params';

  const controller = HighlightBadgeController.getInstance();
  const route = useRoute();
  const router = useRouter();
  const formKey = route.fullPath;
  const params = ref<EditHighLightsBadgesParams | null>(null);
  const loading = ref(false);

  const updateData = (updatedParams: EditHighLightsBadgesParams) => {
    params.value = updatedParams;
  };

  const saveHighlightBadge = async () => {
    if (!params.value) {
      console.error('No highlight badge parameters to update');
      return;
    }

    loading.value = true;
    try {
      const result = await controller.update(params.value);
      if (result?.data || !result?.hasError) {
        await router.push({ name: 'Highlight Badges' });
        await controller.fetchList();
      }
    } catch (error) {
      console.error('Error updating highlight badge:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await controller.fetchOne(
      new ShowHighLightsBadgesParams({
        highlightBadgeId: Number(route.params.id),
      }),
    );
  });
</script>

<template>
  <div class="highlight-badge-edit-page">
    <HighlightBadgeForm
      :highlight-badge="controller.itemData.value!"
      :form-key="formKey"
      :loading="loading"
      @update-data="updateData"
    />

    <div class="actions" :class="{ disabled: loading }">
      <button
        class="btn btn-primary w-full"
        type="button"
        :disabled="loading"
        @click="saveHighlightBadge"
      >
        <span v-if="loading" class="loader"></span>
        <span v-else>{{ $t('update_highlight_badge') }}</span>
      </button>
      <router-link to="/highlight-badges" class="btn btn-cancel">
        {{ $t('cancel') }}
      </router-link>
    </div>

    <!-- <div v-if="controller.errorMessage.value" class="error-toast">
      {{ controller.errorMessage.value }}
    </div> -->
  </div>
</template>

<style scoped lang="scss">
  .loader {
    width: 35px;
    height: 35px;
    border: 8px solid;
    border-color: var(--Black) transparent;
    border-radius: var(--radius-full);
    animation: loading-spin 1s infinite;
  }

  @keyframes loading-spin {
    to {
      transform: rotate(0.5turn);
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--xs-size);
    margin-top: var(--xl-size-base);

    &.disabled {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  .error-toast {
    margin-top: var(--xl-size-base);
    padding: var(--xs-size) var(--xl-size-base);
    color: var(--error-dark);
    background: var(--error-light);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-md);
  }
</style>
