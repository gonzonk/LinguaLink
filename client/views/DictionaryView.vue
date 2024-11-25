<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import EntryComponent from '../components/Dictionary/EntryComponent.vue'
import { fetchy } from '@/utils/fetchy';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXZ'
const entries = ref([])
const selectedLetter = ref('A')
const entriesToDisplay = computed(() => {
    return entries.value.filter(e => {
        const { word } = e;
        return (word as string).startsWith(selectedLetter.value);
    })
})

onBeforeMount(async () => {
  try {
    const results = await fetchy("/api/entries", "GET");
    console.log(JSON.stringify(results, null, 2))
    entries.value = results
  } catch (_) {
    return;
  }
})
const onLetterClicked = (letter: string) => {
    selectedLetter.value = letter
}
</script>

<template>
<main class="container">
    <h1>Dictionary</h1>
    <h3 style="margin-bottom: 12px;">Browse alphabetically</h3>
    <div class="letterContainer">
        <button class="letter" :style="{ backgroundColor: letter === selectedLetter ? '#d4e8fb' : '#f0f8ff'}" v-for="letter in ALPHABET" :key="letter" @click="onLetterClicked(letter)">
            {{letter}}
        </button>
    </div>

    <EntryComponent v-for="entry in entriesToDisplay" :entry="entry"/>
    
</main>
</template>

<style scoped>
 .container {
    padding: 32px;
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
    cursor:pointer;
 }
 .letter:active {
    background-color: #d4e8fb;
 }
</style>