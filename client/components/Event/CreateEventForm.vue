<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { useRouter } from "vue-router";

const title = ref("");
const description = ref("");
const time = ref("");
const location = ref("");
const router = useRouter(); // Access the Vue Router

const emit = defineEmits(["refreshEvents"]);

const createEvent = async () => {
  try {
    await fetchy("/api/events", "POST", {
      body: {
        title: title.value,
        description: description.value,
        time: time.value,
        location: location.value,
      },
    });
    await router.push(`/events`); // Navigate to /posts/{word}
  } catch (_) {
    return;
  }
  emit("refreshEvents");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  description.value = "";
  time.value = "";
  location.value = "";
};
</script>

<template>
  <form @submit.prevent="createEvent" class="event-form">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="Enter the event title..." required />

    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="Enter a brief description of the event..." required></textarea>

    <label for="time">Time:</label>
    <input id="time" v-model="time" type="datetime-local" placeholder="Select the event time..." required />

    <label for="location">Location:</label>
    <input id="location" v-model="location" placeholder="Enter the event location..." />

    <button type="submit">Create Event</button>
  </form>
</template>

<style scoped>
:root {
  --form-bg: #f8f9fa;
  --form-border: #ced4da;
  --form-text: #495057;
  --button-bg: #007bff;
  --button-hover-bg: #0056b3;
  --button-text: #fff;
  --input-focus: #80bdff;
  --input-border: #ced4da;
}

.event-form {
  background-color: var(--form-bg);
  border: 1px solid var(--form-border);
  border-radius: 10px;
  padding: 1.5em;
  max-width: 500px;
  margin: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.event-form label {
  font-size: 1rem;
  margin-bottom: 0.5em;
  color: var(--form-text);
}

.event-form input,
.event-form textarea {
  font-family: "Arial", sans-serif;
  font-size: 1rem;
  padding: 0.75em;
  border: 1px solid var(--form-border);
  border-radius: 5px;
  margin-bottom: 1em;
  width: 100%;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.event-form input:focus,
.event-form textarea:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 5px var(--input-focus);
  outline: none;
}

.event-form button {
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
  padding: 0.75em 1.5em;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.event-form button:hover {
  background-color: var(--button-hover-bg);
}

.event-form button:focus {
  outline: 2px solid var(--input-focus);
}
</style>
