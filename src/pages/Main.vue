<template>
    <div class='section'>
  Главная страница
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

onMounted(() => {
   // store.dispatch('refreshToken');
   
})


</script>

<style scoped></style>