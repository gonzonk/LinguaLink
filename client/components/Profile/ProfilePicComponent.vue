<script setup lang="ts">
import router from "@/router";
import { computed } from "vue";

const props = defineProps(["username", "size"]);

const firstLetter = computed(() => {
  return props.username.charAt(0).toUpperCase();
});

async function navigateToProfile(username: string) {
  void router.push({ path: `/profile/${username}` });
}
</script>

<template>
  <div class="profile-picture" :style="{ width: props.size, height: props.size, fontSize: `${parseInt(props.size) * 0.65}px` }" @click="navigateToProfile(props.username)">
    {{ firstLetter }}
  </div>
</template>

<style scoped>
.profile-picture {
  background-color: #00ffc3;
  color: black;
  border-radius: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.profile-picture:hover {
  background-color: #00b3b3; /* Darker shade on hover */
}
</style>
