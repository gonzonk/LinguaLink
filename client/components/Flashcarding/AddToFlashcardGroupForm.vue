<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const loaded = ref(false);
const show = ref(false);
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
  <form @submit.prevent="updateGroup" v-if="show">
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

  <!-- Add to Flashcard Group Button with SVG -->
  <button v-else v-on:click="() => (show = true)" class="flashcard-btn">
    <!-- SVG Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
      <path
        d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16h-5v5 c0,0.553-0.448,1-1,1s-1-0.447-1-1v-5H9c-0.552,0-1-0.447-1-1s0.448-1,1-1h5V9c0-0.553,0.448-1,1-1s1,0.447,1,1v5h5 c0.552,0,1,0.447,1,1S21.552,16,21,16z"
      ></path>
    </svg>
    <!-- Always visible text -->
    <span class="flashcard-text">Add to a Flashcard Group</span>
  </button>
</template>

<style scoped>
/* Flashcard Button Style */
.flashcard-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 10px; /* Space between icon and text */
  transition: transform 0.3s ease;
}

.flashcard-btn svg {
  width: 35px; /* Size of the icon */
  height: 35px;
  fill: #000000; /* Icon color */
}

.flashcard-btn:hover svg {
  fill: #0056b3; /* Icon color on hover */
}

/* Text styling */
.flashcard-text {
  font-size: 14px; /* Size of the text */
  color: #333;
  font-weight: normal;
}

/* Additional styles for the form and flashcards */
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

.authoredGroups {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.authoredGroups h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.authoredFlashcards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.authoredFlashcards label {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.authoredFlashcards label:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.authoredFlashcards input[type="radio"] {
  margin-right: 10px;
}

.authoredFlashcards p {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

.newGroup {
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.newGroup h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.newGroup label {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #555;
}

.newGroup input {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.newGroup button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.newGroup button:hover {
  background-color: #0056b3;
}

form > button[type="submit"] {
  display: block;
  margin: 20px 0 0;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form > button[type="submit"]:hover {
  background-color: #218838;
}
</style>
