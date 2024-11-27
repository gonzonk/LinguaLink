<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import VotesForm from "./VotesForm.vue";

const props = defineProps(["parent"]);
const votes = ref(0);
const loaded = ref(false);

const getVotes = async () => {
  try {
    const ups = await fetchy(`/api/upvotes/${props.parent._id}`, "GET");
    const downs = await fetchy(`/api/downvotes/${props.parent._id}`, "GET");
    votes.value = ups - downs;
  } catch (e) {
    return;
  }
};

onBeforeMount(async () => {
  await getVotes();
  loaded.value = true;
});
</script>

<template>
  <div>
    <div>
      <p>Votes:</p>
      <p v-if="loaded">{{ votes }}</p>
      <p v-else>...</p>
    </div>
    <VotesForm @refresh-votes="getVotes" v-bind:parent="props.parent" />
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
