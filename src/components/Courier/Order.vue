<template>
    <div class='section'>

        <Button label="Назад" severity="warning" class="mb-3" @click="router.push('/all-couriers')"/>
        <Card v-if="!ordersByCourier?.length">

            <template #content>Нет данных</template>
        </Card>

        <ul v-else class='card-list'>
            <li v-for="order in ordersByCourier" :key="order.timeRequest">
                <Order :order="order" />
            </li>
        </ul>


    </div>
</template>

<script setup lang="ts">
import http from '@/http';
import { AwaitingOrder } from '@/types/Order';
import { useRoute, useRouter } from 'vue-router';
import {ref,onMounted} from 'vue';
import Order from '@/components/Order.vue';
const route=useRoute()
const ordersByCourier=ref([] as AwaitingOrder[])
const router=useRouter()
const fetchOrderByCourier=async()=>{
    try{
const response = await http(`admin/get-all-actual-orders-by-courier-for-admin?courierId=${route?.params?.id}`);
console.log(response)
if(response.status===200){
 ordersByCourier.value=response.data;
 console.log('ordersByCourier',ordersByCourier)
}
    }catch(err){
        console.log(err)
    }
}
// onMounted(()=>{
//     fetchOrderByCourier()
// })
onMounted(() => {
    console.log('Component mounted, fetching data...');
    fetchOrderByCourier();
});
</script>

<style scoped>

</style>