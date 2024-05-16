<template>

    <Card>
        <template #title>
          <div class="flex flex-row justify-content-between">
            <span>
                Название: {{ sale?.name }}
            </span>
        <Button severity="danger" icon="pi pi-trash"  @click="isDeleteOpen=true"/>
          </div>
        </template>
        <template #content>
            <img :src="sale?.photoLink" :alt="sale?.name" class="sale-img">
            <p>Описание: {{ sale?.description }}</p>
            <p>Скидка: {{ sale?.discount }}</p>
        </template>
    </Card>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Sale} from '@/types/Sale'
const isDeleteOpen=ref(false)
const props = defineProps<{
  sale:Sale
}>()
</script>

<style scoped>
.sale-img{
    width:50%
}
</style>