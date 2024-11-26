<script setup lang="ts">
import { ref } from "vue";

const word = ref("");
const emit = defineEmits(["getPostsByWord"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByWord', word)" class="pure-form">
    <fieldset>
      <legend>Search by word</legend>
      <input id="word" type="text" v-model="word" placeholder="word" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
