<script setup lang="ts">
import EventListComponent from "@/components/Event/EventListComponent.vue";
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

    <!-- RouterLink to add event, styled as a blue button -->
    <RouterLink :to="{ name: 'CreateEvent' }" class="add-event-link">
      <button class="add-event-button">Create Event</button>
    </RouterLink>

    <EventListComponent />
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

/* Style the Add Event button link */
.add-event-link {
  position: absolute;
  top: 140px;
  right: 538px;
}

.word_input {
  width: 600px;
  height: 30px;
  border-color: black;
  border-width: 1px 0.2px 1px 1px;
  resize: none;
}

.add-event-button {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px; /* Rounded corners */
  text-align: center;
  text-decoration: none; /* Remove underline */
}

.add-event-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.add-event-button:focus {
  outline: none; /* Remove focus outline */
}
</style>
