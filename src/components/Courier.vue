<template>
    <Card>
        <template #title>Courier Name: {{ item?.username }}</template>
        <template #content>
            <p class="m-0 flex flex-column g-3">
                <span>Email :{{ item?.email }}</span>
                <span class="mt-2">Phone :{{ item?.phone }}</span>
            </p>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { Courier } from '@/types/Courier';


defineProps<{
    item: Courier
}>()
</script>

<style scoped></style>