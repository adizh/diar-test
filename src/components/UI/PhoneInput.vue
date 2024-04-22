<template>

    <!-- <InputText id="phone" class="flex-auto" autocomplete="off" v-model="phone" /> -->
    <InputMask id="phone" v-model="phone" mask="+996 (700) 11-11-11" placeholder="+996 (700) 11-11-11" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const phone = ref('');
</script>

<style scoped></style>