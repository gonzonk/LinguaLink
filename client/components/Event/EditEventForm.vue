<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["event"]);
const title = ref(props.event.title);
const description = ref(props.event.description);
const time = ref(props.event.time);
const location = ref(props.event.location);
const errorMessage = ref<string | null>(null);

const emit = defineEmits(["editEvent", "refreshEvents", "cancelEdit"]);

const editEvent = async () => {
  errorMessage.value = null; // Reset error message on each attempt

  try {
    await fetchy(`/api/events/${props.event._id}`, "PATCH", {
      body: { title: title.value, description: description.value, time: time.value, location: location.value },
    });
    emit("editEvent");
    emit("refreshEvents");
  } catch (e) {
    errorMessage.value = "Failed to save changes. Please try again later.";
  }
};
</script>

<template>
  <form @submit.prevent="editEvent">
    <p class="author">{{ props.event.author }}</p>

    <!-- Title -->
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="Title..." required />

    <!-- Description -->
    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="Description..." required></textarea>

    <!-- Time -->
    <label for="time">Time:</label>
    <input id="time" v-model="time" type="datetime-local" placeholder="Event time..." required />

    <!-- Location -->
    <label for="location">Location:</label>
    <input id="location" v-model="location" placeholder="Location..." />

    <!-- Error message -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editEvent')">Cancel</button></li>
      </menu>
      <p v-if="props.event.dateCreated !== props.event.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.event.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  max-width: 500px;
  margin: 0 auto;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.75em;
  border-radius: 4px;
  resize: none;
  border: 1px solid #ccc;
}

input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.75em;
  border-radius: 4px;
  border: 1px solid #ccc;
}

input[type="datetime-local"] {
  width: 100%; /* Make datetime input fill the width */
}

button {
  padding: 0.75em;
  font-size: 1em;
}

.menu {
  list-style-type: none;
  display: flex;
  gap: 1em;
  margin: 0;
  padding: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 0.9em;
  font-style: italic;
  text-align: right;
  margin-top: 1em;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 1em;
}
</style>
