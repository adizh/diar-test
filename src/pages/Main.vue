<template>
    <div class='section'>
        Main Page
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

onMounted(() => {
    store.dispatch('refreshToken');
   
})


</script>

<style scoped></style>