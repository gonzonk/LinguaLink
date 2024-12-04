<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, currentRole, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="home-page">
    <h1 class="main-title">Te Reo Māori Hub - The Māori Language Hub!</h1>
    <section class="welcome-section">
      <h1
        v-if="isLoggedIn"
        class="welcome-title"
        :class="{
          learner: currentRole === 'Learner',
          teacher: currentRole === 'Teacher',
        }"
      >
        Welcome {{ currentUsername }}!
      </h1>
      <h1 v-else class="welcome-title">Please login!</h1>
    </section>
    <section class="links-section">
      <div class="row">
        <RouterLink :to="{ name: 'Dictionary' }">
          <div class="link-card" id="dictionary">
            <h2>📚 Dictionary</h2>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'Events' }">
          <div class="link-card" id="events">
            <h2>🎉 Events</h2>
          </div>
        </RouterLink>
      </div>
      <div class="row">
        <RouterLink :to="{ name: 'FlashcardHomepage' }">
          <div class="link-card" id="flashcards">
            <h2>📇 Flashcarding</h2>
          </div>
        </RouterLink>
        <RouterLink :to="{ name: 'Wordle' }">
          <div class="link-card" id="wotd">
            <h2>🏆 Word of the Day</h2>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* General styles for the page */
.home-page {
  font-family: "Poppins", sans-serif;
  background-color: #f9fafb; /* Light gray background */
  color: #1a202c; /* Darker text color */
  padding: 20px;
  text-align: center;
}

/* Main title styles */
.main-title {
  font-size: 2.5em;
  color: #2c7a7b; /* Teal color */
  margin-bottom: 20px;
  font-weight: 600;
}

/* Welcome section styles */
.welcome-section {
  margin-bottom: 30px;
}

/* Default welcome title color */
.welcome-title {
  font-size: 1.6em;
  margin: 10px 0;
}

/* Role-specific text color */
.learner {
  color: #43a047; /* Green for Learner */
}

.teacher {
  color: #d32f2f; /* Red for Teacher */
}

/* Links section styles */
.links-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Row styles */
.row {
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

/* Link card styles */
.link-card {
  background-color: #e6fffa; /* Light teal background */
  border: 2px solid #81e6d9; /* Teal border */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Shadow for depth */
  border-radius: 12px;
  text-align: center;
  padding: 25px; /* Increased padding */
  width: 300px; /* Increased width */
  height: 220px; /* Increased height */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em; /* Slightly larger font size */
  font-weight: 600;
  color: #2c7a7b; /* Teal text color */
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  cursor: pointer;
}

.link-card:hover {
  transform: scale(1.08);
  background-color: #b2f5ea; /* Slightly darker teal on hover */
}

/* Responsive design */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .link-card {
    width: 100%;
  }
}
</style>
