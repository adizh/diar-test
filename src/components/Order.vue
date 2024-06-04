<template>
    <Card>
        <template #title>
          <div class='flex flex-row gap-3 align-items-center'>
            <p>Номер заказа: {{ order?.orderNumber }}</p>
            <Button v-if="from==='kitchen'" label="Назначить курьера" severity="success" raised  @click="isDelegOpen=true"/>
            <Button v-if="from==='awaiting-pickup' ||from==='awaiting' " v-tooltip.top="'Добавить еду'"  icon="pi pi-plus" severity="info" raised 

            @click="isAddNewFoodOpen=true"/>
            <Button v-if="from==='awaiting-pickup' || from==='awaiting'" icon="pi pi-times" severity="danger" v-tooltip.top="'Отменить заказ'"  @click="isCancelOpen=true"/>
       
        </div>

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
                <span v-if="order.deliveryPrice" >Цена за доставку :{{ order?.deliveryPrice }}</span>
                <span>Комментарий: {{ order?.comment }}</span>
                <span>Имя: {{ order?.userName }}</span>
                <span>Номер телефона :{{ order?.userPhone }}</span>
            <div class="order-info" v-if="order.address">Адрес: {{ order?.address }}
                <span v-if="order.entrance">Вход: {{ order.entrance }}</span>
                <span v-if="order.floor">Этаж: {{ order?.floor }}</span>
                <span v-if="order.houseNumber">Номер квартиры: {{ order?.houseNumber }}</span>
                <span v-if="order.intercom">Внутренняя связь: {{ order?.intercom }}</span>
                <span v-if="order.kvOffice">Квартира/Офис: {{ order?.kvOffice }}</span>
            </div>
            <span v-if="order.paymentMethod">Метод оплаты:{{ order?.paymentMethod }}</span>
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

    <Dialog v-model:visible="isCancelOpen" modal header="Отменить заказ" :style="{ width: '25rem' }">
     <ConfirmButtons confirmText="Да"  declineText="Нет" @close-modal="isCancelOpen=false" @confirm-action="cancelOrder" :descr-text="'Вы действительно хотите отменить заказ'"/>
    </Dialog>


    <Dialog v-model:visible="isAddNewFoodOpen" modal header='Добавить еду' :style="{ width: '25rem' }">

        <OrderAddFood :order="order" @closeModal="closeModal" :from='from'/>
    </Dialog>



    <Toast/>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import { AwaitingOrder } from '@/types/Order'
const props = defineProps<{
    order: AwaitingOrder,
    type?:string,
    from?:string

}>()

const isAddNewFoodOpen=ref(false);
import OrderAddFood from '@/components/Orders/AddNew.vue'
const store=useStore();
const isDelegOpen=ref(false);
const isCancelOpen=ref(false);
import { useStore } from 'vuex';
import { Courier } from '@/types/Courier';
import http from '@/http';
import { useToast } from 'primevue/usetoast';
const selectedCourier=ref({} as Courier)
const toast=useToast();
import ConfirmButtons from './UI/ConfirmButtons.vue';


const delegateOrder =async()=>{
if(selectedCourier?.value?.id){

    try{
        const body={
            "courierId":selectedCourier?.value?.id,
             "orderNumber": props?.order?.orderNumber
        }
const response = await http.post('admin/delegation-to-courier',body);
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


const cancelOrder =async()=>{
    const url = props?.from==='awaiting' ? 'admin/cancel-order' :  props?.from==='awaiting-pickup' ? 'admin/cancel-pickup-order':'' 
    try{
        const response = await http.post(url,{orderNumber:props?.order?.orderNumber});
        if(response.status===200){
            toast.add({severity:'success',detail:'Заказ отменен!',summary:'Успешно'});
        setTimeout(()=>{
window.location.reload()
        },1500)

        }
    }catch(err){
        console.log(err)
    }
}




const closeModal =()=>{
    isAddNewFoodOpen.value=false;

    setTimeout(()=>{
     window.location.reload();
    },1000)

}
onMounted(async() => {
   await store.dispatch('fetchAllCouriers');
});


</script>

<style scoped lang="scss">
@import '../assets/mixins.scss';
.order-info {
    @include flex(column, center, start)
}
</style>