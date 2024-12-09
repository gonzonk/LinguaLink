<script setup lang="ts">
const props = defineProps(["group"]);
</script>

<template>
  <h1>{{ props.group.name }}</h1>
  <h2>By: {{ props.group.authorName }}</h2>
  <h2>Role: {{ props.group.authorRole }}</h2>
</template>

<style scoped></style>
