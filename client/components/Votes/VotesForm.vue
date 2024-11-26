<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { ref } from "vue";
import { onBeforeMount } from "vue";

const props = defineProps(["parent"]);
const emit = defineEmits(["refreshVotes"]);

let upvoted = ref(false);
let downvoted = ref(false);
let loaded = ref(false);

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
      body: {
        id: props.parent._id,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshVotes");
  await voteStatus();
};

const placeDownvote = async () => {
  try {
    await fetchy("/api/upvotes/downvote/", "PUT", {
      body: {
        id: props.parent._id,
      },
    });
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
  <div>
    <button @click="placeUpvote" v-if="upvoted">!!Upvoted!!</button>
    <button @click="placeUpvote" v-else>Upvote</button>
    <button @click="placeDownvote" v-if="downvoted">!!Downvoted!!</button>
    <button @click="placeDownvote" v-else>Downvote</button>
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
