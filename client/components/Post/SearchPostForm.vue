<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPostsById"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsById', author)" class="pure-form">
    <fieldset>
      <legend>Search by Id</legend>
      <input id="id" type="text" v-model="author" placeholder="id" />
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
