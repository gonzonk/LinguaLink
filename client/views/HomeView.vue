<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <section id="links">
      <RouterLink>
        <div id="events">
          <h2>Events</h2>
        </div>
      </RouterLink>
      <RouterLink>
        <div id="dictionary">
          <h2>Dictionary</h2>
        </div>
      </RouterLink>
      <div id="gqw">
        <RouterLink>
          <div id="groups">
            <h2>Groups</h2>
          </div>
        </RouterLink>
        <RouterLink>
          <div id="quizzes">
            <h2>Quizzes</h2>
          </div>
        </RouterLink>
        <RouterLink>
          <div id="wotd">
            <h2>Word of the Day</h2>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
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
