<template>
    <div class="section">
        Заказы в ожидании на самовывоз
        <Card v-if="noOrder?.length">
            <template #content>{{
            noOrder }}</template>
        </Card>
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
        const response = await http.get('admin/get-all-awaiting-pickup-orders') as any;
        console.log('response', response)

        if (response.status === 204) {
            noOrder.value = response.statusText
        }
        else if (response.status === 200) {
            awaitingOrders.value = response.data.message;
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