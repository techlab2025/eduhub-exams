import type { RouteRecordRaw } from 'vue-router';
import { countryRoutes } from './country';
import { employeeRoutes } from './employee';

export const dashboardRoutes: RouteRecordRaw[] = [...countryRoutes, ...employeeRoutes];
