import type { RouteRecordRaw } from "@/router/types";

export const emailRoutes: RouteRecordRaw[] = [
  {
    path: "emails",
    name: "Employee Emails",
    component: () => import("@/views/email/EmailIndex.vue"),
  },
  {
    path: "emails/add",
    name: "Add Email",
    component: () => import("@/views/email/EmailAdd.vue"),
  },
  {
    path: "emails/edit/:id",
    name: "Edit Email",
    component: () => import("@/views/email/EmailEdit.vue"),
    props: true,
  },
  {
    path: "inputs",
    name: "Inputs",
    component: () => import("@/views/email/EmailEdit.vue"),
    props: true,
  },
];
