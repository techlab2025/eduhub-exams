import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'
// import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const userData = useUserStore()

  // Not authenticated - redirect to login
  if (to.name !== 'Login' && !userData.isAuth) {
    return next({ path: '/login' })
  }

  // Already authenticated - redirect to dashboard based on user type
  if (to.name === 'Login' && userData.isAuth) {
    // Derive redirect path based on user type
    // Users with type 1 (EMPLOYEE) go to organization, others to admin
    const userType = userData.user?.type;
    const redirectPath = userType === 1 ? '/organization' : '/admin';
    return next({ path: redirectPath })
  }

  next()
}
