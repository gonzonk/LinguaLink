<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const errorMessage = ref(""); // Define a reactive variable for error messages

const handleErrorMessage = (message: string) => {
  errorMessage.value = message; // Update the error message when emitted
};
</script>

<template>
  <main>
    <h1>Add a word:</h1>
    <section>
      <h1 v-if="isLoggedIn"></h1>
      <h1 v-else>Please login!</h1>
    </section>
    <CreatePostForm @showErrorMessage="handleErrorMessage" />
    <p v-if="errorMessage" style="color: red; text-align: center">{{ errorMessage }}</p>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
