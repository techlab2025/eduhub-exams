import StoreRoleParams from './store.role.params';

export default class UpdateRoleParams extends StoreRoleParams {
  public readonly roleId: number;

  constructor(roleId: number, title: Record<string, string>, permissions: string[]) {
    super(title, permissions);
    this.roleId = roleId;
  }

  override toMap(): Record<string, unknown> {
    return { role_id: this.roleId, ...super.toMap() };
  }
}
