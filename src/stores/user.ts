// Updated user store
import { defineStore } from "pinia";

/**
 * TODO: Replace with proper UserModel from auth module when implemented.
 * This is a temporary interface to unblock the store from a stale import.
 */
interface UserModel {
  id?: number;
  name?: string;
  email?: string;
  token?: string;
  [key: string]: any;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as UserModel | null,
    isAuth: false,
    expiresAt: null as number | null, // Store expiration timestamp
  }),
  actions: {
    setUser(user: UserModel) {
      this.user = user;
      this.isAuth = true;
      this.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Set expiration 24h ahead
      this.setAutoLogout();
    },
    async logout() {
      if (window.LogoutChannel) {
        window.LogoutChannel.postMessage(
          JSON.stringify({
            message: "logout",
            status: true,
          }),
        );
      }

      this.user = null;
      this.isAuth = false;
      localStorage.clear();
      this.expiresAt = null;
    },
    setAutoLogout() {
      if (this.expiresAt) {
        const timeout = this.expiresAt - Date.now();
        if (timeout > 0) {
          setTimeout(() => this.logout(), timeout);
        }
      }
    },
  },
  persist: {
    afterHydrate: (ctx) => {
      const store = ctx.store;
      if (store.expiresAt && Date.now() > store.expiresAt) {
        store.logout();
      } else {
        store.setAutoLogout();
      }
    },
  },
});
