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
    <button @click="placeUpvote" :disabled="currentRole !== 'Teacher'" :class="{ upvoted: upvoted, neutral: !upvoted && !downvoted }" aria-label="Upvote">
      👍 {{ props.upvotes }}
      <!-- Tooltip for Upvote -->
      <span class="tooltip">Upvote to approve or support content.</span>
    </button>

    <!-- Downvote Button -->
    <button @click="placeDownvote" :disabled="currentRole !== 'Teacher'" :class="{ downvoted: downvoted, neutral: !upvoted && !downvoted }" aria-label="Downvote">
      👎 {{ props.downvotes }}
      <!-- Tooltip for Downvote -->
      <span class="tooltip">Downvote to disagree with or disapprove content.</span>
    </button>

    <p v-if="currentRole !== 'Teacher'" class="message">Voting is reserved for teachers to indicate their approval or feedback on content.</p>
  </div>
</template>

<style scoped>
.vote-container {
  display: flex;
  align-items: center;
  gap: 1em;
  position: relative;
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
  position: relative;
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

.tooltip {
  visibility: hidden;
  position: absolute;
  background-color: #333;
  color: white;
  text-align: center;
  border-radius: 5px;
  padding: 3px 6px; /* Reduced padding */
  font-size: 0.8em; /* Slightly smaller font size */
  z-index: 10;
  width: 120px; /* Reduced width */
  left: 100%; /* Position the tooltip to the right of the button */
  margin-left: 10px; /* Adds some space between the button and the tooltip */
  top: 50%; /* Align the tooltip vertically with the center of the button */
  transform: translateY(-50%); /* Center the tooltip vertically */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Show tooltip on hover */
button:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

/* Show tooltip on hover */
button:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

/* Message styling */
.message {
  color: #555;
  font-size: 0.9em;
}
</style>
