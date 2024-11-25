<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const word = ref("");
const translation = ref("");
const imageUrl = ref("");
const audioUrl = ref("");

const emit = defineEmits(["refreshPosts"]);

const placeUpvote = async () => {
  try {
    await fetchy("/api/votes", "POST");
  } catch (_) {
    return;
  }
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
    <button @click="">Upvote</button>
    <button>Downvote</button>
    <button type="submit" class="pure-button-primary pure-button">Add Word</button>
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
