<template>
    <div class="flex flex-column gap-4 align-items-center">

<span>{{  descrText}}?</span>

<div class='flex flex-row justify-content-end gap-2'>
    <Button :label="declineText" severity="danger" @click="$emit('closeModal')"/>
    <Button :label="confirmText" severity="success" @click="$emit('confirmAction')"/>
</div>
      

    </div>
</template>

<script setup lang="ts">
const props=defineProps({
    confirmText:String,
    declineText:String,

    descrText:String
})
const emit=defineEmits(['closeModal','confirmAction'])
</script>

<style scoped>

</style>