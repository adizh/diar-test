<template>
    <div class="section">
<div class="mb-5">
    <p>Заказы на кухне</p>
<div class="card-list">
    <Order v-for="order in kitchedOrders" :key="order?.orderNumber" :order="order" from="kitchen"/>
</div>

</div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import http from '@/http'
import {AwaitingOrder} from '@/types/Order'
import Order from '@/components/Order.vue';
const kitchedOrders=ref([] as AwaitingOrder[])

const fetchKitchenOrder=async()=>{
    try{
const response = await http('admin/get-all-cooked-orders');
console.log('response')
if(response.status===200){
    kitchedOrders.value=response.data.orders
}
    }catch(err){
        console.log(err)
    }
}
onMounted(()=>{
    fetchKitchenOrder()
})
</script>

<style scoped>

</style>