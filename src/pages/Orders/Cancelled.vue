<template>
    <div class="section">
        Cancelled orders

        <Card v-if="noOrder?.length">

            <template #content>{{
            noOrder }}</template>
        </Card>
        <!-- <Card v-if="!awaitingOrders?.length">

            <template #content>{{
            noOrder }}</template>
        </Card>

        <ul v-else>
            <li v-for="order in awaitingOrders" :key="order?.orderNumber">
                <Order :order="order" />
            </li>
        </ul> -->
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


const fetchAwaitingOrders = async () => {
    try {
        const response = await http.get('admin/get-all-cancel-orders') as any;
        console.log('response', response)
        if (response.status === 204) {
            noOrder.value = response.statusText
        }

        // else if (response.status == 200) {
        //     awaitingOrders.value = response.data.orders
        // }

    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    fetchAwaitingOrders();

})



</script>

<style scoped></style>
