// stores/formsStore.ts
import { defineStore } from "pinia";
import { dialogManager } from "@/base/Presentation/Dialogs/dialog.manager";
import router from "@/router";
import { ref } from "vue";

export const useFormsStore = defineStore(
  "forms",
  () => {
    const formData = ref<Record<string, any>>({});
    const setFormData = (key: string, data: any) => {
      formData.value[key] = data;
    };

    const getFormData = (key: string) => {
      return formData.value[key];
    };
    const clearFormData = (key: string) => {
      formData.value[key] = null;
    };
    const hasUnsavedChanges = (key: string) => {
      const data = formData.value[key];
      return data && (data.email !== "" || data.type !== undefined);
    };
    const showReturnWarning = (targetPath: string) => {
      if (
        Object.keys(formData.value[targetPath] ?? {}).length === 0 ||
        Object.values(formData.value[targetPath] ?? {}).every((v) => v == null)
      ) {
        return;
      }
      dialogManager.toastInfo("Click here to return to the form", {
        title: "Unsaved Changes",
        duration: 15000,
        onClick: () => {
          console.log("Navigating to:", targetPath);
          if (targetPath) {
            router.push(targetPath);
          }
        },
      });
    };
    return {
      formData,
      setFormData,
      getFormData,
      clearFormData,
      hasUnsavedChanges,
      showReturnWarning,
    };
  },
  {
    persist: {
      key: "forms",
      storage: sessionStorage,
    },
  },
);

