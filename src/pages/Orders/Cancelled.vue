<template>
    <div class="section">
        Отмененные заказы

       
        <Card v-if="!awaitingOrders?.length">
            <template #content>{{
            noOrder }}</template>
        </Card>

        <ul v-else class='card-list'>
            <li v-for="order in awaitingOrders" :key="order?.orderNumber">
                <Order :order="order" />
            </li>
        </ul>
        <Paginator :rows="10" :totalRecords="totalItems" @page="changePage"></Paginator>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import http from '@/http';
import { AwaitingOrder } from '@/types/Order'
import { onMounted } from 'vue';
import Order from '@/components/Order.vue';

const noOrder = ref('');
const awaitingOrders = ref<AwaitingOrder[]>([])

const currentPage=ref(1)
const totalItems=ref(1);

const changePage =(event:{page:number,})=>{
    currentPage.value = event?.page+1;
    fetchAwaitingOrders();
    window.scrollTo(0,0)
}

const fetchAwaitingOrders = async () => {
    try {
        const response = await http.get(`admin/get-all-cancel-orders?page=${currentPage?.value}`) as any;
        console.log('response cancelled orders', response)
        if (response.status === 204) {
            noOrder.value = response.statusText
        }

        else if (response.status == 200) {
            awaitingOrders.value = response.data.orderResponse
            totalItems.value =response.data?.totalItems
        }
    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    fetchAwaitingOrders();

})


</script>

<style scoped></style>
