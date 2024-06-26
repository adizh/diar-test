vbas3<template>
    <div class="section">
        Самовывоз закрытых заказов
        <Card v-if="noOrder?.length">

            <template #content>{{
            noOrder }}</template>
        </Card>

        <ul v-else>
            <li v-for="order in orders" :key="order?.orderNumber">
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
const orders = ref<AwaitingOrder[]>([])
const currentPage =ref(1)
const totalItems =ref(0)


const changePage =(event:{page:number,})=>{
    currentPage.value = event?.page+1;
    fetchOrders();
    window.scrollTo(0,0)
}
const fetchOrders = async () => {
    try {
        const response = await http.get(`admin/get-all-closed-pickup-orders?page=${currentPage?.value}`) as any;
        console.log('response closed pickup', response)
        if (response.status === 204) {
            noOrder.value = response.statusText
        }

        else if (response.status == 200) {
            orders.value = response.data?.pickUpOrderResponse
            totalItems.value = response.data?.totalItems
        }

    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    fetchOrders();

})



</script>

<style scoped></style>
