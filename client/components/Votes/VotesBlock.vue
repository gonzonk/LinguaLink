<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import VotesForm from "./VotesForm.vue";

const props = defineProps(["parent"]);
const upvotes = ref(0);
const downvotes = ref(0);
const loaded = ref(false);

const getVotes = async () => {
  try {
    upvotes.value = await fetchy(`/api/upvotes/${props.parent._id}`, "GET");
    downvotes.value = await fetchy(`/api/downvotes/${props.parent._id}`, "GET");
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
    <div v-if="loaded">
      <VotesForm :upvotes="upvotes" :downvotes="downvotes" :parent="props.parent" @refresh-votes="getVotes" />
    </div>
    <p v-else>Loading...</p>
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
