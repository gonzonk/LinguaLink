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
      <div id="gqw">
        <RouterLink :to="{ name: 'FlashcardHomepage' }">
          <div id="groups">
            <h2>Flashcarding</h2>
          </div>
        </RouterLink>
        <RouterLink :to="{}">
          <div id="quizzes">
            <h2>Quizzes</h2>
          </div>
        </RouterLink>
        <RouterLink :to="{}">
          <div id="wotd">
            <h2>Word of the Day</h2>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Center the main title */
.main-title {
  text-align: center;
  font-size: 2em;
  margin: 20px 0;
  color: #333;
}

/* Center the welcome title */
.welcome-title {
  text-align: center;
  font-size: 1.5em;
  margin: 10px 0;
  color: #444;
}

#links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

#gqw {
  display: flex;
  flex-direction: column;
}

div {
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
}

#events {
  width: 100vw;
}

#dictionary {
  width: 50vw;
  height: 50vh;
}

#groups {
  width: 50vw;
  height: 20vh;
}

#quizzes {
  width: 50vw;
  height: 20vh;
}

#wotd {
  width: 50vh;
}
</style>
