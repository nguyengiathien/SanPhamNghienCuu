/**
 * Auth store using Zustand
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToken, getUser, setToken, setUser, clearAuth } from '@/lib/auth/token';
import { authService } from '@/services/auth.service';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // Initialize from localStorage (only if needed, persist middleware handles hydration)
      init: () => {
        // Only init if store is empty and localStorage has data
        const currentState = get();
        if (!currentState.token || !currentState.user) {
          const token = getToken();
          const user = getUser();
          if (token && user) {
            set({ token, user });
          }
        }
      },

      // Set auth data
      setAuth: (token, user) => {
        setToken(token);
        setUser(user);
        set({ token, user, error: null });
      },

      // Login
      login: async (emailOrUsername, password) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.login(emailOrUsername, password);

          // ✅ LƯU localStorage
          setToken(data.token);
          setUser(data.user);

          // ✅ update store
          set({
            token: data.token,
            user: data.user,
            loading: false,
            error: null,
          });

          return data;
        } catch (error) {
          set({ loading: false, error: error.message || "Đăng nhập thất bại" });
          throw error;
        }
      },


      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({ loading: false, error: null });
          return data;
        } catch (error) {
          set({
            loading: false,
            error: error.message || 'Đăng ký thất bại'
          });
          throw error;
        }
      },

      // Get current user
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const me = await authService.getMe(); // phải trả về USER object
          setUser(me);
          set({ user: me, loading: false, error: null });
          return me;
        } catch (error) {
          set({ loading: false, error: error.message || "Không thể tải user" });
          return null; // đừng tự clear user ở đây
        }
      },


      // Logout
      logout: () => {
        clearAuth();
        set({ user: null, token: null, error: null });
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Check if authenticated
      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      },

      // Check role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      // Check any of roles
      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user
      }),
    }
  )
);

export default useAuthStore;

