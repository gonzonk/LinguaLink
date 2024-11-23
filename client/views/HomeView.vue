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
    <section>
      <RouterLink>
        <div>
          <h2>Events</h2>
        </div>
      </RouterLink>
      <RouterLink>
        <div>
          <h2>Dictionary</h2>
        </div>
      </RouterLink>
      <RouterLink>
        <div>
          <h2>Groups</h2>
        </div>
      </RouterLink>
      <RouterLink>
        <div>
          <h2>Quizzes</h2>
        </div>
      </RouterLink>
      <RouterLink>
        <div>
          <h2>Word of the Day</h2>
        </div>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
