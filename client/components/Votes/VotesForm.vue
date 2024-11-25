<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["parent"]);
const emit = defineEmits(["refreshVotes"]);

const placeUpvote = async () => {
  try {
    await fetchy("/api/upvotes/upvote/", "PUT", {
      body: {
        id: props.parent,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshVotes");
};

const placeDownvote = async () => {
  try {
    await fetchy("/api/upvotes/downvote/", "PUT", {
      body: {
        id: props.parent,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshVotes");
};
</script>

<template>
  <div>
    <button @click="placeUpvote">Upvote</button>
    <button @click="placeDownvote">Downvote</button>
  </div>
</template>

<style scoped>
div {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
</style>
