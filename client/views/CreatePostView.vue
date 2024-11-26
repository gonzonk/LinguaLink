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
    <!-- Wrapper for heading and button -->
    <div class="header-wrapper">
      <!-- RouterLink styled as a button in top-right corner -->
      <RouterLink :to="{ name: 'Posts' }" class="posts-link">
        <button class="button-link">Go to Posts</button>
      </RouterLink>

      <h1>Add a word:</h1>
    </div>

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

/* Wrapper for heading and button */
.header-wrapper {
  /* display: flex; */
  justify-content: space-between;
  align-items: center; /* Align items vertically in the center */
  margin-bottom: 20px; /* Add some space below the header */
}

/* Positioning the link button */
.posts-link {
  display: inline-block;
  align-items: right;
}

.button-link {
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

.button-link:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.button-link:focus {
  outline: none; /* Remove focus outline */
}
</style>
