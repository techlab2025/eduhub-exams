import type { RouteRecordRaw } from "@/router/types";

export const InputsRoutes: RouteRecordRaw[] = [
  {
    path: "inputs",
    name: "Inputs",
    component: () => import("@/views/Inputs/Inputs.vue"),
    props: true,
  },
];
