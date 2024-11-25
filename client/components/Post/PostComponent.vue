<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <p class="word">{{ props.post.word }}</p>
  <p class="translation">{{ props.post.translation }}</p>

  <div v-if="props.post.imageUrl" class="image-container">
    <img :src="props.post.imageUrl" alt="Post image" class="post-image" />
  </div>
  <!-- <p>{{ props.post.imageUrl }}</p> -->
  <p>{{ props.post.audioUrl }}</p>

  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.word {
  font-weight: bolder;
  font-size: 1.5em; /* Slightly larger font size for titles */
  text-align: center;
  color: #333; /* Dark text for contrast */
}

.translation {
  font-size: 1em; /* Slightly larger font size for titles */
  text-align: center;
  color: #333; /* Dark text for contrast */
}

.post-images {
  display: flex;
  align-items: center; /* Center images vertically */
  justify-content: center; /* Center images horizontally */
  position: relative; /* Position for arrow buttons */
}

.image-container {
  width: 500px; /* Fixed width for the image container */
  height: 500px; /* Fixed height for the image container */
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #6fc5d6; /* Border to match the theme */
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
