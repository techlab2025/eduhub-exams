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
      delete formData.value[key];
    };
    const hasUnsavedChanges = (key: string) => {
      const data = formData.value[key];
      return data && (data.email !== "" || data.type !== undefined);
    };
    const showReturnWarning = (targetPath: string) => {
      dialogManager.toastInfo("Click here to return to the form", {
        title: "Unsaved Changes",
        duration: 15000,
        onClick: () => {
          console.log("Navigating to:", targetPath);
          router.push(targetPath);
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
