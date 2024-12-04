<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import router from "@/router";

const flashcarding = ref(false);
const flipped = ref(false);
const cardIndex = ref(0);
const props = defineProps(["group"]);
const length = props.group.items.length;
const { currentUsername } = storeToRefs(useUserStore());

console.log("props.group", props.group);
console.log("props.group.items", props.group.items);

async function deleteGroup() {
  void router.push({ path: `/groups` });
  try {
    await fetchy(`/api/flashcards/${props.group.name}`, "DELETE");
  } catch (_) {
    return;
  }
}
</script>

<template>
  <main v-if="!flashcarding">
    <h1>Group page</h1>
    <h1>{{ props.group.name }}</h1>
    <h2>By: {{ props.group.authorName }}</h2>
    <button class="delete" v-if="currentUsername == group.authorName" v-on:click="deleteGroup">Delete</button>
    <button class="flashcardButton" v-on:click="() => (flashcarding = !flashcarding)">Flashcard</button>
    <div class="posts">
      <article class="post" v-for="post in props.group.items" :key="post._id">
        <h2>{{ post.word }}</h2>
        <h3>{{ post.translation }}</h3>
        <div v-if="post.imageUrl" class="image-container">
          <img :src="post.imageUrl" alt="Post image" class="post-image" />
        </div>
      </article>
    </div>
  </main>
  <main class="flashcarding" v-else>
    <!-- <h1>{{ cardIndex }}</h1> -->
    <button class="flashcardButton" v-on:click="() => (flashcarding = !flashcarding)">Flashcard</button>
    <button v-on:click="() => (cardIndex = (cardIndex - 1) % length)">{{ `<<<` }}</button>
    <button v-on:click="() => (cardIndex = (cardIndex + 1) % length)">{{ `>>>` }}</button>
    <article class="card" v-on:click="() => (flipped = !flipped)">
      <div class="front" v-if="!flipped">
        <h2>{{ props.group.items[cardIndex].word }}</h2>
      </div>
      <div class="back" v-else>
        <h2>{{ props.group.items[cardIndex].translation }}</h2>
        <div v-if="props.group.items[cardIndex].imageUrl" class="image-container">
          <img :src="props.group.items[cardIndex].imageUrl" alt="Post image" class="post-image" />
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.posts {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.post {
  background-color: var(--base-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.image-container {
  display: flex; /* Use flexbox for the container */
  justify-content: center; /* Horizontally center the image */
  align-items: center; /* Vertically center the image */
  width: 100%; /* Use full width for responsiveness */
  height: 500px; /* Fixed height for the image container */
  overflow: hidden; /* Hide any overflow (cropping) */
}

.post-image {
  max-width: 80%; /* Ensure the image fits within the container */
  max-height: 90%; /* Ensure the image does not overflow the container */
  object-fit: cover; /* Ensures the image fills the container while maintaining aspect ratio */
}

form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

.delete {
  background-color: red;
}

.flashcardButton {
  background-color: aqua;
}

.card {
  background-color: var(--base-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
