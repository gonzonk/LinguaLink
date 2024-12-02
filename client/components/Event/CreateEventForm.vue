<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const description = ref("");
const time = ref("");
const location = ref("");

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
  <form @submit.prevent="createEvent">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="title..." required />

    <label for="description">Desription:</label>
    <textarea id="description" v-model="description" placeholder="Description..." required></textarea>

    <label for="time">Time:</label>
    <input id="time" v-model="time" placeholder="time..." />

    <label for="location">Location:</label>
    <input id="location" v-model="location" placeholder="location..." />

    <button type="submit" class="pure-button-primary pure-button">Create Event</button>
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
