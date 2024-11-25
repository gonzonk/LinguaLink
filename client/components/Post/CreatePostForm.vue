<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const word = ref("");
const translation = ref("");
const imageUrl = ref("");
const audioUrl = ref("");

const emit = defineEmits(["refreshPosts"]);

const createPost = async () => {
  try {
    await fetchy("/api/posts", "POST", {
      body: {
        word: word.value,
        translation: translation.value,
        imageUrl: imageUrl.value,
        audioUrl: audioUrl.value,
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
</script>

<template>
  <form @submit.prevent="createPost">
    <label for="word">Word:</label>
    <input id="word" v-model="word" placeholder="Post Word" required />

    <label for="translation">Translation:</label>
    <input id="translation" v-model="translation" placeholder="Post translation" required />

    <label for="imageUrl">ImageUrl:</label>
    <input id="imageUrl" v-model="imageUrl" placeholder="Post imageUrl" />

    <label for="audioUrl">AudioUrl:</label>
    <input id="audioUrl" v-model="audioUrl" placeholder="Post audioUrl" />

    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
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
</style>
