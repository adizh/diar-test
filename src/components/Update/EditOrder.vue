<template>
  <section>
    <div class="grid mt-4 justify-content-center gap-3 align-items-center">
        <div class="flex flex-column gap-3 mb-5">
            <label for="address" class="font-semibold">Адрес</label>
            <InputText id="address" class="flex-auto" autocomplete="off" v-model.trim="orderValues.address" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Комментарий</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.comment" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Кол-во еды</label>
            <InputNumber id="comment" class="flex-auto" autocomplete="off" v-model="orderValues.dishesCount" />
        </div>

        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Вход</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.entrance" />
        </div>

        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Этаж</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.floor" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="sdacha" class="font-semibold">Сдача</label>
            <InputNumber id="sdacha" class="flex-auto" autocomplete="off" v-model.trim="orderValues.sdacha" />
        </div>

        <div class="flex flex-column gap-3 mb-5 col-12">
            <label for="comment" class="font-semibold">Еда</label>
            <div class="selected-food" v-if="orderValues?.foods">
                <div v-for="food in orderValues?.foods" :key="food?.name" class="each-food mb-3">
                        <div class="flex align-items-center">{{ food?.name }}
<Button label="X" severity="danger" small  @click="removeOrderValues(food)"/>
                        </div>

<div class="controls">
<Button label="-"  @click="decreaseOrderValues(food)"/>
<span>{{food?.quantity}}</span>
<Button label="+" @click="increaseOrderValues(food)"/>
</div>
               
                </div>
            </div>
            <Dropdown :options="updatedFoods"
            placeholder="Добавить еду" class="w-full md:w-14rem" id="category"  optionLabel="name"  v-model.trim="newSelectedFood" 
            @change="selectFood"
            />
            <div class="selected-food" v-if="selectedFoods?.length">
          <div v-for="food in selectedFoods" :key="food?.id" class="each-food mb-3">
                        <div class="flex align-items-center">{{ food?.name }}
<Button label="X" severity="danger" small @click="removeFood(food)"/>

                        </div>

<div class="controls">
<Button label="-" @click="decreaseCount(food)"/>
<span>{{food?.quantity}}</span>
<Button label="+"  @click="increaseCount(food)"/>
</div>
                </div>
            </div>
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Номер квартиры</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.houseNumber" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Внутренняя связь</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.intercom" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Квартира/Офис</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.kvOffice" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Метод оплаты</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.paymentMethod" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Цена</label>
            <InputNumber id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.price" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Имя</label>
            <InputText id="comment" class="flex-auto" autocomplete="off" v-model.trim="orderValues.userName" />
        </div>
        <div class="flex flex-column gap-3 mb-5">
            <label for="comment" class="font-semibold">Номер телефона</label>
            <InputMask id="phone" v-model.trim="orderValues.userPhone" mask="+996 (999) 99-99-99"
                placeholder="+996 (700) 11-11-11" />
        </div>
       

        <div class="flex flex-column gap-3 mb-5">
            <label for="deliveryPrice" class="font-semibold">Цена за доставку</label>
            <InputNumber id="deliveryPrice" class="flex-auto" autocomplete="off" v-model.trim="orderValues.deliveryPrice" />
        </div>
      
      
        <Toast/>
    </div>
    <div class="flex justify-content-end gap-2">
        <Button type="button" label="Отменить" severity="secondary" @click="emit('closeModal')"></Button>
        <Button type="button" label="Изменить" @click='updateOrder'></Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AwaitingOrder } from '@/types/Order'
import { OrderFood,Food } from '@/types/Food'
import {ref,onMounted,computed} from 'vue'
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import http from '@/http';
const props = defineProps<{
    order: AwaitingOrder,

}>()
const store =useStore();
const toast=useToast()
const selectedFoods=ref([] as any[])
const orderValues = ref({
    address: (''),
    comment: (''),
    dishesCount: (0),
    entrance: (''),
    floor: (''),
    foods: ([] as OrderFood[]),
    houseNumber: '',
    intercom: (''),
    kvOffice: (''),
    paymentMethod: (''),
    orderNumber:(0),
    price: (0),
    userName: (''),
    userPhone: (''),
    sdacha:0,
    deliveryPrice:0
})

const emit = defineEmits<{
  closeModal:[]
}>()

const updatedFoods=computed(()=>{
    return store.getters.getFood.map((food:Food)=>{
    return {...food, quantity:1}
})
})

const newSelectedFood = ref({} as OrderFood)

const selectFood =(event:any)=>{
 const isExist = selectedFoods.value.findIndex((item:Food)=>item.id===event.value.id);
    if(isExist===-1){
        selectedFoods.value.push(event?.value);
    }
}

const removeFood =(food:Food)=>{
    const index = selectedFoods.value.findIndex((item:Food)=>item.id===food.id);
    console.log('index',index)
    if(index!==-1){
        selectedFoods.value.splice(index,1)
    }
}


const increaseCount=(food:Food)=>{
food.quantity++
}

const decreaseOrderValues =(food:OrderFood)=>{
if(food?.quantity>1){
    food.quantity--
}
}

const removeOrderValues =(food:OrderFood)=>{
    const index = orderValues.value.foods?.findIndex((item:OrderFood)=>item.name===food.name);
    console.log('index',index)
    if(index!==-1){
        orderValues.value.foods.splice(index,1)
    }
}
const increaseOrderValues =(food:OrderFood)=>{
    food.quantity++
}


const decreaseCount=(food:Food)=>{
    if(food.quantity>1){
        food.quantity--;
    }
}


const updateOrder = async()=>{
    const foods=selectedFoods?.value?.map((item:Food)=>{
        return {name:item?.name, quantity:item?.quantity, price:item?.price}
    })
    const orderFoods=orderValues.value.foods?.map((item:OrderFood)=>{
        return {name:item?.name, quantity:item?.quantity, price:item?.price}
    })
    const totalFoods=[...foods,...orderFoods]
console.log('totalFoods',totalFoods)
    const body = {
        "address": orderValues.value.address,
        "comment": orderValues.value.comment,
        "dishesCount": orderValues.value.dishesCount,
        "entrance": orderValues.value.entrance,
        "floor": orderValues.value.floor,
        "foods": totalFoods,
        "houseNumber": orderValues.value.houseNumber,
        "intercom": orderValues.value.intercom,
        "kvOffice": orderValues.value.kvOffice,
        "paymentMethod": orderValues.value.paymentMethod,
        "price": orderValues.value.price,
        "userName": orderValues.value.userName,
        "userPhone": orderValues.value.userPhone,
        "sdacha":orderValues.value?.sdacha,
        "orderNumber":props?.order?.orderNumber,
        deliveryPrice:orderValues?.value?.deliveryPrice
    }

    const areFieldsFilled=Object.entries(orderValues.value)
    .filter(([key]) => {
        return key === 'foods' || key=== 'price' || key==='address' || key==='dishesCount' || key==='houseNumber' || key === 'userPhone' || key ==='userName'
    })
    .every(([item, value]) => {
        return value
    })

    if (areFieldsFilled){
        console.log('body',body)
     submitEdit(body)
    }else{
toast.add({severity:'error',summary:"Ошибка", detail:'Заполните обязательные поля!'})
    }
}



const submitEdit=async(body:any)=>{
    try{
    const response = await http.put('admin/update-order',body);
    console.log('response update order',response)
    if(response.status===200){
        toast.add({severity:'success',summary:"Успешно", detail:'Заказ обновлен!'})
        emit('closeModal')

        setTimeout(()=>{
window.location.reload()
        },600)
    }
    }catch(err){
        console.log(err)
    }
}

















onMounted(() => {
    orderValues.value.address=props?.order?.address
    orderValues.value.comment=props?.order?.comment
    orderValues.value.dishesCount=props?.order?.dishesCount
    orderValues.value.entrance=props?.order?.entrance
    orderValues.value.floor=props?.order?.floor
    orderValues.value.houseNumber=props?.order?.houseNumber
    orderValues.value.intercom=props?.order?.intercom
    orderValues.value.kvOffice=props?.order?.kvOffice
    orderValues.value.paymentMethod=props?.order?.paymentMethod
    orderValues.value.price=props?.order?.price
    orderValues.value.userName=props?.order?.userName
    orderValues.value.userPhone=props?.order?.userPhone
    orderValues.value.userPhone=props?.order?.userPhone;
orderValues.value.foods=props?.order?.foods
orderValues.value.sdacha=props?.order?.sdacha
orderValues.value.deliveryPrice=props?.order?.deliveryPrice ? props?.order?.deliveryPrice : 0;

})



</script>

<style scoped>

</style>