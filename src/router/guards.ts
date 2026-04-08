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

  // Already authenticated - redirect to dashboard
  if (to.name === 'Login' && userData.isAuth) {
    const redirectPath = true
      ? '/admin'
      : '/organization'
    return next({ path: redirectPath })
  }

  next()
}
