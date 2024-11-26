// store/auth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      allUserData: null,
      loading: false,
      role: null,

      user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
      }),

      setUser: (user) => {
        if (user) {
          // Si l'utilisateur existe, définissez les données utilisateur et le rôle
          set({ allUserData: user, role: user.is_superuser ? 'admin' : 'employer' });
        } else {
          // Si user est null, videz les données utilisateur et le rôle
          set({ allUserData: null, role: null });
        }
      },

      setLoading: (loading) => set({ loading }),

      isLoggedIn: () => get().allUserData !== null,

      checkAuth: () => {
        const isTokenValid = true;
        if (!isTokenValid) {
          set({ allUserData: null, role: null });
        }
      },

      logout: () => set({ allUserData: null, role: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export { useAuthStore };
