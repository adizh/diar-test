<template>
    <div class="card flex justify-content-center">
        <Dialog :modelValue="props.visible" modal :header="header" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">{{ header }}</span>
            <slot name="body-content"></slot>
            <div class="flex justify-content-end gap-2">
                <!-- <Button type="button" label="Cancel" severity="secondary" @click="$emit('closeModal')"></Button>
                <Button type="button" label="Create" @click="$emit('saveInfo')"></Button> -->
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
const props = defineProps<{
    visible: boolean;
    header: string
}>()


const visibility = computed(() => props.visible)
watch(visibility, (value) => {
    console.log('value visible', value)
})


</script>

<style scoped></style>