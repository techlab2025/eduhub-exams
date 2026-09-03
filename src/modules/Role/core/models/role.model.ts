// import TitleInterface from '@/base/Data/Models/titleInterface';

import type { PermissionCode } from '@/modules/Permission';
import RoleTranslationsModel from './role.translations.model';

// const permissionCode = (value: unknown): string => {
//   if (typeof value === 'string') return value;
//   if (!value || typeof value !== 'object') return '';
//   const record = value as Record<string, unknown>;
//   return String(record.permission ?? record.code ?? record.name ?? '');
// };

// export default class RoleModel {
//   public readonly id: number;
//   public readonly roleName: string;
//   public readonly translations: Record<string, string>;
//   public readonly permissions: string[];
//   public readonly permissionsCount: number;
//   public readonly usersCount: number;
//   public readonly createdBy: string;
//   public readonly createdAt: string;

//   constructor(data: {
//     id: number;
//     roleName: string;
//     translations?: Record<string, string>;
//     permissions?: string[];
//     permissionsCount?: number;
//     usersCount?: number;
//     createdBy?: string;
//     createdAt?: string;
//   }) {
//     this.id = data.id;
//     this.roleName = data.roleName;
//     this.translations = data.translations ?? {};
//     this.permissions = data.permissions ?? [];
//     this.permissionsCount = data.permissionsCount ?? this.permissions.length;
//     this.usersCount = data.usersCount ?? 0;
//     this.createdBy = data.createdBy ?? '';
//     this.createdAt = data.createdAt ?? '';
//     Object.freeze(this.permissions);
//     Object.freeze(this);
//   }

//   toOption(): TitleInterface<number> {
//     return new TitleInterface({ id: this.id, title: this.roleName });
//   }

//   static fromJson(data: unknown): RoleModel {
//     const record = (data ?? {}) as Record<string, unknown>;
//     const creator = (record.created_by ?? record.creator ?? {}) as Record<string, unknown>;
//     const rawPermissions = Array.isArray(record.permissions)
//       ? record.permissions
//       : Array.isArray(record.permission)
//         ? record.permission
//         : [];
//     const rawTranslations =
//       record.translations && typeof record.translations === 'object'
//         ? (record.translations as Record<string, unknown>)
//         : {};
//     const rawTitle = record.title ?? rawTranslations.title ?? record.role_name ?? record.name ?? '';
//     const translations = this.mapTranslations(rawTitle);

//     return new RoleModel({
//       id: Number(record.id ?? record.role_id ?? 0),
//       roleName: this.resolveTitle(rawTitle),
//       translations,
//       permissions: rawPermissions.map(permissionCode).filter(Boolean),
//       permissionsCount: Number(
//         record.permissions_count ?? record.permission_count ?? rawPermissions.length,
//       ),
//       usersCount: Number(
//         record.users_count ?? record.employee_count ?? record.employees_count ?? 0,
//       ),
//       createdBy: String(
//         record.created_by_name ?? creator.name ?? creator.full_name ?? record.created_by ?? '',
//       ),
//       createdAt: String(record.created_at ?? record.createdAt ?? ''),
//     });
//   }

//   private static resolveTitle(title: unknown): string {
//     if (typeof title === 'string') return title;
//     const translations = this.mapTranslations(title);
//     return translations.en ?? translations.ar ?? Object.values(translations)[0] ?? '';
//   }

//   private static mapTranslations(title: unknown): Record<string, string> {
//     if (!title || typeof title !== 'object') return {};
//     if (!Array.isArray(title)) {
//       return Object.fromEntries(
//         Object.entries(title as Record<string, unknown>)
//           .filter(([, value]) => typeof value === 'string')
//           .map(([locale, value]) => [locale, String(value)]),
//       );
//     }
//     return Object.fromEntries(
//       title
//         .filter(
//           (item): item is Record<string, unknown> =>
//             Boolean(item) && typeof item === 'object' && !Array.isArray(item),
//         )
//         .filter((item) => item.locale && typeof item.title === 'string')
//         .map((item) => [String(item.locale), String(item.title)]),
//     );
//   }

//   static get example(): RoleModel {
//     return new RoleModel({ id: 1, roleName: 'Content Manager', permissions: ['OE01'] });
//   }
// }

export default class RoleModel {
  public id: number;
  public titleTranslations: RoleTranslationsModel[];
  public title: string;
  public permissions?: PermissionCode[];

  constructor(data: {
    id: number;
    title: string;
    titleTranslations?: RoleTranslationsModel[];
    permissions?: PermissionCode[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.titleTranslations = data.titleTranslations ?? [];
    this.permissions = data.permissions ?? [];
    Object.freeze(this);
  }

  static fromJson(data: any): RoleModel {
    return new RoleModel({
      id: Number(data.id ?? 0),
      title: String(data?.display_name ?? ''),
      titleTranslations: Array.isArray(data?.display_name)
        ? data.display_name?.map((el: any) => RoleTranslationsModel.fromJson(el))
        : [],
      permissions: data?.permissions ? data.permissions : [],
    });
  }

  static get example(): RoleModel {
    return new RoleModel({ id: 1, title: 'MyRole', titleTranslations: [] });
  }
}
