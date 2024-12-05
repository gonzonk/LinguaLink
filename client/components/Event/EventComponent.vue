<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event"]);
const emit = defineEmits(["editEvent", "refreshEvents"]);
const { currentUsername, currentRole } = storeToRefs(useUserStore());

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
  <div class="event-container">
    <p class="author">{{ props.event.author }}</p>
    <p class="title">{{ props.event.title }}</p>
    <p class="description">{{ props.event.description }}</p>

    <p class="event-detail"><strong>Time:</strong> {{ formatDate(props.event.time) }}</p>
    <p class="event-detail"><strong>Location:</strong> {{ props.event.location }}</p>

    <div class="base">
      <menu v-if="props.event.author == currentUsername">
        <li>
          <!-- Edit Event Button -->
          <button class="btn-small pure-button edit-btn" @click="emit('editEvent', props.event._id)">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
              <rect width="1.997" height="5.657" x="10.472" y="1.701" fill="#8852ff" transform="rotate(-45.001 11.47 4.53)"></rect>
              <polygon fill="#ffa62e" points="12.824,7.176 8.824,3.176 1,11 1,15 5,15"></polygon>
              <path fill="#e783d4" d="M11.172,0.828l-1.065,1.065l4,4l1.065-1.065c1.105-1.105,1.105-2.895,0-4l0,0 C14.067-0.276,12.276-0.276,11.172,0.828z"></path>
            </svg>
          </button>
        </li>
        <!-- Delete Event Button -->
        <li>
          <button class="btn-small pure-button delete-btn" @click="deleteEvent">
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
  </div>
</template>

<style scoped>
/* General Container Styling */
.event-container {
  background-color: #fdf2f2; /* Soft peach background */
  border: 1px solid #f5c2c7; /* Light red border */
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
  max-width: 600px;
  font-family: "Poppins", sans-serif;
}

/* Title Styling */
.title {
  font-weight: bold;
  font-size: 1.8em;
  color: #b71c1c; /* Deep red for title */
  text-align: center;
  margin-bottom: 10px;
}

/* Description Styling */
.description {
  font-size: 1.1em;
  text-align: center;
  color: #4e4e4e; /* Dark gray for description text */
  margin-bottom: 20px;
}

/* Author Styling */
.author {
  font-weight: bold;
  font-size: 1.2em;
  color: #d32f2f; /* Red for author name */
  margin-bottom: 10px;
}

/* Event Detail Styling */
.event-detail {
  font-size: 1.1em;
  margin: 10px 0;
  color: #6a1b9a; /* Purple accent for details */
}

/* Menu Buttons */
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: flex-end;
  padding: 0;
  margin: 10px 0;
}

.pure-button {
  background-color: #ffcdd2; /* Light red */
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background-color: #c5e1a5; /* Light green for hover */
}

.delete-btn:hover {
  background-color: #e57373; /* Darker red for hover */
}

.timestamp {
  text-align: right;
  font-size: 0.9em;
  font-style: italic;
  color: #757575; /* Gray timestamp */
}

/* Responsive Styling */
@media (max-width: 768px) {
  .event-container {
    padding: 15px;
    margin: 15px;
  }

  menu {
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
}
</style>
