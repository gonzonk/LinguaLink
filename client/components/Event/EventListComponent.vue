<script setup lang="ts">
// import CreateEventForm from "./CreateEventForm.vue";
import EditEventForm from "./EditEventForm.vue";
import EventComponent from "./EventComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let events = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getEvents() {
  let eventResults;
  try {
    eventResults = await fetchy("/api/events", "GET", {});
  } catch (_) {
    return;
  }
  events.value = eventResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getEvents();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h1>Events:</h1>
  </div>
  <section class="events" v-if="loaded && events.length !== 0">
    <article v-for="event in events" :key="event._id" class="event-card">
      <EventComponent v-if="editing !== event._id" :event="event" @refreshEvents="getEvents" @editEvent="updateEditing" />
      <EditEventForm v-else :event="event" @refreshEvents="getEvents" @editEvent="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No events found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 0 auto;
  max-width: 60em;
}

p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  /* Remove the background and padding if unnecessary */
  background-color: transparent; /* Ensures no background */
  padding: 0; /* Removes padding */
  margin: 0; /* Removes margin */

  display: flex;
  flex-direction: column;
  gap: 0.5em;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: none; /* Ensures no border */
  box-shadow: none; /* Ensures no shadow */
}

/* Hover effect to enlarge the event */
article:hover {
  transform: scale(1.05); /* Scale the article by 5% */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01); /* Subtle shadow effect */
}

.events {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

h1 {
  color: #333; /* Neutral dark gray for better readability */
  font-family: Arial, sans-serif; /* Clean font for the header */
  font-size: 2rem;
  margin-bottom: 0.5em;
}
</style>
