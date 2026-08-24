import type { PermissionCode } from '@/modules/Permission/core/enums/permissions.enum';
import { useUserStore } from '@/stores/user';

export default class PermissionHandler {
  private static instance: PermissionHandler;

  static get Instance(): PermissionHandler {
    if (!this.instance) this.instance = new PermissionHandler();
    return this.instance;
  }

  handle(codes: PermissionCode[]): boolean {
    const user = useUserStore().user;
    if (!user) return false;
    if (user.isMaster) return true;
    return codes.some((permission) => user.permission.includes(permission));
  }

  except(code: PermissionCode): boolean {
    return !this.handle([code]);
  }
}
