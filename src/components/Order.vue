<template>
    <Card>
        <template #title>Номер заказа: {{ order?.orderNumber }}
            <Button v-if="type!=='delegated'" label="Назначить курьера" severity="success" raised  @click="isDelegOpen=true"/>
        </template>
        <template #content>
          <div>
            Еда: 
      <DataTable :value="order?.foods" :tableStyle="{minWidth: '100%'}" class="mb-2">
    <Column field="name" header="Название"></Column>
    <Column field="quantity" header="Кол-во"></Column>
    <Column field="price" header="Цена"></Column>

      </DataTable>
          </div>
            <p class="m-0 order-info">
                <span>Цена: {{ order?.price }}</span>
                <span>Сдача: {{ order?.sdacha }}</span>
                <span>Статус: {{ order?.status }}</span>
                <span>Кол-во блюд: {{ order?.dishesCount }}</span>
                <span>Цена за доставку :{{ order?.deliveryPrice }}</span>
                <span>Комментарий: {{ order?.comment }}</span>
                <span>Имя: {{ order?.userName }}</span>
                <span>Номер телефона :{{ order?.userPhone }}</span>
            <div class="order-info">Адрес: {{ order?.address }}
                <span>Вход: {{ order.entrance }}</span>
                <span>Этаж: {{ order?.floor }}</span>
                <span>Номер квартиры: {{ order?.houseNumber }}</span>
                <span>Внутренняя связь: {{ order?.intercom }}</span>
                <span>Квартира/Офис: {{ order?.kvOffice }}</span>


            </div>
            <span>Метод оплаты:{{ order?.paymentMethod }}</span>
            <span>Запрошенное время:{{ order?.timeRequest }}</span>
            </p>
        </template>

    </Card>



    <Dialog v-model:visible="isDelegOpen" modal header="Назначить курьера" :style="{ width: '25rem' }">
<div class='flex flex-column gap-5 align-items-center'>
    <Dropdown v-model="selectedCourier" :options="store?.getters?.getCouriers" optionLabel="username" placeholder="Выбрать курьера" class="w-full md:w-14rem" />

    <Button label="Назначить" icon="pi pi-check" severity="info"  @click="delegateOrder"/>
</div>
    </Dialog>
    <Toast/>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import { AwaitingOrder } from '@/types/Order'
const props = defineProps<{
    order: AwaitingOrder,
    type?:string

}>()
const store=useStore()
const isDelegOpen=ref(false)

import { useStore } from 'vuex';
import { Courier } from '@/types/Courier';
import http from '@/http';
import { useToast } from 'primevue/usetoast';
const selectedCourier=ref({} as Courier)
const toast=useToast()


const delegateOrder =async()=>{
if(selectedCourier?.value?.id){

    try{
        const body={
            "courierId":selectedCourier?.value?.id,
             "orderNumber": props?.order?.orderNumber,
             "status": props?.order?.status
        }
const response = await http.post('admin/delegation-to-courier',body);
console.log('response',response);
if(response.status===200){
    toast.add({severity:'success','summary':'Успешно','detail':"Курьер назначен"}) 
}
    }catch(err){
        console.log(err)
    }finally{
        isDelegOpen.value=false
    }
}else{
    toast.add({severity:'error','summary':'Ошибка','detail':"Выберите курьера"})
}
}

onMounted(async() => {
   await store.dispatch('fetchAllCouriers');
    console.log('getCouriers',store.getters?.getCouriers)
})
</script>

<style scoped lang="scss">
@import '../assets/mixins.scss';

.order-info {
    @include flex(column, center, start)
}
</style>