import type { RouteRecordRaw } from "vue-router";
import { emailRoutes } from "./email";

export const dashboardRoutes: RouteRecordRaw[] = [...emailRoutes];
