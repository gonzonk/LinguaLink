<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const loaded = ref(false);

const emit = defineEmits(["refreshEvents"]);
let flashcards = ref<Array<Record<string, string>>>([]);

const createGroup = async () => {
  try {
    await fetchy("/api/flashcards", "POST", {
      body: {
        name: name.value,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshEvents");
};

const getAuthoredGroups = async () => {
  let flashcardGet;
  try {
    flashcardGet = await fetchy("/api/flashcards/authored", "GET", {});
  } catch (_) {
    return;
  }
  flashcards.value = flashcardGet;
};

onBeforeMount(async () => {
  await getAuthoredGroups();
  loaded.value = true;
});
</script>

onBeforeMount
<template>
  <form @submit.prevent="updateGroup">
  </form>
  <h2>New Group:</h2>
  <form @submit.prevent="createGroup">
    <label for="title">Name:</label>
    <input id="title" v-model="name" placeholder="enter name" required />

    <button type="submit" class="pure-button-primary pure-button">Create Group</button>
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
