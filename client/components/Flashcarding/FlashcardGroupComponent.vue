<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import router from "@/router";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import SearchPostForm from "../Post/SearchPostForm.vue";

const flashcarding = ref(false);
const flipped = ref(false);
const cardIndex = ref(0);
let searchWord = ref("");
let posts = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);
const props = defineProps(["group"]);
const length = props.group.items.length;
const { currentUsername } = storeToRefs(useUserStore());
const groupData = ref(props.group);
const addingPost = ref(false);

console.log("props.group", props.group);
console.log("props.group.items", props.group.items);

async function deleteGroup() {
  void router.push({ path: `/groups` });
  try {
    await fetchy(`/api/flashcards/${props.group.name}`, "DELETE");
  } catch (_) {
    return;
  }
}

async function getPosts(word?: string) {
  let postResults;
  try {
    // Check if the word is provided, if so call the `/posts/:word` route.
    if (word) {
      postResults = await fetchy(`/api/posts/${word}`, "GET");
    } else {
      // If no word is provided, call the `/posts` route to get all posts.
      postResults = await fetchy("/api/posts", "GET");
    }
  } catch (_) {
    return;
  }

  // Set the search word for UI purposes and update the posts array
  searchWord.value = word ? word : "";
  // Fetch upvotes and downvotes for each post and calculate net votes
  for (let post of postResults) {
    post.netVotes = post.upvotes.length - post.downvotes.length;
  }
  // Sort posts by net votes in descending order
  posts.value = postResults.sort((a: { netVotes: number }, b: { netVotes: number }) => b.netVotes - a.netVotes);
}

function rightScroll() {
  cardIndex.value = (cardIndex.value + 1) % length;
  flipped.value = false;
}

function leftScroll() {
  cardIndex.value = cardIndex.value - 1 < 0 ? length - 1 : (cardIndex.value - 1) % length;
  flipped.value = false;
}

const updateGroup = async (post: Record<string, string>) => {
  console.log("update group");
  try {
    console.log("selected group", props.group);
    console.log("selected group name", props.group.name);
    await fetchy(`/api/flashcards/${props.group.name}`, "PATCH", {
      body: {
        item: post,
      },
    });
    groupData.value.items = [...groupData.value.items, post];
  } catch (_) {
    return;
  }
};

onBeforeMount(async () => {
  const { params } = useRoute();
  console.log(`Route params: ${JSON.stringify(params, null, 2)}`);
  if (params.word) {
    await getPosts(params.word as string);
  } else {
    await getPosts();
  }
  loaded.value = true;
});
</script>

<template>
  <main v-if="!flashcarding">
    <div class="info">
      <h1>{{ props.group.name }}</h1>
      <h2>By: {{ props.group.authorName }}</h2>
      <h2>Role: {{ props.group.authorRole }}</h2>
      <button class="delete" v-if="currentUsername == group.authorName" v-on:click="deleteGroup">Delete</button>
      <button class="flashcardButton" v-on:click="() => (flashcarding = !flashcarding)">Practice Flashcards</button>
    </div>
    <div class="posts">
      <article class="post" v-for="post in groupData.items" :key="post._id">
        <h2>{{ post.word }}</h2>
        <h3>{{ post.translation }}</h3>
        <div v-if="post.imageUrl" class="image-container">
          <img :src="post.imageUrl" alt="Post image" class="post-image" />
        </div>
      </article>
    </div>
    <button v-on:click="() => (addingPost = !addingPost)">Add A Post</button>
    <div v-if="addingPost" class="addPost">
      <div class="row">
        <h2 v-if="!searchWord">Posts:</h2>
        <h2 v-else>Posts for {{ searchWord }}:</h2>
        <SearchPostForm @getPostsByWord="getPosts" />
      </div>
      <section class="posts" v-if="loaded && posts.length !== 0">
        <article v-for="post in posts" :key="post._id">
          <p class="author">{{ post.author }}</p>
          <p v-if="post.tags.length > 0 && post.tags.at(0) !== 'None'" class="tag">{{ `🏷️ ${post.tags.at(0)}` }}</p>
          <p class="word">{{ post.word }}</p>
          <p class="translation">{{ post.translation }}</p>
          <div v-if="post.imageUrl" class="image-container">
            <img :src="post.imageUrl" alt="Post image" class="post-image" />
          </div>
          <audio v-if="post.audioUrl" controls class="audio_element" crossorigin="anonymous">
            <source :src="post.audioUrl" />
          </audio>
          <button v-on:click="() => updateGroup(post)">Add Post</button>
        </article>
      </section>
      <p v-else-if="loaded">No posts found</p>
      <p v-else>Loading...</p>
    </div>
  </main>
  <main class="flashcarding" v-else>
    <button class="flashcardButton" v-on:click="() => (flashcarding = !flashcarding)">Flashcard Group: {{ props.group.name }}</button>
    <div>
      <p>Click the card to flip. Navigate to the next or previous word using the buttons on the sides.</p>
    </div>
    <div class="cardControls">
      <!-- Left scroll button with the new SVG -->
      <button class="changeButton" v-on:click="leftScroll">
        <svg
          fill="#000000"
          height="50px"
          width="50px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 330 330"
          xml:space="preserve"
          transform="matrix(-1, 0, 0, 1, 0, 0)"
        >
          <path
            d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255 s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0 c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z"
          ></path>
        </svg>
      </button>

      <!-- Flashcard card -->
      <article class="card" v-on:click="() => (flipped = !flipped)">
        <div class="front" v-if="!flipped">
          <h2>{{ groupData.items[cardIndex].word }}</h2>
        </div>
        <div class="back" v-else>
          <h2>{{ groupData.items[cardIndex].translation }}</h2>
          <div v-if="groupData.items[cardIndex].imageUrl" class="image-container">
            <img :src="groupData.items[cardIndex].imageUrl" alt="Post image" class="post-image" />
          </div>
        </div>
      </article>

      <!-- Right scroll button with the original SVG -->
      <button class="changeButton" v-on:click="rightScroll">
        <svg
          fill="#000000"
          height="50px"
          width="50px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 330 330"
          xml:space="preserve"
        >
          <path
            d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255 s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0 c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z"
          ></path>
        </svg>
      </button>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.cardControls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

main h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
  margin: auto;
}

main h2 {
  margin: auto;
  margin-top: 8px;
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 8px;
}

main h3 {
  font-size: 1rem;
  color: #777;
}

button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 10vw;
  margin: auto;
  margin-top: 4px;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.changeButton {
  display: inline-block;
  padding: 10px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button.delete {
  background-color: #dc3545;
}

button.delete:hover {
  background-color: #c82333;
}

.posts {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
}

.post {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.image-container {
  margin-top: 10px;
  text-align: center;
}

.post-image {
  max-width: 75%;
  max-height: 75%;
  border-radius: 4px;
}

.flashcarding {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 50vw;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card .front,
.card .back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flashcardButton {
  margin-bottom: 20px;
}

.addPost section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.addPost,
section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

.addPost article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.addPost.posts {
  padding: 1em;
}

.addPost.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
