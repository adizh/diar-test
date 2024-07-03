<template>
    <div>
        <Button label="Изменить статус еды" severity="secondary" rounded @click="isPopularOpen = true" />
        <Dialog v-model:visible="isPopularOpen" modal header="Изменить статус еды" :style="{ width: '35rem' }">
       <div  class='flex flex-row justify-content-center'>
       

        <div  class='flex flex-column justify-content-center gap-3 align-items-center w-full'>
            <div class="w-full">

                <MultiSelect display="chip"  class="w-full" v-model="selectedFood"  :options="store.getters.getAllFoods" filter optionLabel="name" placeholder="Выберите еду"
                :maxSelectedLabels="3"  :selectionLimit="3" @change="changeFood"/>
                <!-- <Dropdown v-model="selectedFood" :options="store.getters.getAllFoods" filter
                placeholder="Выбрать еду" class="w-full md:w-14rem" optionLabel="name"  @change="changeFood"/> -->
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
const selectedFood=ref();
const isPopular =ref(false)
const isPopularOpen =ref(false);
import http from '@/http';
import { useToast } from 'primevue/usetoast';
const toast=useToast()

const changeFood =(event:any)=>{
    // console.log('changeFood event',event)
    // isPopular.value=event.value[]?.isFeatured;
}
const addPopularFood = async() => {
   console.log('selectedFood',selectedFood)
const names = selectedFood?.value?.map((food:Food)=>food?.name)
names.forEach(async(name:string)=>{
    const body ={
               "changeTo": isPopular.value,
            "foodName":name
    }
    try {
           const response = await http.post('admin/change-is-featured',body) 
           if(response.status===200){
            toast.add({severity:'success',detail:'Статус еды изменен!',summary:"Успешно"})

            isPopular.value = false;
           }
        } catch(err){
            console.log(err)
        }finally{
            isPopularOpen.value=false;
            store.dispatch('fetchAllFoods')
            
        }
})

    
    
}

onMounted(() => {
    store.dispatch('fetchAllFoods')
});

</script>


<style scoped>

</style>