<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const loaded = ref(false);
const props = defineProps(["parent"]);

let flashcards = ref<Array<Record<string, string>>>([]);
let selectedGroup = ref<Record<string, string>>();

const createGroup = async () => {
  console.log("propsparent", [props.parent]);
  try {
    await fetchy("/api/flashcards", "POST", {
      body: {
        name: name.value,
        item: props.parent,
      },
    });
  } catch (_) {
    return;
  }
};

const updateGroup = async () => {
  console.log("update grup");
  try {
    if (!selectedGroup.value) {
      throw new Error("No group selected");
    } else {
      console.log("selected group", selectedGroup);
      console.log("selected group name", selectedGroup.value.name);
      await fetchy(`/api/flashcards/${selectedGroup.value.name}`, "PATCH", {
        body: {
          item: props.parent,
        },
      });
    }
  } catch (_) {
    return;
  }
};

const getAuthoredGroups = async () => {
  let flashcardGet;
  try {
    flashcardGet = await fetchy("/api/authoredFlashcards", "GET", {});
  } catch (_) {
    return;
  }
  flashcards.value = flashcardGet.flashcards;
  console.log(flashcardGet);
};

onBeforeMount(async () => {
  await getAuthoredGroups();
  loaded.value = true;
});
</script>

onBeforeMount
<template>
  <form @submit.prevent="updateGroup">
    <div class="authoredGroups">
      <h2>Your groups</h2>
      <section class="authoredFlashcards" v-if="loaded && flashcards.length !== 0">
        <label v-for="group in flashcards" :key="group._id" for="group._id">
          <input type="radio" id="group._id" :value="group" v-model="selectedGroup" />
          <p>{{ group.name }}</p>
        </label>
      </section>
    </div>
    <div class="newGroup">
      <h2>New Group:</h2>
      <form @submit.prevent="createGroup">
        <label for="title">Name:</label>
        <input id="title" v-model="name" placeholder="enter name" required />
        <button type="submit" class="pure-button-primary pure-button" @click="getAuthoredGroups">Create Group and Add This Post</button>
      </form>
    </div>
    <button type="submit" class="pure-button-primary pure-button">Add To Group</button>
  </form>
</template>

<style scoped>
form {
  background-color: rgb(255, 255, 255);
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
