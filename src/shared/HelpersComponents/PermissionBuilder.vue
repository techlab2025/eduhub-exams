<script setup lang="ts">
  import PermissionHandler from '@/base/Presentation/Utils/permission_handler';
  import type { PermissionCode } from '@/modules/Permission/core/enums/permissions.enum';

  defineProps<{
    code: PermissionCode[];
  }>();
</script>

<template>
  <slot v-if="PermissionHandler.Instance.handle(code)" />
  <slot v-else name="notPermitted" />
</template>
