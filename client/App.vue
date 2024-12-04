<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import ProfilePicComponent from "./components/Profile/ProfilePicComponent.vue";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, currentUsername, currentRole } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

// Compute role-based class for navbar
const currentRoleClass = computed(() => {
  return currentRole.value === "Teacher" ? "teacher-nav" : "learner-nav";
});

// Text to show in the navbar based on the role
const roleText = computed(() => {
  return currentRole.value === "Teacher" ? "Teacher View" : "Learner View";
});
</script>

<template>
  <header :class="currentRoleClass">
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.png" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>LinguaLink</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
        <!-- Conditionally display the role-specific link -->
        <li>
          <span class="role-view">{{ roleText }}</span>
        </li>
        <li>
          <ProfilePicComponent :username="currentUsername" />
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

/* Default navbar style */
nav {
  padding: 1em 2em;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: white;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}

/* Teacher-specific navbar style */
.teacher-nav {
  background-color: #c62828; /* Red for Teacher */
}

.teacher-nav a {
  color: white;
}

.teacher-nav .add-word-button {
  background-color: #d32f2f;
}

/* Learner-specific navbar style */
.learner-nav {
  background-color: #388e3c; /* Green for Learner */
}

.learner-nav a {
  color: white;
}

.learner-nav .add-word-button {
  background-color: #43a047;
}

/* Role text style */
.role-view {
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.4); /* Slightly darkened background for contrast */
  padding: 0.5em 1em;
  border-radius: 5px;
}
</style>
