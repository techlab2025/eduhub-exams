import type { RouteRecordRaw } from "vue-router";
import { countryRoutes } from "./country";

export const dashboardRoutes: RouteRecordRaw[] = [...countryRoutes];
