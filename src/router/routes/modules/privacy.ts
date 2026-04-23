import type { RouteRecordRaw } from "@/router/types";

export const privacyRoutes: RouteRecordRaw[] = [
  {
    path: "privacy",
    name: "Privacy",
    component: () => import("@/views/Privacy/IndexPrivacy.vue"),
    meta: {
      breadcrumb: "Privacy",
    },
  },
];
