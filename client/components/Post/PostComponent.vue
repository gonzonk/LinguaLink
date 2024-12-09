<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";
import VotesBlock from "../Votes/VotesBlock.vue";
import AddToGroupForm from "../Flashcarding/AddToFlashcardGroupForm.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, currentRole } = storeToRefs(useUserStore());

const postDialect = ref("");

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const getDialect = async () => {
  try {
    const { dialect } = await fetchy(`/api/users/${props.post.author}`, "GET");
    postDialect.value = dialect;
  } catch (_) {
    postDialect.value = "";
  }
};

onBeforeMount(async () => {
  await getDialect();
});
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <p class="dialect">Dialect: {{ postDialect }}</p>
  <p v-if="props.post.tags.length > 0 && props.post.tags.at(0) !== 'None'" class="tag">{{ `🏷️ ${props.post.tags.at(0)}` }}</p>
  <p class="word">{{ props.post.word }}</p>
  <p class="translation">{{ props.post.translation }}</p>

  <div v-if="props.post.imageUrl" class="image-container">
    <img :src="props.post.imageUrl" alt="Post image" class="post-image" />
  </div>
  <audio v-if="props.post.audioUrl" controls class="audio_element" crossorigin="anonymous">
    <source :src="props.post.audioUrl" />
  </audio>

  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li>
        <!-- Edit Post Button -->
        <button class="btn-small pure-button" @click="emit('editPost', props.post._id)">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
            <rect width="1.997" height="5.657" x="10.472" y="1.701" fill="#8852ff" transform="rotate(-45.001 11.47 4.53)"></rect>
            <polygon fill="#ffa62e" points="12.824,7.176 8.824,3.176 1,11 1,15 5,15"></polygon>
            <path fill="#e783d4" d="M11.172,0.828l-1.065,1.065l4,4l1.065-1.065c1.105-1.105,1.105-2.895,0-4l0,0 C14.067-0.276,12.276-0.276,11.172,0.828z"></path>
          </svg>
        </button>
      </li>
      <!-- Delete Post Button -->
      <li>
        <button class="btn-small pure-button" @click="deletePost">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
            <polygon fill="#6a2eff" points="12,4 10,1 6,1 4,4"></polygon>
            <polygon fill="#9d70ff" points="13,15 3,15 1.5,4 14.5,4"></polygon>
            <rect width="14" height="2" x="1" y="2" fill="#6a2eff"></rect>
          </svg>
        </button>
      </li>
    </menu>
    <article class="votes">
      <VotesBlock v-bind:parent="props.post" />
    </article>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
  <div>
    <AddToGroupForm v-bind:parent="props.post" />
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
  font-size: 1em;
  text-align: center;
  color: #333; /* Dark text for contrast */
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
  border-radius: 8px; /* Optional: rounded corners for the image */
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

.tag {
  font-size: 1em;
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
