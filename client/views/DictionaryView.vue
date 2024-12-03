<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import EntryComponent from "../components/Dictionary/EntryComponent.vue";
import { fetchy } from "@/utils/fetchy";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentRole } = storeToRefs(useUserStore()); // Accessing currentRole from store
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXZ";
const entries = ref([]);
const selectedLetter = ref("A");
const searchQuery = ref("");
const entriesToDisplay = computed(() => {
  return entries.value.filter((e) => {
    const { word } = e;
    return (word as string).startsWith(selectedLetter.value);
  });
});

onBeforeMount(async () => {
  try {
    const results = await fetchy("/api/entries", "GET");
    entries.value = results;
  } catch (_) {
    return;
  }
});

const onLetterClicked = (letter: string) => {
  selectedLetter.value = letter;
};

const onSearchButtonClicked = async () => {
  if (searchQuery.value.length > 0) {
    void router.push({ path: `/posts/${searchQuery.value}` });
  }
  // try {
  //   const results2 = await fetchy("/api/entries/nature", "GET");
  //   console.log(`results2: ${JSON.stringify(results2, null, 2)}`);
  // } catch (e) {
  //   console.log(JSON.stringify(e, null, 2));
  // }
};
</script>

<template>
  <main class="container">
    <!-- RouterLink to add word, styled as a blue button -->
    <RouterLink v-if="currentRole === 'Teacher'" :to="{ name: 'CreatePost' }" class="add-word-link">
      <button class="add-word-button">Add Word</button>
    </RouterLink>

    <h1>Dictionary</h1>
    <div class="search_bar">
      <input class="word_input" v-model="searchQuery" />
      <button class="search-button" @click="onSearchButtonClicked">Search</button>
    </div>

    <h3 style="margin-bottom: 12px">Browse alphabetically</h3>
    <div class="letterContainer">
      <button class="letter" :style="{ backgroundColor: letter === selectedLetter ? '#d4e8fb' : '#f0f8ff' }" v-for="letter in ALPHABET" :key="letter" @click="onLetterClicked(letter)">
        {{ letter }}
      </button>
    </div>

    <EntryComponent v-for="entry in entriesToDisplay" v-bind:key="entry" :entry="entry" />
  </main>
</template>

<style scoped>
.container {
  padding: 32px;
}

/* Style the Add Word button link */
.add-word-link {
  position: absolute;
  top: 140px;
  right: 538px;
}

.word_input {
  width: 600px;
  height: 30px;
  border-color: black;
  border-width: 1px 0.2px 1px 1px;
  resize: none;
}

.add-word-button {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px; /* Rounded corners */
  text-align: center;
  text-decoration: none; /* Remove underline */
}

.add-word-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.add-word-button:focus {
  outline: none; /* Remove focus outline */
}

.search_bar {
  display: flex;
  flex-direction: row;
  height: 34px;
}

.search-button {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-left: -2px;
  border-radius: 0px 5px 5px 0px; /* Rounded corners */
  text-align: center;
  text-decoration: none; /* Remove underline */
}

.search-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.letterContainer {
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  margin-bottom: 36px;
}

.letter {
  height: 30px;
  width: 30px;
  margin-right: 8px;
  border-width: 0px;
  background-color: #f0f8ff;
}

.letter:hover {
  background-color: #cbddee;
  cursor: pointer;
}

.letter:active {
  background-color: #d4e8fb;
}
</style>
