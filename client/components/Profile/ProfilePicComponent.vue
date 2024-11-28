<script setup lang="ts">
import router from "@/router";
import { computed } from "vue";

const props = defineProps(["username"]);

const firstLetter = computed(() => {
  return props.username.charAt(0).toUpperCase();
});

async function navigateToProfile(username: string) {
  void router.push({ path: `/profile/${username}` });
}
</script>

<template>
  <div class="profile-picture" @click="navigateToProfile(props.username)">
    {{ firstLetter }}
  </div>
</template>

<style scoped>
.profile-picture {
  width: 70px;
  height: 70px;
  background-color: #00ffc3;
  color: black;
  border-radius: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  cursor: pointer;
}

.profile-picture:hover {
  background-color: #00b3b3; /* Darker shade on hover */
}
</style>
