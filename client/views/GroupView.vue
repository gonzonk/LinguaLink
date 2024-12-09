<script setup lang="ts">
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import GroupComponent from "@/components/Flashcarding/FlashcardGroupComponent.vue";
const route = useRoute();
const loaded = ref(false);
const groupName = route.params.name;
let group = ref<Array<Record<string, string>>>([]);

async function getPost(name: string) {
  let groupResults;
  try {
    groupResults = await fetchy(`/api/flashcards/${name}`, "GET");
  } catch (_) {
    return;
  }
  console.log("group res", groupResults.flashcards);
  group.value = groupResults.flashcards;
}

onBeforeMount(async () => {
  console.log("searching for", groupName);
  //@ts-expect-error groupName is a string
  await getPost(groupName);
  loaded.value = true;
});
</script>

<template>
  <main>
    <div v-if="loaded">
      <section class="group">
        <GroupComponent :group="group" />
      </section>
    </div>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped></style>
