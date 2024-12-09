<script setup lang="ts">
import FlashcardsCardComponent from "./FlashcardsCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "@/router";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const name = ref("");
let flashcards = ref<Array<Record<string, string>>>([]);

async function getFlashcards() {
  let flashcardGet;
  try {
    flashcardGet = await fetchy("/api/flashcards/", "GET", {});
  } catch (_) {
    return;
  }
  flashcards.value = flashcardGet.flashcards;
}

const createGroup = async () => {
  try {
    await fetchy("/api/flashcards", "PUT", {
      body: {
        name: name.value,
      },
    });
  } catch (_) {
    return;
  }
};

const onClick = (group: Record<string, string>) => {
  console.log("group", group);
  console.log("name", group.name);
  void router.push({ path: `/groups/${group.name}` });
};

onBeforeMount(async () => {
  await getFlashcards();
  loaded.value = true;
});
</script>

<template>
  <div>
    <h2>Flashcard Groups:</h2>
  </div>
  <section class="flashcards" v-if="loaded && flashcards.length !== 0">
    <article v-for="group in flashcards" :key="group._id" v-on:click="() => onClick(group)">
      <FlashcardsCardComponent :group="group" />
    </article>
  </section>
  <p v-else-if="loaded">No groups found</p>
  <p v-else>Loading...</p>
  <div class="newGroup">
    <h2>New Group:</h2>
    <form @submit.prevent="createGroup">
      <label for="title">Name:</label>
      <input id="title" v-model="name" placeholder="enter name" required />
      <button type="submit" class="pure-button-primary pure-button">Create Group</button>
    </form>
  </div>
</template>

<style scoped>
div {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
}

div h2 {
  font-size: 1.5rem;
  color: #333;
}

.flashcards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.flashcards article {
  background-color: #f8f9fa;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.flashcards article:hover {
  background-color: #e9ecef;
  transform: translateY(-5px);
}

.flashcards article:active {
  transform: translateY(0);
}

p {
  font-size: 1rem;
  color: #555;
  text-align: center;
  margin: 20px 0;
}
</style>
