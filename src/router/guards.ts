import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "@/stores/user";

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const userData = useUserStore();

  // Not authenticated - redirect to login
  if (to.name !== "Login" && !userData.isAuth) {
    return next({ path: "/login" });
  }

  next();
}
