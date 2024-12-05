<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const word = ref("");
const translation = ref("");
const imageUrl = ref("");
const audioUrl = ref("");
const tags = ref();
const selectedTag = ref("");

const emit = defineEmits(["refreshPosts"]);

const createPost = async () => {
  console.log(`Selected Tag: ${selectedTag.value}`);
  try {
    await fetchy("/api/posts", "POST", {
      body: {
        word: word.value,
        translation: translation.value,
        imageUrl: imageUrl.value,
        audioUrl: audioUrl.value,
        tag: selectedTag.value,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  word.value = "";
  translation.value = "";
  imageUrl.value = "";
  audioUrl.value = "";
};

onBeforeMount(async () => {
  try {
    const tagResults = await fetchy("/api/tags", "GET");
    tags.value = tagResults;
    selectedTag.value = tags.value.at(0);
  } catch (_) {
    return;
  }
});
</script>

<template>
  <main style="display: flex; justify-content: center">
    <form @submit.prevent="createPost" style="width: 700px">
      <label for="word" class="label">Word</label>
      <input id="word" class="input" v-model="word" required />

      <label for="translation">Translation</label>
      <input id="translation" v-model="translation" required />

      <label for="imageUrl">ImageUrl</label>
      <input id="imageUrl" v-model="imageUrl" />

      <label for="audioUrl">AudioUrl</label>
      <input id="audioUrl" v-model="audioUrl" />

      <label for="audioUrl">Tag</label>
      <select class="tag_selector" v-model="selectedTag">
        <option v-for="tag in tags" v-bind:key="tag">{{ tag }}</option>
      </select>

      <button type="submit" class="pure-button-primary pure-button">Add Word</button>
    </form>
  </main>
</template>

<style scoped>
form {
  /* background-color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  flex-direction: column;
  background-color: rgb(230, 255, 250);
  gap: 0.5em;
  padding: 2.5em;
}

.tag_selector {
  width: 300px; /* Adjust width as needed */
  height: 40px;
  padding: 10px; /* Add some padding for better appearance */
  border: 1px solid; /* Light gray border */
  border-radius: 4px; /* Rounded corners */
  color: black;
  cursor: pointer;
  background-color: white; /* White background */
  margin-bottom: 16px;
}

label {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0px;
}

input {
  height: 30px;
  margin-top: 0px;
  margin-bottom: 12px;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
