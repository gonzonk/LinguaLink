<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

enum UserRole {
  TEACHER = "Teacher",
  LEARNER = "Learner",
}

enum Dialects {
  WEST = "North Island Western",
  EAST = "North Island Eastern",
  SOUTH = "South Island",
}

const username = ref("");
const password = ref("");
const description = ref("");
const role = ref<UserRole>(UserRole.LEARNER);
const dialect = ref<Dialects>(Dialects.WEST);

const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value, description.value, role.value, dialect.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-description">Description</label>
        <textarea v-model.trim="description" id="aligned-description" placeholder="Optional description"></textarea>
      </div>
      <div class="pure-control-group">
        <label for="aligned-role">Role</label>
        <select v-model="role" id="aligned-role" required>
          <option value="" disabled>Select a role</option>
          <option :value="UserRole.TEACHER">Teacher</option>
          <option :value="UserRole.LEARNER">Learner</option>
        </select>
      </div>
      <div class="pure-control-group">
        <label for="aligned-role">Dialect</label>
        <select v-model="dialect" id="aligned-dialect" required>
          <option value="" disabled>Select your dialect</option>
          <option :value="Dialects.WEST">North Island Western</option>
          <option :value="Dialects.EAST">North Island Eastern</option>
          <option :value="Dialects.SOUTH">South Island</option>
        </select>
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
