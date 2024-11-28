import { defineStore } from "pinia";
import { computed, ref } from "vue";

export enum UserRole {
  TEACHER = "Teacher",
  LEARNER = "Learner",
}

export enum Dialects {
  WEST = "North Island Western",
  EAST = "North Island Eastern",
  SOUTH = "South Island",
}

import { fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const currentRole = ref("");
    const currentDialect = ref("");

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currentDialect.value = "";
      currentRole.value = "";
    };

    const createUser = async (username: string, password: string, description: string, role: UserRole, dialect: Dialects) => {
      await fetchy("/api/users", "POST", {
        body: { username, password, description, role, dialect },
      });
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username, role, dialect } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
        currentDialect.value = dialect;
        currentRole.value = role;
      } catch {
        currentUsername.value = "";
        currentDialect.value = "";
        currentRole.value = "";
      }
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUserUsername = async (username: string) => {
      await fetchy("/api/users/username", "PATCH", { body: { username } });
    };

    const updateUserPassword = async (currentPassword: string, newPassword: string) => {
      await fetchy("/api/users/password", "PATCH", { body: { currentPassword, newPassword } });
    };

    const updateUserDescription = async (description: string) => {
      await fetchy("/api/users/description", "PATCH", { body: { description } });
    };

    const updateUserRole = async (role: UserRole) => {
      await fetchy("/api/users/role", "PATCH", { body: { role } });
    };

    const updateUserDialect = async (dialect: Dialects) => {
      await fetchy("/api/users/dialect", "PATCH", { body: { dialect } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      currentRole,
      currentDialect,
      isLoggedIn,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUserUsername,
      updateUserPassword,
      updateUserDescription,
      updateUserRole,
      updateUserDialect,
      deleteUser,
    };
  },
  { persist: true },
);
