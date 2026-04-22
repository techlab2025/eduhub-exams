import type { RouteRecordRaw } from "vue-router";
import { countryRoutes } from "./country";
import { employeeRoutes } from "./employee";
import { documentRoutes } from "./document";
import { faqsRoutes } from "./faqs";

export const dashboardRoutes: RouteRecordRaw[] = [
  ...countryRoutes,
  ...employeeRoutes,
  ...documentRoutes,
  ...faqsRoutes,
];
