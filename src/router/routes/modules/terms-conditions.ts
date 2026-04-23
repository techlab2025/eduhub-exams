import type { RouteRecordRaw } from "@/router/types";

export const termsConditionsRoutes: RouteRecordRaw[] = [
  {
    path: "terms-conditions",
    name: "TermsConditions",
    component: () => import("@/views/TermsConditions/IndexTermsConditions.vue"),
    meta: {
      breadcrumb: "TermsConditions",
    },
  },
];
