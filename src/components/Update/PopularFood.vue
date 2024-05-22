<template>
    <div>
        <Button label="Изменить статус еды" severity="secondary" rounded @click="isPopularOpen = true" />
        <Dialog v-model:visible="isPopularOpen" modal header="Изменить статус еды" :style="{ width: '25rem' }">
       <div  class='flex flex-row justify-content-center'>
       

        <div  class='flex flex-column justify-content-center gap-3 align-items-center'>
            <div>
                <Dropdown v-model="selectedFood" :options="store.getters.getAllFoods"
                placeholder="Выбрать еду" class="w-full md:w-14rem" optionLabel="name" />
               </div>
        
              <div>
                <Checkbox v-model="isPopular" inputId="popular" name="popular" value="Популярный"   :binary="true"/>
                <label for="popular" class="ml-1"> Популярный </label>
              </div>
               </div>
        
        </div>

    <div class='flex flex-row justify-content-center mt-5'>
    <Button label="Добавить" severity="info" @click="addPopularFood"/>
    </div>
            </Dialog>
            <Toast/>
    </div>

</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { useStore } from 'vuex';
import {Food} from '@/types/Food'
const store=useStore();
const selectedFood=ref({} as Food);
const isPopular =ref(false)
const isPopularOpen =ref(false);
import http from '@/http';
import { useToast } from 'primevue/usetoast';
const toast=useToast()
const addPopularFood = async() => {
    if(selectedFood?.value?.id){
        console.log('isPopular',isPopular)
        console.log('selectedFood',selectedFood)
        try {
           const response = await http.post('admin/change-is-featured',{
            "changeTo": isPopular.value,
  "foodName": selectedFood?.value?.name
            
           }) 
           if(response.status===200){
            toast.add({severity:'success',detail:'Статус еды изменен!',summary:"success"})
           }
        } catch(err){
            console.log(err)
        }finally{
            isPopularOpen.value=false;
            
        }
    }
}

onMounted(() => {
    store.dispatch('fetchAllFoods')
});

</script>


<style scoped>

</style>