<template>
    <div>
        <Button label="Скрыть еду" severity="secondary" rounded @click="isModalVisibleFood = !isModalVisibleFood" />
        <Dialog v-model:visible="isModalVisibleFood" modal header="Скрыть еду" :style="{ width: '35rem' }">
            <div class="card flex gap-3 mb-5  flex-column">
              <Dropdown v-model="selectedCategory" :options="categories" filter optionLabel="name" placeholder="Выберите категорию" @change="selectCategory">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Dropdown>  

            
            <MultiSelect display="chip" v-model="selectedFoodFalse" v-if='isFoodOpen' :options="selectedFoods?.Foods" filter optionLabel="name" placeholder="Выберите еду"
            :maxSelectedLabels="3"  :selectionLimit="3"   @change="handleFoodFalse" />
             <!-- <Dropdown v-model="selectedFoodFalse" v-if='isFoodOpen' placeholder="Выберите еду" filter :options="selectedFoods?.Foods" optionLabel="name"
             @change="handleFoodFalse"
             
             >
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
</Dropdown> -->

<div v-if="showCheck"  class="checkbox-hide">
    <Checkbox v-model="checked" :binary="true" id="hide-food" />
    <label for="hide-food" class="ml-1"> Скрыть </label>
  </div> 
  <Button  v-if="showCheck" label="Изменить" severity="info" class="mt-5" @click="hideFood"/>   
              
             
            </div>
</Dialog>
    </div>
</template>

<script setup lang="ts">
import http from '@/http';
import { useToast } from 'primevue/usetoast';
import {ref,onMounted} from 'vue';
import {Category,CategoryWithFoods} from '@/types/Category'
import { useStore } from 'vuex';
import { Food } from '@/types/Food';
const isModalVisibleFood =ref(false);
const store = useStore();
const showCheck=ref(false);
const checked =ref(false);
const selectedCategory = ref()
const toast=useToast()
const selectedFoodFalse = ref()
const selectedFoods=ref({} as CategoryWithFoods)
const categories = ref([] as Category[])
const isFoodOpen =ref(false)
const stoppedListFoodsFalse = ref([] as CategoryWithFoods[])

const selectCategory =(event:any)=>{
    console.log('event',event)
    isFoodOpen.value=true
    if(selectedFoodFalse?.value){
        selectedFoodFalse.value = null;
        showCheck.value = false
    }
    const filteredFoods= stoppedListFoodsFalse?.value?.find((item)=>item?.Category?.id===event?.value?.id)
    if(filteredFoods!==undefined && filteredFoods){
        selectedFoods.value =filteredFoods
    }
   
}

const handleFoodFalse = (event:any)=>{
    showCheck.value = true
}


const hideFood =()=>{
const foodNames = selectedFoodFalse?.value?.map((item:Food)=>item?.name);
console.log('foodNames',foodNames)
if(foodNames?.length>0){
    foodNames.forEach(async(name:string)=>{
    const body={
  "foodName": name,
  "status": checked.value
}
console.log('body',body)
try{
    console.log('request is being sent')
const response = await http.post('/admin/change-of-stop-list',body)
console.log('hide food response',response)
if(response.status===200){
    toast.add({severity:'success',detail:'Видимость еды обновлена!',summary:"Успешно"})
    isModalVisibleFood.value=false
    showCheck.value = false;
    selectedFoodFalse.value=null;
    selectedCategory.value = null;
    setTimeout(()=>{
window.location.reload()
    },700)
}
}catch(err){
    console.log(err)
}
})
}else{
    toast.add({severity:'error',summary:'Ошибка',detail:'Выберите блюдо!'})
}



}

const getStoppedFoods=async()=>{
    try{
const response = await http('admin/get-all-foods-stoplist-false')
if(response.status===200){
    stoppedListFoodsFalse.value = response.data
    console.log('stopped list false response',response.data)
    categories.value = response.data?.map((item:CategoryWithFoods)=>item?.Category)
    console.log('categories',categories)
}
    }catch(err){
        console.log(err)
    }
}


onMounted(async() => {
    await store.dispatch('getAllCategoryNames');
    getStoppedFoods()
})

</script>

<style scoped>
.checkbox-hide{
    display: flex;
    gap:5px;
}

</style>