<script setup lang="ts">
import CreateEventForm from "./CreateEventForm.vue";
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
  <section v-if="isLoggedIn">
    <h2>Create an event:</h2>
    <CreateEventForm @refreshEvents="getEvents" />
  </section>
  <div class="row">
    <h2>Events:</h2>
  </div>
  <section class="events" v-if="loaded && events.length !== 0">
    <article v-for="event in events" :key="event._id">
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
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
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
</style>
