import type { RouteRecordRaw } from "vue-router";
import { countryRoutes } from "./country";
import { employeeRoutes } from "./employee";
import { documentRoutes } from "./document";
import { faqsRoutes } from "./faqs";
import { privacyRoutes } from "./privacy";
import { termsConditionsRoutes } from "./terms-conditions";
import { stagesRoutes } from "./stages";

export const dashboardRoutes: RouteRecordRaw[] = [
  ...countryRoutes,
  ...employeeRoutes,
  ...documentRoutes,
  ...faqsRoutes,
  ...privacyRoutes,
  ...termsConditionsRoutes,
  ...stagesRoutes,
];
