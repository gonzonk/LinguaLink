<script setup lang="ts">
import FlashcardsCardComponent from "./FlashcardsCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let flashcards = ref<Array<Record<string, string>>>([]);

async function getFlashcards() {
  let flashcardGet;
  try {
    flashcardGet = await fetchy("/api/flashcards/", "GET", {});
  } catch (_) {
    return;
  }
  flashcards.value = flashcardGet;
}

onBeforeMount(async () => {
  await getFlashcards();
  loaded.value = true;
});
</script>

<template>
  <div>
    <h2>Groups:</h2>
  </div>
  <section class="flashcards" v-if="loaded && flashcards.length !== 0">
    <article v-for="group in flashcards" :key="group._id">
      <FlashcardsCardComponent :group="group" />
    </article>
  </section>
  <p v-else-if="loaded">No groups found</p>
  <p v-else>Loading...</p>
</template>

<style scoped></style>
