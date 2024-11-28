<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { UserRole, Dialects } from "../../stores/user.ts";

let username = ref("");
let currentPassword = ref("");
let newPassword = ref("");
let newDescription = ref("");
let newRole = ref<UserRole>(UserRole.LEARNER);
let newDialect = ref<Dialects>(Dialects.WEST);

const { updateUserUsername, updateUserPassword, updateUserDescription, updateUserRole, updateUserDialect, updateSession } = useUserStore();

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

async function updateRole() {
  await updateUserRole(newRole.value);
  await updateSession();
  newRole.value = "";
}

async function updateDialect() {
  await updateUserDialect(newDialect.value);
  await updateSession();
  newDialect.value = "";
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
      <legend>Change your description</legend>
      <input type="text" placeholder="New description" v-model="newDescription" required />
      <button type="submit" class="pure-button pure-button-primary">Update description</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateRole" class="pure-form">
    <fieldset>
      <legend>Change your role</legend>
      <select v-model="newRole" required>
        <option value="" disabled>Select a role</option>
        <option :value="UserRole.TEACHER">Teacher</option>
        <option :value="UserRole.LEARNER">Learner</option>
      </select>
      <button type="submit" class="pure-button pure-button-primary">Update role</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateDialect" class="pure-form">
    <fieldset>
      <legend>Change your dialect</legend>
      <select v-model="newDialect" required>
        <option value="" disabled>Select your dialect</option>
        <option :value="Dialects.WEST">North Island Western</option>
        <option :value="Dialects.EAST">North Island Eastern</option>
        <option :value="Dialects.SOUTH">South Island</option>
      </select>
      <button type="submit" class="pure-button pure-button-primary">Update dialect</button>
    </fieldset>
  </form>
</template>
