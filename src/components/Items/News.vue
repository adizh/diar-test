<template>
    <Card class="list-card">
        <template #title>

<div class="flex justify-content-end"><Button severity="danger" icon="pi pi-trash" @click="openDelete"/></div>
          <div class="flex flex-row justify-content-between">
            <span>
             {{ news?.name }}
            </span>
       
          </div>
        </template>
        <template #content>
            <img :src="news?.photoLink" :alt="news?.name" class="list-img">
            <p>Описание: {{ news?.description }}</p>

        </template>
    </Card>

    <Dialog v-model:visible="isDeleteOpen" modal :style="{ width: '25rem' }">
        <div>
          <p>Вы действительно хотите удалить эту новость?</p>
          <div>
            <Button label="Отменить" @click="isDeleteOpen=false"/>
            <Button label="Удалить" @click="deleteNews" severity="danger"/>
          </div>
        </div>
            </Dialog>
</template>

<script setup lang="ts">
import http from '@/http';
import {News} from '@/types/News'
import { ref } from 'vue';
const props = defineProps<{ 
  news: News; 
}>();

const isDeleteOpen=ref(false);
const openDelete =()=>{
    isDeleteOpen.value=true
}

const deleteNews =async()=>{
    try{
const response=await http({
    method:"delete",
    url:`admin/delete-news`,
    data:{name:props?.news?.name}
})
console.log('response',response);
if(response.status===200){
  isDeleteOpen.value=false;
}
    }catch(err){
        console.log(err)
    }
}
</script>

<style scoped>

</style>