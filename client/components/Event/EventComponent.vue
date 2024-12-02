<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event"]);
const emit = defineEmits(["editEvent", "refreshEvents"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteEvent = async () => {
  try {
    await fetchy(`/api/events/${props.event._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshEvents");
};
</script>

<template>
  <p class="author">{{ props.event.author }}</p>
  <p class="word">{{ props.event.title }}</p>
  <p class="description">{{ props.event.description }}</p>
  <p>{{ props.event.time }}</p>
  <p>{{ props.event.location }}</p>

  <div class="base">
    <menu v-if="props.event.author == currentUsername">
      <li>
        <!-- Edit Event Button -->
        <button class="btn-small pure-button" @click="emit('editEvent', props.event._id)">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
            <rect width="1.997" height="5.657" x="10.472" y="1.701" fill="#8852ff" transform="rotate(-45.001 11.47 4.53)"></rect>
            <polygon fill="#ffa62e" points="12.824,7.176 8.824,3.176 1,11 1,15 5,15"></polygon>
            <path fill="#e783d4" d="M11.172,0.828l-1.065,1.065l4,4l1.065-1.065c1.105-1.105,1.105-2.895,0-4l0,0 C14.067-0.276,12.276-0.276,11.172,0.828z"></path>
          </svg>
        </button>
      </li>
      <!-- Delete Event Button -->
      <li>
        <button class="btn-small pure-button" @click="deleteEvent">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
            <polygon fill="#6a2eff" points="12,4 10,1 6,1 4,4"></polygon>
            <polygon fill="#9d70ff" points="13,15 3,15 1.5,4 14.5,4"></polygon>
            <rect width="14" height="2" x="1" y="2" fill="#6a2eff"></rect>
          </svg>
        </button>
      </li>
    </menu>
    <article class="timestamp">
      <p v-if="props.event.dateCreated !== props.event.dateUpdated">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.event.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.title {
  font-weight: bolder;
  font-size: 1.5em; /* Slightly larger font size for titles */
  text-align: center;
  color: #333; /* Dark text for contrast */
}

.description {
  font-size: 1em;
  text-align: center;
  color: #333; /* Dark text for contrast */
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
