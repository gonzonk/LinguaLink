<script setup lang="ts">
// import { useUserStore } from "@/stores/user";
// import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ProfilePicComponent from "./ProfilePicComponent.vue";
import router from "@/router";

const props = defineProps(["username"]);
const loaded = ref(false);
// const { currentUsername } = storeToRefs(useUserStore());
const profileName = ref("");
const profileDescription = ref("");
const profileRole = ref("");
const profileDialect = ref("");

const getInfo = async () => {
  try {
    const { username, description, role, dialect } = await fetchy(`/api/users/${props.username}`, "GET");
    profileName.value = username;
    profileDescription.value = description;
    profileDialect.value = dialect;
    profileRole.value = role;
  } catch (_) {
    profileName.value = "";
    profileDescription.value = "";
    profileDialect.value = "";
    profileRole.value = "";
  }
};

const goToSettings = () => {
  void router.push({ path: `/setting` });
};

onBeforeMount(async () => {
  await getInfo();
  loaded.value = true;
});
</script>

<template>
  <div class="profile-container">
    <div class="profile-left">
      <div class="username">{{ profileName }}</div>
      <div class="profile-info">
        <ProfilePicComponent :username="props.username" :size="'180px'" />
        <div class="info-item"><strong>Role:</strong> {{ profileRole }}</div>
        <div class="info-item"><strong>Dialect:</strong> {{ profileDialect }}</div>
      </div>
    </div>
    <div class="profile-right">
      <div class="about">
        <h3>About</h3>
        <p>{{ profileDescription }}</p>
      </div>
      <div>
        <img src="@/assets/images/gear.png" alt="Settings Button" class="settings-logo" @click="goToSettings" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.profile-left {
  flex: 1 1 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-size: 34px;
  font-weight: bold;
  margin-bottom: 10px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.info-item {
  font-size: 25px;
}

.profile-right {
  flex: 2 1 400px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.about {
  background-color: #f4f4f4;
  width: 80%;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about h3 {
  margin-top: 0;
  font-size: 25px;
}

.about p {
  font-size: 16px;
  line-height: 1.6;
}

.settings-logo {
  width: 85px;
  height: 85px;
}

.settings-logo:hover {
  cursor: pointer;
  transform: scale(1.05); /* Slightly increase size on hover */
}
</style>
