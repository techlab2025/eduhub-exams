import type { PermissionCode } from '../enums/permissions.enum';

export interface PermissionActionItem {
  code: PermissionCode;
  labelKey: string;
  checked: boolean;
}

export interface PermissionGroupItem {
  code: PermissionCode;
  labelKey: string;
  permissions: PermissionActionItem[];
}

export interface PermissionModuleItem {
  code: PermissionCode;
  labelKey: string;
  permissions: PermissionGroupItem[];
}
