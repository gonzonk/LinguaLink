<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

// Access user store values
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="home-main">
    <section class="main-title">
      <h1 v-if="isLoggedIn" class="welcome-message">Welcome, {{ currentUsername }}!</h1>
      <h1 v-else class="login-message">Please log in!</h1>
    </section>

    <PostListComponent />
  </main>
</template>

<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5em;
  min-height: 100vh;
}

.main-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 1em;
}

.welcome-section {
  margin-bottom: 2em;
}

.welcome-message,
.login-message {
  font-size: 1.5em;
  text-align: center;
  margin: 0.5em 0;
}
</style>
