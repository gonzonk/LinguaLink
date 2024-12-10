<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let currentPassword = ref("");
let newPassword = ref("");
let newDescription = ref("");

const { updateUserUsername, updateUserPassword, updateUserDescription, updateSession } = useUserStore();

async function updateUsername() {
  await updateUserUsername(username.value);
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUserPassword(currentPassword.value, newPassword.value);
  await updateSession();
  currentPassword.value = newPassword.value = "";
}

async function updateDescription() {
  await updateUserDescription(newDescription.value);
  await updateSession();
  newDescription.value = "";
}
</script>

<template>
  <h2>Update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" required />
      <button type="submit" class="pure-button pure-button-primary">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>Change your password</legend>
      <input type="password" placeholder="Old password" v-model="currentPassword" required />
      <input type="password" placeholder="New password" v-model="newPassword" required />
      <button type="submit" class="pure-button pure-button-primary">Update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateDescription" class="pure-form">
    <fieldset>
      <legend>Change your "About" description</legend>
      <input type="text" placeholder="New description" v-model="newDescription" required />
      <button type="submit" class="pure-button pure-button-primary">Update description</button>
    </fieldset>
  </form>
</template>
