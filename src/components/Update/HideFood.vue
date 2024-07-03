<template>
    <div>
        <Button label="Скрыть еду" severity="secondary" rounded @click="isModalVisibleFood = !isModalVisibleFood" />
        <Dialog v-model:visible="isModalVisibleFood" modal header="Скрыть еду" :style="{ width: '35rem' }">
            <div class="card flex gap-3 mb-5  flex-column">
                <Dropdown v-model="selectedCategory"  placeholder="Выберите категорию"/>
                <!-- <Dropdown v-model="allFoodName" :options="store.getters.allFoodsNamesObj" optionLabel="name"
                    placeholder="Выберите еду" class="w-full md:w-14rem" id="category"  @change="selectFood"/>
                  <div v-if="showCheck"  class="checkbox-hide">
                    <Checkbox v-model="checked" :binary="true" id="hide-food" />
                    <label for="hide-food" class="ml-1"> Скрыть </label>
                  </div>
                  <Button  v-if="showCheck" label="Изменить" severity="info" class="mt-5" @click="hideFood"/> -->
            </div>
</Dialog>
    </div>
</template>

<script setup lang="ts">
import http from '@/http';
import { Food } from '@/types/Food';
import { useToast } from 'primevue/usetoast';
import {ref,onMounted} from 'vue';
import {Category,CategoryWithFoods} from '@/types/Category'
import { useStore } from 'vuex';
const isModalVisibleFood =ref(false);
const allFoodName = ref({} as {name:string});
const store = useStore();
const showCheck=ref(false);
const checked =ref(false);
const selectedCategory = ref({} as Category)
const selectedFood=ref({} as Food | null)
const toast=useToast()
const selectFood = (event:any)=>{
    showCheck.value=true;
    selectedFood.value = event.value
}

const stoppedListFoods = ref([] as )

const hideFood =async()=>{
    const body={
  "foodName": selectedFood.value?.name,
  "status": checked.value
}
try{
const response = await http.post('/admin/change-of-stop-list',body)
console.log('hide food response',response)
if(response.status===200){
    toast.add({severity:'success',detail:'Видимость еды обновлена',summary:"Успешно"})
    isModalVisibleFood.value=false
    showCheck.value = false;
    selectedFood.value=null;
}
}catch(err){
    console.log(err)
}
}



const getStoppedFoods=async()=>{
    try{
const response = await http('admin/get-all-foods-stoplist-false')
if(response.status===200){

}
    }catch(err){
        console.log(err)
    }
}


onMounted(async() => {
    await store.dispatch('getAllCategoryNames');
})

</script>

<style scoped>
.checkbox-hide{
    display: flex;
    gap:5px;
}
</style>