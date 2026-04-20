import type { RouteRecordRaw } from "vue-router";
import { countryRoutes } from "./country";
import { employeeRoutes } from "./employee";
import { documentRoutes } from "./document";

export const dashboardRoutes: RouteRecordRaw[] = [
  ...countryRoutes,
  ...employeeRoutes,
  ...documentRoutes,
];
