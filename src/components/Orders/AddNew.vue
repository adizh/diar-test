<template>
    <div>
     <div class="flex flex-column gap-2">
        <label for="comment" class="font-semibold">Еда</label>
        <Dropdown :options="updatedFoods"
        placeholder="Выбрать еду" class="w-full md:w-14rem" id="category"  optionLabel="name"  v-model.trim="currentFood" 
        @change="selectFood"
        />
     </div>

     <div class="selected-food mt-3" v-if="selectedFoods?.length">
        <div v-for="food in selectedFoods" :key="food?.value?.id" class="each-food">
  
                <div class="flex align-items-center">{{ food?.value?.name }}
<Button label="X" severity="danger" small @click="removeFood(food.value)"/>

                </div>

<div class="controls">
<Button label="-" @click="decreaseCount(food.value)"/>
<span>{{food?.value?.quantity}}</span>
<Button label="+"  @click="increaseCount(food.value)"/>
</div>
       
        </div>
    </div>

    <div class="flex flex-row justify-content-center">
        <Button label="Добавить" severity="success" @click="addFood" class="mt-5"/>
    </div>
    </div>
</template>



<script setup lang="ts">
import http from '@/http';
import { Food} from '@/types/Food';
import { AwaitingOrder } from '@/types/Order';
import { useToast } from 'primevue/usetoast';
import { onMounted,computed,ref } from 'vue';
import { useStore } from 'vuex';
const selectedFoods=ref([] as {value:Food}[]);
const currentFood=ref({} as Food)
const store=useStore();
const toast=useToast()
const props = defineProps<{
  order?: AwaitingOrder
  from?:string
}>();

const selectFood =(event:any)=>{
    console.log(event)
    console.log(event)
    const isExist = selectedFoods?.value?.findIndex((item:any)=>item.value.id===event.value.id);
    if(isExist===-1){
        selectedFoods.value.push(event);
    }
setTimeout(()=>{
  
},500)
}

const emit=defineEmits(['closeModal'])
const removeFood =(food:Food)=>{
    const index = selectedFoods.value.findIndex((item:{value:Food})=>item.value.id===food.id);
    console.log('index',index)
    if(index!==-1){
        selectedFoods.value.splice(index,1)
    }
}
const increaseCount=(food:Food)=>{
food.quantity++
}
const decreaseCount=(food:Food)=>{
    if(food.quantity>1){
        food.quantity--;
    }
}
const updatedFoods=computed(()=>{
    return store.getters.getFood.map((food:Food)=>{
    return {...food, quantity:1}
})
})

const addFood =async()=>{
    if(selectedFoods?.value?.length>0){

    
const foods=selectedFoods.value?.map((item)=>{
    return{
        "name": item?.value?.name,
      "price": item?.value?.price,
      "quantity": item?.value?.quantity
    }
})
    const body={
        newFoods:foods,
        orderNumber:props?.order?.orderNumber
    }

const url=props?.from==='awaiting-pickup' ? 'admin/add-food-for-pickup-order': props?.from==='awaiting' ? "admin/add-food-for-order":""
    try{
const response = await http.post(url,body);

console.log('response',response)
if(response.status===200){
    toast.add({severity:"success",detail:'Еда добавлена!',summary:'Успешно'});
    emit('closeModal')
}
}catch(err){
    console.log(err)
}
}else{
    toast.add({severity:'error',detail:'Выберите еду!',summary:"Ошибка"})
}
}
onMounted(()=>{
    store.dispatch('fetchAllFood');
})
</script>

<style scoped>
.selected-food{
    display: flex;
    flex-direction: column;
    gap:15px
}
.each-food{
    display: flex;
    justify-content: space-between;
}
.controls{
    display: flex;
    gap:10px;
    align-items: center;
}
.controls button:hover{
    cursor: pointer;
}
</style>