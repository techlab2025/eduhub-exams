import type StoreRoleParams from '../params/store.role.params';

export const RoleValidationsHandler = (data: StoreRoleParams) => [
  {
    key: 'title',
    message: 'title is required ',
    validator: () => {
      return (
        data.title != null &&
        Object.values(data.title).length != 0 &&
        Object.values(data.title).every((value) => value.trim())
      );
    },
  },
  {
    key: 'permissions',
    message: 'permissions is required ',
    validator: () => {
      return data.permissions != null && data.permissions.length != 0;
    },
  },
];
