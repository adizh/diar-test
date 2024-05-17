<template>
    <Card class="list-card">
        <template #title>
          <div class="flex flex-row justify-content-between">
            <span>
                Название: {{ sale?.name }}
            </span>
        <Button severity="danger" icon="pi pi-trash"  @click="confirmDelete"/>
          </div>
        </template>
        <template #content>
            <img :src="sale?.photoLink" :alt="sale?.name" class="list-img">
            <p>Описание: {{ sale?.description }}</p>
            <p>Скидка: {{ sale?.discount }}</p>
        </template>
    </Card>
    <Dialog v-model:visible="isDeleteOpen" modal :style="{ width: '25rem' }">
<div>
  <p>Вы действительно хотите удалить?</p>
  <div>
    <Button label="Отменить" @click="isDeleteOpen=false"/>
    <Button label="Удалить" @click="deleteSale" severity="danger"/>
  </div>
</div>
    </Dialog>
<Toast/>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Sale} from '@/types/Sale'
const isDeleteOpen=ref(false);
import { useConfirm } from "primevue/useconfirm";
import http from '@/http';
import { useToast } from 'primevue/usetoast';
const toast=useToast()
const confirm = useConfirm();
const props = defineProps<{
  sale:Sale
}>()
const currentSale=ref({} as Sale);

const deleteSale=async()=>{
  try{

const response = await http({
  method:'delete',
url:'admin/delete-sale',
data:{name:props?.sale?.name}
})
console.log(response);
if(response.status===200){
toast.add({severity:'success',detail:'Акция удалена!',summary:'Успешно'})
}
  }catch(err){
    console.log(err)
  }finally{
    isDeleteOpen.value=true
  }
}

const confirmDelete = () => {
  isDeleteOpen.value=true;
};


</script>

<style scoped>
.sale-img{
    width:50%
}
</style>