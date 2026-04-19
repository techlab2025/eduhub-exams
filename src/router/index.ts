import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoutes } from "./routes/modules";
import { authGuard } from "./guards";
import HomeIcon from "@/shared/icons/BreadcrumbIcons/HomeIcon.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/login.vue"),
    },
    {
      path: "/",
      name: "Home App",
      component: () => import("@/views/AppLayout.vue"),
      children: [...dashboardRoutes],
      meta: {
        icon: HomeIcon,
      },
    },
  ],
});

router.beforeEach(authGuard);
export default router;
