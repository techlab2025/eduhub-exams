import { PermissionsEnum } from '../enums/permissions.enum';
import type { PermissionModuleItem } from '../models/permission.item';

export const createAdminPermissions = (): PermissionModuleItem[] => [
  {
    code: PermissionsEnum.SETTING,
    labelKey: 'permission.modules.settings',
    permissions: [
      {
        code: PermissionsEnum.ORG_EMPLOYEE_ALL,
        labelKey: 'permission.groups.employees',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.ORG_EMPLOYEE_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.ORG_EMPLOYEE_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.ORG_EMPLOYEE_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.ORG_EMPLOYEE_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.ORG_EMPLOYEE_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
      {
        code: PermissionsEnum.NOTIFICATION_PLAN_ALL,
        labelKey: 'permission.groups.notification_plans',
        checked: false,
        permissions: [
          {
            code: PermissionsEnum.NOTIFICATION_PLAN_FETCH,
            labelKey: 'permission.actions.fetch',
            checked: false,
          },
          {
            code: PermissionsEnum.NOTIFICATION_PLAN_DETAILS,
            labelKey: 'permission.actions.details',
            checked: false,
          },
          {
            code: PermissionsEnum.NOTIFICATION_PLAN_CREATE,
            labelKey: 'permission.actions.create',
            checked: false,
          },
          {
            code: PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
            labelKey: 'permission.actions.update',
            checked: false,
          },
          {
            code: PermissionsEnum.NOTIFICATION_PLAN_DELETE,
            labelKey: 'permission.actions.delete',
            checked: false,
          },
        ],
      },
    ],
  },
];
