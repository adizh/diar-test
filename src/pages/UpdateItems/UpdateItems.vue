<template>
  <div class="section flex gap-3">
    <HideFood />
    <Divider layout="vertical" />
    <ShowFood />
  </div>

  <Toast />
</template>

<script setup lang="ts">
import http from "@/http";

import HideFood from "@/components/Update/HideFood.vue";
import ShowFood from "@/components/Update/ShowFood.vue";

import { useToast } from "primevue/usetoast";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const toast = useToast();

onMounted(async () => {
  await store.dispatch("getAllCategoryNames");
  store.dispatch("fetchAllContainers");
});
</script>

<style scoped></style>
