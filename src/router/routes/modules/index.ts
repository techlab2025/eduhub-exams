import type { RouteRecordRaw } from 'vue-router';
import { countryRoutes } from './country';
import { employeeRoutes } from './employee';
import { documentRoutes } from './document';
import { faqsRoutes } from './faqs';
import { privacyRoutes } from './privacy';
import { termsConditionsRoutes } from './terms-conditions';
import { stagesRoutes } from './stages';
import { subjectsRoutes } from './subjects';
import { unitsRoutes } from './units';
import { educationClassificationRoutes } from './education-classification';
import { AboutRoutes } from './about';
import { SupportContactsRoutes } from './support';

export const dashboardRoutes: RouteRecordRaw[] = [
  ...countryRoutes,
  ...employeeRoutes,
  ...documentRoutes,
  ...faqsRoutes,
  ...privacyRoutes,
  ...termsConditionsRoutes,
  ...stagesRoutes,
  ...subjectsRoutes,
  ...unitsRoutes,
  ...educationClassificationRoutes,
  ...AboutRoutes,
  ...SupportContactsRoutes,
];
