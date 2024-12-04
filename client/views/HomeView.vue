<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1 class="main-title">Te Reo Māori Hub - The Māori Language Hub!</h1>
    <section>
      <h1 v-if="isLoggedIn" class="welcome-title">Welcome {{ currentUsername }}!</h1>
      <h1 v-else class="welcome-title">Please login!</h1>
    </section>
    <section id="links">
      <RouterLink :to="{ name: 'Events' }">
        <div id="events">
          <h2>Events</h2>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'Dictionary' }">
        <div id="dictionary">
          <h2>Dictionary</h2>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'FlashcardHomepage' }">
        <div id="groups">
          <h2>Flashcarding</h2>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'Wordle' }">
        <div id="wotd">
          <h2>Word of the Day</h2>
        </div>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fafafa;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #fff;
}

.main-title {
  text-align: center;
  font-size: 3rem;
  color: #2d6a4f;
  margin-bottom: 50px;
  font-weight: bold;
}

.welcome-title {
  text-align: center;
  font-size: 2rem;
  color: #e63946;
  margin-top: 20px;
}

/* Links container */
#links {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 40px;
}

/* Individual link containers */
#events, #dictionary, #groups, #quizzes, #wotd {
  background-color: #fffbf2;
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 250px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 10px;
}

#events h2, #dictionary h2, #groups h2, #quizzes h2, #wotd h2 {
  font-size: 2rem;
  color: #1d3557;
  font-weight: bold;
  margin: 0;
}

/* Hover effects for links */
#events:hover, #dictionary:hover, #groups:hover, #quizzes:hover, #wotd:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Grouping links in a column */
#gqw {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
  align-items: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  #links {
    flex-direction: column;
    align-items: center;
  }

  #events, #dictionary, #groups, #quizzes, #wotd {
    width: 100%;
    margin: 20px 0;
    padding: 30px;
  }

  #gqw {
    flex-direction: row;
    justify-content: center;
    gap: 30px;
  }
}
</style>
