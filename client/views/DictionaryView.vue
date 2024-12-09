<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import EntryComponent from "../components/Dictionary/EntryComponent.vue";
import { fetchy } from "@/utils/fetchy";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentRole } = storeToRefs(useUserStore()); // Accessing currentRole from store
const ALPHABET = "AEHIKMNOPRTUW";

const tags = ref([]);
const entries = ref([]);
const posts = ref([]);
const selectedLetter = ref("A");
const selectedTag = ref();
const searchQuery = ref("");
const selectedTab = ref(0);
const alphabeticalEntries = computed(() => {
  return entries.value
    .filter((e) => {
      const { word } = e;
      return (word as string).toLowerCase().startsWith(selectedLetter.value.toLowerCase());
    })
    .sort((a: { word: string }, b: { word: string }) => (a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1));
});

const tagEntries = computed(() => {
  let filteredPosts = posts.value
    .map((p: { word: any; translation: any; tags: any }) => ({ word: p.word, translation: p.translation, tags: p.tags }))
    .filter((p) => {
      const { tags } = p;
      return (tags as string[]).find((t) => t === selectedTag.value) !== undefined;
    })
    .sort((a: { word: string }, b: { word: string }) => (a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1));

  let uniqueEntries: any[] = [];

  if (filteredPosts.length > 0) {
    uniqueEntries = [filteredPosts[0]];
    for (let i = 1; i < filteredPosts.length; i++) {
      // Since filtered posts array is sorted by word, posts for the same word will have consecutive indices
      // The following for loop picks one post per word
      if (filteredPosts[i].word !== filteredPosts[i - 1].word) {
        uniqueEntries.push(filteredPosts[i]);
      }
    }
  }

  return uniqueEntries;
});

onBeforeMount(async () => {
  try {
    const results = await fetchy("/api/entries", "GET");
    entries.value = results;

    const postResults = await fetchy("/api/posts", "GET");
    posts.value = postResults.map((post: { word: any; translation: any; tags: any }) => ({ word: post.word, translation: post.translation, tags: post.tags }));

    const tagResults = await fetchy("/api/tags", "GET");
    tags.value = tagResults.filter((t: string) => t !== "None");
    selectedTag.value = tags.value.at(0);
  } catch (_) {
    return;
  }
});

const onLetterClicked = (letter: string) => {
  selectedLetter.value = letter;
};

const onSearchButtonClicked = async () => {
  if (searchQuery.value.length > 0) {
    void router.push({ path: `/posts/${searchQuery.value.toLowerCase()}` });
  }
};

const onTabSelected = async (tabIndex: number) => {
  selectedTab.value = tabIndex;
};

const getTabClass = (tabIndex: number) => {
  return selectedTab.value === tabIndex ? "selected_tab" : "unselected_tab";
};
</script>

<template>
  <main class="container">
    <!-- RouterLink to add word, styled as a blue button -->

    <div style="display: flex; align-items: center">
      <h1 style="width: 785px">📚 Dictionary</h1>
      <RouterLink v-if="currentRole === 'Teacher'" :to="{ name: 'CreatePost' }" class="add-word-link">
        <button class="add-word-button">Add Word</button>
      </RouterLink>
    </div>
    <h3 class="search_prompt">Search for a word below</h3>
    <div class="search_bar">
      <input class="word_input" v-model="searchQuery" />
      <button class="search-button" @click="onSearchButtonClicked">Search</button>
    </div>

    <div class="browse_container">
      <div class="browse_tabs">
        <button class="tab" :class="getTabClass(0)" @click="onTabSelected(0)">BROWSE ALPHABETICALLY</button>
        <button class="tab" :class="getTabClass(1)" @click="onTabSelected(1)">BROWSE BY CATEGORY</button>
      </div>
      <div v-if="selectedTab === 0" class="alphabetical_content">
        <div class="letterContainer">
          <button class="letter" :style="{ backgroundColor: letter === selectedLetter ? '#d4e8fb' : '#f0f8ff' }" v-for="letter in ALPHABET" :key="letter" @click="onLetterClicked(letter)">
            {{ letter }}
          </button>
        </div>
        <EntryComponent v-for="entry in alphabeticalEntries" v-bind:key="entry" :entry="entry" />
      </div>
      <div v-else class="tag_content">
        <div class="selector_container">
          <p class="tag_prompt"><b>Pick category</b></p>
          <select class="tag_selector" v-model="selectedTag">
            <option v-for="tag in tags" v-bind:key="tag">{{ tag }}</option>
          </select>
        </div>
        <EntryComponent v-for="entry in tagEntries" v-bind:key="entry.word" :entry="entry" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  padding: 32px;
}

/* Style the Add Word button link */
.add-word-link {
  /* position: absolute;
    top: 186px;
    right: 338px; */
}

.tag_selector {
  width: 200px; /* Adjust width as needed */
  height: 40px;
  padding: 10px; /* Add some padding for better appearance */
  border: 1px solid #ccc; /* Light gray border */
  border-radius: 10px; /* Rounded corners */
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  background-color: #f0f8ff; /* White background */
  appearance: none; /* Remove default styling (especially in WebKit browsers) */
  -webkit-appearance: none; /* Remove default styling in Safari */
  -moz-appearance: none; /* Remove default styling in Firefox */
}

.tag_prompt {
  font-size: 16px;
  font-style: italic;
  margin-top: 0px;
  margin-bottom: 4px;
  margin-left: 4px;
}

/* Optional: Style the dropdown arrow */
.tag_selector::after {
  content: "▼"; /* Unicode character for down arrow */
  position: absolute;
  right: 10px;
  pointer-events: none;
}

/* Optional: Ensure the select is displayed correctly in a container */
.selector_container {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.word_input {
  width: 765px;
  height: 30px;
  border-color: black;
  border-width: 1px 0.2px 1px 1px;
  border-radius: 3px 0px 0px 3px;
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
  margin-bottom: 16px;
}

.search_prompt {
  font-size: 18px;
  margin-bottom: 4px;
}

.search-button {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  border: none;
  padding: 10px 40px;
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
  align-self: center;
  height: 30px;
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 36px;
}

.letter {
  height: 40px;
  width: 50px;
  font-weight: 600;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
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

.browse_container {
  width: 900px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  overflow: hidden;
}

.tab {
  border: 0;
  width: 450px;
  flex-basis: 33.33%;
  flex-grow: 0;
  flex: 1 1 auto;
}
.unselected_tab {
  background-color: #f0f8ff;
  font-weight: 600;
}

.unselected_tab:hover {
  background-color: #cbddee;
}

.selected_tab {
  background-color: #007bff;
  font-weight: 600;
  color: white;
}

.browse_tabs {
  display: flex;
  flex-direction: row;
  flex: 0 1 40px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
}

.alphabetical_content {
  display: flex;
  min-height: 500px;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  flex: 1 1 auto;
}

.tag_content {
  display: flex;
  min-height: 500px;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  flex: 1 1 auto;
}

button:hover {
  opacity: 1;
  cursor: pointer;
}
</style>
