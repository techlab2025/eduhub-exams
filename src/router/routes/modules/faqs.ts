import type { RouteRecordRaw } from "@/router/types";

export const faqsRoutes: RouteRecordRaw[] = [
  {
    path: "faqs",
    name: "Faqs",
    component: () => import("@/views/faqs/IndexFaqs.vue"),
    meta: {
      breadcrumb: "Faqs",
    },
  },
];
