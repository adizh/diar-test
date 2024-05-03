<template>
    <Card>
        <template #title>Имя курьера: {{ item?.username }}</template>
        <template #content>
            <p class="m-0 flex flex-column g-3">
                <span>Почта :{{ item?.email }}</span>
                <span class="mt-2">Номер телефона :{{ item?.phone }}</span>
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