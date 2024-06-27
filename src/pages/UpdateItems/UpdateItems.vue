<template>
    <div class="section">
        <Button label="Обновить еду" severity="secondary" rounded @click="isModalVisibleFood = !isModalVisibleFood" />
        <UpdatePopularFoor :isPopularOpen="isPopularOpen"/>

<HideFood/>
     
    </div>


    <div class="card flex justify-content-center ">
        <Dialog v-model:visible="isModalVisibleFood" modal header="Обновить еду" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">Обновить еду</span>
            <div class="card flex gap-3 mb-5  flex-column">
                <label for="category" class="font-semibold w-full">Старое название еды</label>
                <Dropdown v-model="allFoodName" :options="store.getters.allFoodsNamesObj" optionLabel="name"
                    placeholder="Выберите еду" class="w-full md:w-14rem" id="category"  @change="selectOld"/>
            </div>

            <div class="flex gap-3 mb-5 flex-column" v-if="openNew">
                <label for="name" class="font-semibold">Новое название</label>
                <InputText id="name" class="flex-auto" autocomplete="off" v-model.trim="newFoodName" />
            </div>

        
            <div class="flex   gap-3 mb-5 flex-column"  v-if="openNew">
                <label for="price" class="font-semibold">Новая цена</label>
                <InputNumber id="price" class="flex-auto" autocomplete="off" v-model="foodPrice" />
            </div>
            <div class="flex   gap-3 mb-5 flex-column"  v-if="openNew">
                <label for="price" class="font-semibold">Новый вес</label>
                <InputText id="price" class="flex-auto" autocomplete="off" v-model.trim="foodWeight" />
            </div>

            <div class="flex   gap-3 mb-5 flex-column"  v-if="openNew">
                <label for="price" class="font-semibold">Новый контейнер</label>
                <Dropdown v-model="selectedContainerName" :options="store.getters.allContainers" optionLabel="name"
                :placeholder="selectedContainerName?.name || 'Выбрать контейнер'" class="w-full md:w-14rem" id="category" />
                <!-- <InputText id="price" class="flex-auto" autocomplete="off" v-model.trim="newContainerName" /> -->
            </div>


            <div class="flex  gap-3 mb-5 flex-column"  v-if="openNew">
                <label for="Weight" class="font-semibold">Новое кол-во контейнера</label>
                <InputNumber id="Weight" class="flex-auto" autocomplete="off" v-model="newContainerCount" />
            </div>



            <div class="flex justify-content-end gap-2"  v-if="openNew">
                <Button type="button" label="Отменить" severity="secondary" @click='isModalVisibleFood = false'></Button>
                <Button type="button" label="Обновить" @click='updateFood'></Button>
            </div>

        </Dialog>
    </div>
    <Toast/>
</template>

<script setup lang="ts">
import http from '@/http';
import UpdatePopularFoor from '@/components/Update/PopularFood.vue'
import HideFood from '@/components/Update/HideFood.vue'
import { open } from 'fs/promises';
import { useToast } from 'primevue/usetoast';
import { ref ,onMounted,computed} from 'vue';
import { useStore } from 'vuex';
const isModalVisibleFood = ref(false);
const isPopularOpen=ref(false)
const allFoodName = ref({} as {name:string});
const newFoodName = ref('');
const foodPrice = ref(0);
const foodWeight = ref('');
//const selectedContainerName = ref<{ name: string }>({name:'adinai'} as { name: string });
const selectedContainerName = ref({name:'adinai'} as {name:string})
const newContainerName = ref('');
const newContainerCount = ref(0);
const openNew=ref(false)
const store=useStore()
const toast=useToast();

const selectOld =()=>{
   if(allFoodName.value){
    openNew.value=true;
    getFoodByName(allFoodName?.value?.name)
   }
}



const getFoodByName=async(foodName:string)=>{
    try{
const response=await http.post('foods/get-food-by-name',{
    foodName:foodName
})
console.log('get food name response',response);
if(response.status===200){
    foodPrice.value=response.data.price;
    foodWeight.value=response.data.weight;
    newContainerName.value=response.data.containerName;
    newContainerCount.value=response.data.containerCount;

    selectedContainerName.value={name:response.data.containerName};

    console.log("selectedContainerName ????",selectedContainerName);


}
    }catch(err){
        console.log(err)
    }
}


const optionValue =computed(()=>{
    return 'adin'
})

const updateFood =async()=>{
    if(newFoodName.value?.length){
try{
    const body={
        "newContainerCount": newContainerCount.value,
  "newContainerName": selectedContainerName.value?.name,
  "newName": newFoodName.value,
  "newPrice": foodPrice.value,
  "newWeight": foodWeight.value,
  "oldName": allFoodName?.value?.name
    }
const response= await http.put('admin/update-food',body)
console.log('response',response)
if(response.status===200){
    toast.add({severity:'success',summary:'Успешно',detail:'Еда обновлена'})
}
}catch(err){
    console.log(err)
}finally{
    openNew.value=false
    isModalVisibleFood.value=false
}
    }else{
        toast.add({severity:'error',summary:'Ошибка',detail:'Заполните поле для нового имени!'})
    }
}

onMounted(async() => {
  await  store.dispatch('getAllCategoryNames');
  store.dispatch('fetchAllContainers')
})
</script>

<style scoped></style>