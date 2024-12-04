<script setup lang="ts">
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { ref } from "vue";
import { onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";

const props = defineProps(["parent", "upvotes", "downvotes"]);
const emit = defineEmits(["refreshVotes"]);

let upvoted = ref(false);
let downvoted = ref(false);
let loaded = ref(false);

const { currentRole } = storeToRefs(useUserStore());

const voteStatus = async () => {
  try {
    const upvote = await fetchy(`/api/upvotes/user/${props.parent._id}`, "GET");
    const downvote = await fetchy(`/api/downvotes/user/${props.parent._id}`, "GET");
    upvoted.value = upvote;
    downvoted.value = downvote;
  } catch (_) {
    return;
  }
};

const placeUpvote = async () => {
  try {
    await fetchy("/api/upvotes/upvote/", "PUT", {
      body: { id: props.parent._id },
    });
    upvoted.value = true;
    downvoted.value = false; // Reset downvote
  } catch (_) {
    return;
  }
  emit("refreshVotes");
  await voteStatus();
};

const placeDownvote = async () => {
  try {
    await fetchy("/api/upvotes/downvote/", "PUT", {
      body: { id: props.parent._id },
    });
    downvoted.value = true;
    upvoted.value = false; // Reset upvote
  } catch (_) {
    return;
  }
  emit("refreshVotes");
  await voteStatus();
};

onBeforeMount(async () => {
  await voteStatus();
  loaded.value = true;
});
</script>

<template>
  <div class="vote-container">
    <!-- Upvote Button -->
    <button @click="placeUpvote" :disabled="currentRole !== 'Teacher'" :class="{ upvoted: upvoted, neutral: !upvoted && !downvoted }">👍 {{ props.upvotes }}</button>

    <!-- Downvote Button -->
    <button @click="placeDownvote" :disabled="currentRole !== 'Teacher'" :class="{ downvoted: downvoted, neutral: !upvoted && !downvoted }">👎 {{ props.downvotes }}</button>

    <p v-if="currentRole !== 'Teacher'" class="message">Only teachers can vote.</p>
  </div>
</template>

<style scoped>
.vote-container {
  display: flex;
  align-items: center;
  gap: 1em;
}

/* General button styling */
button {
  background: none;
  border: 2px solid transparent;
  font-size: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  border-radius: 5px;
  transition: all 0.3s ease;
}

/* Upvoted button (green) */
button.upvoted {
  background-color: #e6f7e6; /* Light green background */
  border: 2px solid green;
  color: green;
  font-weight: bold;
}

/* Downvoted button (red) */
button.downvoted {
  background-color: #fbeaea; /* Light red background */
  border: 2px solid red;
  color: red;
  font-weight: bold;
}

/* Neutral (default) button */
button.neutral {
  background-color: #f8f8f8;
  border: 2px solid #ddd;
  color: black;
}

/* Disabled buttons */
button:disabled {
  cursor: not-allowed;
  color: gray;
  background-color: #f8f8f8;
  border: 2px solid #ddd;
}

/* Message styling */
.message {
  color: #555;
  font-size: 0.9em;
}
</style>
