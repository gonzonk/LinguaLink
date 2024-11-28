<script setup lang="ts">
import ProfileDetails from "@/components/Profile/ProfileDetails.vue";

const props = defineProps(["username"]);
</script>

<template>
  <main>
    <ProfileDetails :username="props.username" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
