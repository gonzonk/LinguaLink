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

function rightScroll() {
  cardIndex.value = (cardIndex.value + 1) % length;
  flipped.value = false;
}

function leftScroll() {
  cardIndex.value = cardIndex.value - 1 < 0 ? length - 1 : (cardIndex.value - 1) % length;
  flipped.value = false;
}
</script>

<template>
  <main v-if="!flashcarding">
    <div class="info">
      <h1>{{ props.group.name }}</h1>
      <h2>By: {{ props.group.authorName }}</h2>
      <h2>Role: {{ props.group.authorRole }}</h2>
      <button class="delete" v-if="currentUsername == group.authorName" v-on:click="deleteGroup">Delete</button>
      <button class="flashcardButton" v-on:click="() => (flashcarding = !flashcarding)">Flashcard</button>
    </div>
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
    <button class="flashcardButton" v-on:click="() => (flashcarding = !flashcarding)">Flashcard</button>
    <div class="cardControls">
      <button class="changeButton" v-on:click="leftScroll">{{ `<<<` }}</button>
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
      <button class="changeButton" v-on:click="rightScroll">{{ `>>>` }}</button>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.cardControls {
  display: flex;
  flex-direction: row;
  align-content: space-around;
}

main h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
  margin: auto;
}

main h2 {
  margin: auto;
  margin-top: 8px;
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 8px;
}

main h3 {
  font-size: 1rem;
  color: #777;
}

button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 10vw;
  margin: auto;
  margin-top: 4px;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.changeButton {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 5px;
  margin-left: 5vw;
  margin-right: 5vw;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button.delete {
  background-color: #dc3545;
}

button.delete:hover {
  background-color: #c82333;
}

.posts {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
}

.post {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.image-container {
  margin-top: 10px;
  text-align: center;
}

.post-image {
  max-width: 75%;
  max-height: 75%;
  border-radius: 4px;
}

.flashcarding {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 50vw;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card .front,
.card .back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flashcardButton {
  margin-bottom: 20px;
}
</style>
