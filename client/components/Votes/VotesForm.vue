<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const word = ref("");
const translation = ref("");
const imageUrl = ref("");
const audioUrl = ref("");

const emit = defineEmits(["refreshPosts"]);

const placeVote = async () => {
  try {
    await fetchy("/api/votes", "POST", {
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
    <button >Upvote</button>
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
