<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const word = ref(props.post.word);
const translation = ref(props.post.translation);
const imageUrl = ref(props.post.imageUrl);
const audioUrl = ref(props.post.audioUrl);
const selectedTag = ref();

const tags = ref();

const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", {
      body: { word: word.value, translation: translation.value, imageUrl: imageUrl.value, audioUrl: audioUrl.value, tag: selectedTag.value },
    });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
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
  <form @submit.prevent="editPost">
    <p class="author">{{ props.post.author }}</p>

    <label for="word">Word:</label>
    <input id="word" v-model="word" placeholder="word" required />

    <label for="translation">Translation:</label>
    <input id="translation" v-model="translation" placeholder="translation" />

    <label for="imageUrl">imageUrl:</label>
    <input id="imageUrl" v-model="imageUrl" placeholder="imageUrl" />

    <label for="audioUrl">audioUrl:</label>
    <input id="audioUrl" v-model="audioUrl" placeholder="audioUrl" />
    <label for="audioUrl">Tag:</label>
    <select v-model="selectedTag">
      <option v-for="tag in tags" v-bind:key="tag">{{ tag }}</option>
    </select>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
