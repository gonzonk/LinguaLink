<script setup lang="ts">
import router from "@/router";

const props = defineProps(["entry"]);

const onEntryClicked = () => {
  void router.push({ path: `/posts/${props.entry.word}` });
};

const capitalizeStr = (str: string) => {
  return str.at(0)?.toUpperCase().concat(str.substring(1));
};
</script>

<template>
  <main>
    <div class="container" @click="onEntryClicked">
      <h1 class="entry">{{ capitalizeStr(props.entry.word) }}</h1>
      <h3 class="translation">{{ props.entry.translation }}</h3>
    </div>
  </main>
</template>

<style scoped>
.container {
  width: 300px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  border-width: 0px;
  padding: 16px;
  margin-bottom: 24px;
}
.container:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.02);
}
.entry {
  color: rgb(27, 145, 230);
  font-size: 24px;
  margin: 0px;
  margin-bottom: 4px;
}
.translation {
  font-size: 16px;
  margin: 0px;
  margin-left: 8px;
}
</style>
